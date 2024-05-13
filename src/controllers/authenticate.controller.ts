import {
  Body,
  Controller,
  Post,
  UsePipes,
  HttpCode,
  UnauthorizedException,
} from '@nestjs/common'
import { PrismaService } from '@/prisma/prisma.service'

import { compare } from 'bcryptjs'
import { z } from 'zod'
import { ZodValidationPipe } from '@/pipes/zod-validation-pipe'
import { JwtService } from '@nestjs/jwt'

const authenticateBodySchema = z.object({
  email: z.string().email(),
  password: z.string(),
})

type AuthenticateDTO = z.infer<typeof authenticateBodySchema>

@Controller('/sessions')
export class AuthenticateController {
  constructor(
    private readonly prisma: PrismaService,
    private jwt: JwtService,
  ) {}

  @Post()
  @HttpCode(200)
  @UsePipes(new ZodValidationPipe(authenticateBodySchema))
  async handle(@Body() body: AuthenticateDTO) {
    const { email, password } = body

    const userExists = await this.prisma.user.findUnique({
      where: { email },
    })

    if (!userExists) {
      throw new UnauthorizedException('E-mail or password incorrect')
    }

    const passwordMatch = await compare(password, userExists.password)

    if (!passwordMatch) {
      throw new UnauthorizedException('E-mail or password incorrect')
    }

    const token = this.jwt.sign({ sub: userExists.id })

    return { access_token: token }
  }
}

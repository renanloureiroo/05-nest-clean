import {
  ConflictException,
  Body,
  Controller,
  Post,
  UsePipes,
} from '@nestjs/common'
import { PrismaService } from '@/infra/prisma/prisma.service'

import { hash } from 'bcryptjs'
import { z } from 'zod'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'

const createAccountBodySchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string(),
})

type CreateAccountDTO = z.infer<typeof createAccountBodySchema>

const PASSWORD_SALT_HASH = 8

@Controller('/accounts')
export class CreateAccountController {
  constructor(private readonly prisma: PrismaService) {}

  @Post()
  @UsePipes(new ZodValidationPipe(createAccountBodySchema))
  async handle(@Body() body: CreateAccountDTO) {
    const { name, email, password } = body

    const userWithSameEmail = await this.prisma.user.findUnique({
      where: { email },
    })

    if (userWithSameEmail) {
      throw new ConflictException(
        'User with same e-mail address already exists',
      )
    }

    const passwordHashed = await hash(password, PASSWORD_SALT_HASH)

    await this.prisma.user.create({
      data: {
        name,
        email,
        password: passwordHashed,
      },
    })
  }
}

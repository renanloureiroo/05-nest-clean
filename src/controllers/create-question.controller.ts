import { Body, Controller, Post, UseGuards } from '@nestjs/common'
import { PrismaService } from '@/prisma/prisma.service'

import { z } from 'zod'
import { ZodValidationPipe } from '@/pipes/zod-validation-pipe'

import { JwtAuthGuard } from '@/auth/jwt-auth-guard'
import { CurrentUser } from '@/auth/current-user-decorator'
import { UserPayload } from '@/auth/jwt.strategy'

const crateQuestionBodySchema = z.object({
  title: z.string(),
  content: z.string(),
})

type CrateQuestionDTO = z.infer<typeof crateQuestionBodySchema>

@Controller('/questions')
@UseGuards(JwtAuthGuard)
export class CrateQuestionController {
  constructor(private readonly prisma: PrismaService) {}

  @Post()
  async handle(
    @CurrentUser()
    user: UserPayload,
    @Body(new ZodValidationPipe(crateQuestionBodySchema))
    body: CrateQuestionDTO,
  ) {
    const { content, title } = body
    const slug = this.titleToSlug(title)

    await this.prisma.question.create({
      data: {
        content,
        title,
        authorId: user.sub,
        slug,
      },
    })
  }

  private titleToSlug(title: string): string {
    return title
      .toLowerCase()
      .normalize('NFC')
      .replace(/ /g, '-')
      .replace(/[^\w-]+/g, '')
  }
}

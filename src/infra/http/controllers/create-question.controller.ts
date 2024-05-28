import { BadRequestException, Body, Controller, Post } from '@nestjs/common'

import { z } from 'zod'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'

import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { CreateQuestionUseCase } from '@/domain/forum/application/use-cases/create-question'

const crateQuestionBodySchema = z.object({
  title: z.string(),
  content: z.string(),
})

type CrateQuestionDTO = z.infer<typeof crateQuestionBodySchema>

@Controller('/questions')
export class CreateQuestionController {
  constructor(private readonly createQuestion: CreateQuestionUseCase) {}

  @Post()
  async handle(
    @CurrentUser()
    user: UserPayload,
    @Body(new ZodValidationPipe(crateQuestionBodySchema))
    body: CrateQuestionDTO,
  ) {
    const { content, title } = body

    const result = await this.createQuestion.execute({
      content,
      title,
      authorId: user.sub,
      attachmentsIds: [],
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }
  }
}

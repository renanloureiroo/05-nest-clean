import { Controller, Get, Query, UseGuards } from '@nestjs/common'

import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'

import { z } from 'zod'
import { JwtAuthGuard } from '@/infra/auth/jwt-auth-guard'
import { ListRecentQuestionsUseCase } from '@/domain/forum/application/use-cases/list-recent-questions'
import { QuestionPresenter } from '../presenters/question-presenter'

const pageQueryParamSchema = z
  .string()
  .optional()
  .default('1')
  .transform(Number)
  .pipe(z.number().min(1))

type PageQueryParam = z.infer<typeof pageQueryParamSchema>

const queryValidationPipe = new ZodValidationPipe(pageQueryParamSchema)

@Controller('/questions')
@UseGuards(JwtAuthGuard)
export class FetchRecentQuestionsController {
  constructor(
    private readonly listRecenteQuestions: ListRecentQuestionsUseCase,
  ) {}

  @Get()
  async handle(@Query('page', queryValidationPipe) page: PageQueryParam = 1) {
    const result = await this.listRecenteQuestions.execute({
      page,
    })

    if (result.isLeft()) {
      throw new Error('Error fetching recent questions')
    }

    return {
      questions: result.value.questions.map((question) =>
        QuestionPresenter.toHttp(question),
      ),
    }
  }
}

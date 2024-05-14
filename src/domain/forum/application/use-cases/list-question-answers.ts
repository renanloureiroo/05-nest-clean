import { Either, right } from '@/core/either'

import { Answer } from '../../enterprise/entities/answer'
import { AnswersRepository } from '../repositories/answers-repository'

interface ListQuestionAnswersUseCaseDTO {
  page?: number
  questionId: string
}

type ListQuestionAnswersUseCaseResponse = Either<
  null,
  {
    answers: Answer[]
  }
>

export class ListQuestionAnswersUseCase {
  constructor(private readonly answersRepository: AnswersRepository) {}

  async execute({
    questionId,
    page = 1,
  }: ListQuestionAnswersUseCaseDTO): Promise<ListQuestionAnswersUseCaseResponse> {
    const answers = await this.answersRepository.findManyByQuestionId(
      questionId,
      { page },
    )
    return right({
      answers,
    })
  }
}

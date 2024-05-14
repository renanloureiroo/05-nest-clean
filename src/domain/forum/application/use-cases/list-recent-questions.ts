import { Either, right } from '@/core/either'

import { Question } from '../../enterprise/entities/question'
import { QuestionsRepository } from '../repositories/questions-repository'

interface ListRecentQuestionsUseCaseDTO {
  page?: number
}

type ListRecentQuestionsUseCaseResponse = Either<
  null,
  {
    questions: Question[]
  }
>

export class ListRecentQuestionsUseCase {
  constructor(private readonly questionRepository: QuestionsRepository) {}

  async execute({
    page = 1,
  }: ListRecentQuestionsUseCaseDTO): Promise<ListRecentQuestionsUseCaseResponse> {
    const questions = await this.questionRepository.findManyRecent({ page })

    return right({
      questions,
    })
  }
}

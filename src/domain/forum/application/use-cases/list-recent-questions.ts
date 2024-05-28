import { Either, right } from '@/core/either'

import { Question } from '../../enterprise/entities/question'
import { QuestionsRepository } from '../repositories/questions-repository'
import { Injectable } from '@nestjs/common'

interface ListRecentQuestionsUseCaseDTO {
  page?: number
}

type ListRecentQuestionsUseCaseResponse = Either<
  null,
  {
    questions: Question[]
    totalPages: number
    currentPage: number
  }
>

@Injectable()
export class ListRecentQuestionsUseCase {
  constructor(private readonly questionRepository: QuestionsRepository) {}

  async execute({
    page = 1,
  }: ListRecentQuestionsUseCaseDTO): Promise<ListRecentQuestionsUseCaseResponse> {
    const questions = await this.questionRepository.findManyRecent({
      page,
      perPage: 20,
    })

    const totalQuestions = await this.questionRepository.count()

    return right({
      questions,
      totalPages: Math.ceil(totalQuestions / 20),
      currentPage: page,
    })
  }
}

import { PaginationParams } from '@/core/repositories/pagination-params'

import { Answer } from '../../enterprise/entities/answer'

interface AnswersRepository {
  create(answer: Answer): Promise<void>
  delete(answer: Answer): Promise<void>
  findById(id: string): Promise<Answer | null>
  findManyByQuestionId(
    questionId: string,
    pagination: PaginationParams,
  ): Promise<Answer[]>
  update(answer: Answer): Promise<void>
}

export { AnswersRepository }

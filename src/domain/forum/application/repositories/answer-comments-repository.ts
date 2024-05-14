import { PaginationParams } from '@/core/repositories/pagination-params'

import { AnswerComment } from '../../enterprise/entities/answer-comment'

export interface AnswerCommentsRepository {
  create(comment: AnswerComment): Promise<void>
  findById(id: string): Promise<AnswerComment | null>
  findManyByAnswerId(
    answerId: string,
    pagination: PaginationParams,
  ): Promise<AnswerComment[]>
  delete(id: string): Promise<void>
}

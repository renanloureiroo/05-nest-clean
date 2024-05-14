import { PaginationParams } from '@/core/repositories/pagination-params'

import { QuestionComment } from '../../enterprise/entities/question-comment'

export interface QuestionCommentsRepository {
  create(comment: QuestionComment): Promise<void>
  findById(id: string): Promise<QuestionComment | null>
  findManyByQuestionId(
    questionId: string,
    pagination: PaginationParams,
  ): Promise<QuestionComment[]>
  delete(id: string): Promise<void>
}

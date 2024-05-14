import { PaginationParams } from '@/core/repositories/pagination-params'

import { Question } from '../../enterprise/entities/question'

interface QuestionsRepository {
  create(question: Question): Promise<void>
  delete(question: Question): Promise<void>
  findBySlug(slug: string): Promise<Question | null>
  findById(questionId: string): Promise<Question | null>
  findManyRecent(params: PaginationParams): Promise<Question[]>
  update(question: Question): Promise<void>
}

export { QuestionsRepository }

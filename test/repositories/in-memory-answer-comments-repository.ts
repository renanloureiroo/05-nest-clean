import { DomainEvents } from '@/core/events/domain-events'
import { PaginationParams } from '@/core/repositories/pagination-params'
import { AnswerCommentsRepository } from '@/domain/forum/application/repositories/answer-comments-repository'
import { AnswerComment } from '@/domain/forum/enterprise/entities/answer-comment'

class InMemoryAnswerCommentsRepository implements AnswerCommentsRepository {
  private readonly answerComments: AnswerComment[] = []

  async findManyByAnswerId(
    answerId: string,
    { page }: PaginationParams,
  ): Promise<AnswerComment[]> {
    const comments = this.answerComments
      .filter((answerComment) => answerComment.answerId.toString() === answerId)
      .slice((page - 1) * 20, page * 20)

    return comments
  }

  async findById(id: string): Promise<AnswerComment | null> {
    const comment = this.answerComments.find(
      (comment) => comment.id.toString() === id,
    )

    if (!comment) {
      return null
    }

    return comment
  }

  async delete(id: string): Promise<void> {
    const index = this.answerComments.findIndex(
      (comment) => comment.id.toString() === id,
    )

    this.answerComments.splice(index, 1)
  }

  async create(comment: AnswerComment): Promise<void> {
    this.answerComments.push(comment)

    DomainEvents.dispatchEventsForAggregate(comment.id)
  }
}

export { InMemoryAnswerCommentsRepository }

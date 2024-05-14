import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { DomainEvent } from '@/core/events/domain-event'

import { AnswerComment } from '../entities/answer-comment'

class AnswerCommentCreatedEvent implements DomainEvent {
  public ocurredAt: Date
  public comment: AnswerComment

  constructor(comment: AnswerComment) {
    this.ocurredAt = new Date()
    this.comment = comment
  }

  getAggregateId(): UniqueEntityId {
    return this.comment.id
  }
}

export { AnswerCommentCreatedEvent }

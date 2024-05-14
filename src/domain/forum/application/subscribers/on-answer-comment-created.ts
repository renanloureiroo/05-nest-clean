import { DomainEvents } from '@/core/events/domain-events'
import { EventHandler } from '@/core/events/event-handler'
import { SendNotificationUseCase } from '@/domain/notification/application/use-cases/send-notification'

import { AnswerCommentCreatedEvent } from '../../enterprise/events/answer-comment-created-event'
import { AnswersRepository } from '../repositories/answers-repository'

class OnAnswerCommentCreated implements EventHandler {
  constructor(
    private readonly answersRepository: AnswersRepository,
    private readonly sendNotificationUseCase: SendNotificationUseCase,
  ) {
    this.setupSubscriptions()
  }

  setupSubscriptions(): void {
    DomainEvents.register(
      this.sendNewCommentCreatedInAnswer.bind(this),
      AnswerCommentCreatedEvent.name,
    )
  }

  private async sendNewCommentCreatedInAnswer({
    comment,
  }: AnswerCommentCreatedEvent) {
    const answer = await this.answersRepository.findById(
      comment.answerId.toString(),
    )

    if (answer) {
      console.log('OnAnswerCommentCreated', {
        recipientId: answer.authorId.toString(),
        title: `Novo comentário em "${answer.content.substring(0, 20).concat('...')}"!`,
        content: `Conteúdo: "${comment.content.substring(0, 40).concat('...')}".`,
      })
      this.sendNotificationUseCase.execute({
        recipientId: answer.authorId.toString(),
        title: `Novo comentário em "${answer.content.substring(0, 20).concat('...')}"!`,
        content: `Conteúdo: "${comment.content.substring(0, 40).concat('...')}".`,
      })
    }
  }
}
export { OnAnswerCommentCreated }

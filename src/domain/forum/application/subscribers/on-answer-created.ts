import { DomainEvents } from '@/core/events/domain-events'
import { EventHandler } from '@/core/events/event-handler'
import { SendNotificationUseCase } from '@/domain/notification/application/use-cases/send-notification'

import { AnswerCreatedEvent } from '../../enterprise/events/answer-created-event'
import { QuestionsRepository } from '../repositories/questions-repository'

export class OnAnswerCreated implements EventHandler {
  constructor(
    private readonly questionsRepository: QuestionsRepository,
    private readonly sendNotificationUseCase: SendNotificationUseCase,
  ) {
    this.setupSubscriptions()
  }

  setupSubscriptions(): void {
    DomainEvents.register(
      this.sendNewAnswerNotification.bind(this),
      AnswerCreatedEvent.name,
    )
  }

  private async sendNewAnswerNotification({ answer }: AnswerCreatedEvent) {
    const question = await this.questionsRepository.findById(
      answer.questionId.toString(),
    )

    if (question) {
      this.sendNotificationUseCase.execute({
        recipientId: question.authorId.toString(),
        title: `Nova resposta em ${question.title.substring(0, 40).concat('...')}`,
        content: answer.excerpt,
      })
    }
  }
}

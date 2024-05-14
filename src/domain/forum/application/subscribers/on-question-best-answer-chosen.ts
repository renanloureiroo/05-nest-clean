import { DomainEvents } from '@/core/events/domain-events'
import { EventHandler } from '@/core/events/event-handler'
import { SendNotificationUseCase } from '@/domain/notification/application/use-cases/send-notification'

import { QuestionBestAnswerChosenEvent } from '../../enterprise/events/question-best-answer-chosen-event'
import { AnswersRepository } from '../repositories/answers-repository'

export class OnQuestionBestAnswerChosen implements EventHandler {
  constructor(
    private readonly answersRepository: AnswersRepository,
    private readonly sendNotificationUseCase: SendNotificationUseCase,
  ) {
    this.setupSubscriptions()
  }

  setupSubscriptions(): void {
    DomainEvents.register(
      this.sendBestAnswerChosen.bind(this),
      QuestionBestAnswerChosenEvent.name,
    )
  }

  private async sendBestAnswerChosen({
    question,
    bestAnswerId,
  }: QuestionBestAnswerChosenEvent) {
    const answer = await this.answersRepository.findById(
      bestAnswerId.toString(),
    )

    if (answer) {
      this.sendNotificationUseCase.execute({
        recipientId: answer.authorId.toString(),
        title: 'Sua resposta foi escolhida!',
        content: `A resposta que você enviou em "${question.title.substring(0, 20).concat('...')}" foi escolhida pelo autor!`,
      })
    }
  }
}

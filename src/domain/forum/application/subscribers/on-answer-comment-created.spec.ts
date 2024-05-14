import { makeAnswer } from 'test/factories/make-answer'
import { makeAnswerComment } from 'test/factories/make-answer-comment'
import { makeQuestion } from 'test/factories/make-question'
import { InMemoryAnswerAttachmentsRepository } from 'test/repositories/in-memory-answer-attachments-repository'
import { InMemoryAnswerCommentsRepository } from 'test/repositories/in-memory-answer-comments-repository'
import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository'
import { InMemoryNotificationsRepository } from 'test/repositories/in-memory-notifications-repository'
import { InMemoryQuestionAttachmentsRepository } from 'test/repositories/in-memory-question-attachments-repository'
import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'
import { waitFor } from 'test/utils/wait-for'
import { SpyInstance } from 'vitest'

import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { NotificationsRepository } from '@/domain/notification/application/repositories/notifications-repository'
import {
  SendNotificationUseCase,
  SendNotificationUseCaseDTO,
  SendNotificationUseCaseResponse,
} from '@/domain/notification/application/use-cases/send-notification'

import { AnswerAttachmentsRepository } from '../repositories/answer-attachments-repository'
import { AnswerCommentsRepository } from '../repositories/answer-comments-repository'
import { AnswersRepository } from '../repositories/answers-repository'
import { QuestionAttachmentsRepository } from '../repositories/question-attachments-repository'
import { QuestionsRepository } from '../repositories/questions-repository'
import { OnAnswerCommentCreated } from './on-answer-comment-created'

let notificationsRepository: NotificationsRepository
let questionAttachmentsRepository: QuestionAttachmentsRepository
let questionsRepository: QuestionsRepository
let answerAttachmentsRepository: AnswerAttachmentsRepository
let answersRepository: AnswersRepository
let answerCommentsRepository: AnswerCommentsRepository

let sendNotificationUseCase: SendNotificationUseCase

let sendNotificationExecuteSpy: SpyInstance<
  [SendNotificationUseCaseDTO],
  Promise<SendNotificationUseCaseResponse>
>

describe('On Answer Comment Created', () => {
  beforeEach(() => {
    questionAttachmentsRepository = new InMemoryQuestionAttachmentsRepository()
    questionsRepository = new InMemoryQuestionsRepository(
      questionAttachmentsRepository,
    )
    answerAttachmentsRepository = new InMemoryAnswerAttachmentsRepository()
    answersRepository = new InMemoryAnswersRepository(
      answerAttachmentsRepository,
    )

    answerCommentsRepository = new InMemoryAnswerCommentsRepository()

    notificationsRepository = new InMemoryNotificationsRepository()

    sendNotificationUseCase = new SendNotificationUseCase(
      notificationsRepository,
    )

    sendNotificationExecuteSpy = vi.spyOn(sendNotificationUseCase, 'execute')

    new OnAnswerCommentCreated(answersRepository, sendNotificationUseCase) // eslint-disable-line
  })
  it('should send a notification when new answer comment created', async () => {
    const question = makeQuestion()
    const answer = makeAnswer({
      questionId: question.id,
    })

    await questionsRepository.create(question)
    await answersRepository.create(answer)

    await answerCommentsRepository.create(
      makeAnswerComment({
        answerId: answer.id,
        authorId: new UniqueEntityId('other-author-id'),
      }),
    )

    await waitFor(() => expect(sendNotificationExecuteSpy).toHaveBeenCalled())
  })
})

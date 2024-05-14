import { makeAnswer } from 'test/factories/make-answer'
import { makeQuestion } from 'test/factories/make-question'
import { InMemoryAnswerAttachmentsRepository } from 'test/repositories/in-memory-answer-attachments-repository'
import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository'
import { InMemoryQuestionAttachmentsRepository } from 'test/repositories/in-memory-question-attachments-repository'
import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'

import { NotAllowedError } from '@/core/errors/not-allowed-error'

import { AnswerAttachmentsRepository } from '../repositories/answer-attachments-repository'
import { AnswersRepository } from '../repositories/answers-repository'
import { QuestionAttachmentsRepository } from '../repositories/question-attachments-repository'
import { QuestionsRepository } from '../repositories/questions-repository'
import { ChooseQuestionBesAnswerUseCase } from './choose-question-best-answer'

let answerAttachmentsRepository: AnswerAttachmentsRepository
let questionAttachmentsRepository: QuestionAttachmentsRepository
let questionRepository: QuestionsRepository
let answerRepository: AnswersRepository
let sut: ChooseQuestionBesAnswerUseCase

describe('Choose Question Best Answer', () => {
  beforeEach(() => {
    answerAttachmentsRepository = new InMemoryAnswerAttachmentsRepository()
    questionAttachmentsRepository = new InMemoryQuestionAttachmentsRepository()
    questionRepository = new InMemoryQuestionsRepository(
      questionAttachmentsRepository,
    )
    answerRepository = new InMemoryAnswersRepository(
      answerAttachmentsRepository,
    )

    sut = new ChooseQuestionBesAnswerUseCase(
      questionRepository,
      answerRepository,
    )
  })

  it('should be able to choose the best answer for a question', async () => {
    const question = makeQuestion()
    questionRepository.create(question)
    const answer = makeAnswer({
      questionId: question.id,
    })

    answerRepository.create(answer)

    const response = await sut.execute({
      answerId: answer.id.toString(),
      authorId: question.authorId.toString(),
    })

    expect(response.isRight()).toBeTruthy()
  })

  it("should not be able to choose the another user question's best answer", async () => {
    const question = makeQuestion()
    questionRepository.create(question)
    const answer = makeAnswer({
      questionId: question.id,
    })

    answerRepository.create(answer)

    const response = await sut.execute({
      answerId: answer.id.toString(),
      authorId: 'another-user-id',
    })

    expect(response.isLeft()).toBeTruthy()
    expect(response.value).toBeInstanceOf(NotAllowedError)
  })
})

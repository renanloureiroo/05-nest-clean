import { makeAnswer } from 'test/factories/make-answer'
import { InMemoryAnswerAttachmentsRepository } from 'test/repositories/in-memory-answer-attachments-repository'
import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository'

import { UniqueEntityId } from '@/core/entities/unique-entity-id'

import { AnswerAttachmentsRepository } from '../repositories/answer-attachments-repository'
import { AnswersRepository } from '../repositories/answers-repository'
import { ListQuestionAnswersUseCase } from './list-question-answers'

let answerAttachmentsRepository: AnswerAttachmentsRepository
let answersRepository: AnswersRepository
let sut: ListQuestionAnswersUseCase

describe('List Questions Answers', async () => {
  beforeEach(() => {
    answerAttachmentsRepository = new InMemoryAnswerAttachmentsRepository()
    answersRepository = new InMemoryAnswersRepository(
      answerAttachmentsRepository,
    )
    sut = new ListQuestionAnswersUseCase(answersRepository)
  })

  it('should list question answers', async () => {
    await answersRepository.create(
      makeAnswer({
        questionId: new UniqueEntityId('list-question-answers-id'),
      }),
    )

    const response = await sut.execute({
      questionId: 'list-question-answers-id',
    })

    expect(response.isRight()).toBeTruthy()
    expect(response.isRight() && response.value.answers).toHaveLength(1)
    expect(
      response.isRight() && response.value.answers[0].questionId.toString(),
    ).toBe('list-question-answers-id')
  })

  it('should list question answers with pagination', async () => {
    for (let i = 0; i < 26; i++) {
      await answersRepository.create(
        makeAnswer({
          questionId: new UniqueEntityId('list-question-answers-id'),
        }),
      )
    }

    const response = await sut.execute({
      questionId: 'list-question-answers-id',
      page: 2,
    })

    expect(response.isRight()).toBeTruthy()
    expect(response.isRight() && response.value.answers).toHaveLength(6)
  })
})

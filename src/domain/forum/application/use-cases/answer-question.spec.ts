import { InMemoryAnswerAttachmentsRepository } from 'test/repositories/in-memory-answer-attachments-repository'
import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository'

import { UniqueEntityId } from '@/core/entities/unique-entity-id'

import { AnswerAttachmentsRepository } from '../repositories/answer-attachments-repository'
import { AnswersRepository } from '../repositories/answers-repository'
import { AnswerQuestionUseCase } from './answer-question'

let answerAttachmentsRepository: AnswerAttachmentsRepository
let answerRepository: AnswersRepository
let sut: AnswerQuestionUseCase

describe('UseCases =>  Create Answer', () => {
  beforeEach(() => {
    answerAttachmentsRepository = new InMemoryAnswerAttachmentsRepository()
    answerRepository = new InMemoryAnswersRepository(
      answerAttachmentsRepository,
    )
    sut = new AnswerQuestionUseCase(answerRepository)
  })

  it('should be able create a question', async () => {
    const response = await sut.execute({
      instructorId: 'any_instructor_id',
      content: 'Conteúdo da resposta',
      questionId: 'any_question_id',
      attachmentsIds: ['any_attachment_id-1', 'any_attachment_id-2'],
    })

    expect(response.isRight()).toBe(true)
    expect(response.isRight() && response.value.answer).toHaveProperty('id')

    expect(response.isRight() && response.value.answer.id).toBeTruthy()
    expect(
      response.isRight() && response.value?.answer.attachments.currentItems,
    ).toHaveLength(2)
    expect(
      response.isRight() && response.value?.answer.attachments.currentItems,
    ).toEqual([
      expect.objectContaining({
        attachmentId: new UniqueEntityId('any_attachment_id-1'),
      }),
      expect.objectContaining({
        attachmentId: new UniqueEntityId('any_attachment_id-2'),
      }),
    ])
  })
})

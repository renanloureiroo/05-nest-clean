import { makeAnswer } from 'test/factories/make-answer'
import { makeAnswerAttachment } from 'test/factories/make-answer-attachment'
import { InMemoryAnswerAttachmentsRepository } from 'test/repositories/in-memory-answer-attachments-repository'
import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository'

import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { NotAllowedError } from '@/core/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found'

import { AnswerAttachmentsRepository } from '../repositories/answer-attachments-repository'
import { AnswersRepository } from '../repositories/answers-repository'
import { DeleteAnswerUseCase } from './delete-answer'

let answerAttachmentsRepository: AnswerAttachmentsRepository
let answerRepository: AnswersRepository
let sut: DeleteAnswerUseCase

describe('UseCases => Delete Answer', () => {
  beforeEach(() => {
    answerAttachmentsRepository = new InMemoryAnswerAttachmentsRepository()
    answerRepository = new InMemoryAnswersRepository(
      answerAttachmentsRepository,
    )
    sut = new DeleteAnswerUseCase(answerRepository)
  })

  it('should be able delete a answer', async () => {
    const newAnswer = makeAnswer({}, new UniqueEntityId('answer-1'))

    await answerRepository.create(newAnswer)

    await answerAttachmentsRepository.create(
      makeAnswerAttachment({
        answerId: newAnswer.id,
      }),
    )
    await answerAttachmentsRepository.create(
      makeAnswerAttachment({
        answerId: newAnswer.id,
      }),
    )

    await sut.execute({
      authorId: newAnswer.authorId.toString(),
      answerId: 'answer-1',
    })

    const answer = await answerRepository.findById('answer-1')
    const attachments = await answerAttachmentsRepository.findManyByAnswerId(
      newAnswer.id.toString(),
    )
    expect(answer).toBeNull()
    expect(attachments).toHaveLength(0)
  })

  it("should not be able delete a answer that doesn't exist", async () => {
    const response = await sut.execute({
      authorId: 'any_author_id',
      answerId: 'answer-1',
    })

    expect(response.isLeft()).toBeTruthy()
    expect(response.isLeft() && response.value).toBeInstanceOf(
      ResourceNotFoundError,
    )
  })

  it("should not be able delete a answer that you don't own", async () => {
    const newAnswer = makeAnswer(
      {
        authorId: new UniqueEntityId('author-id-1'),
      },
      new UniqueEntityId('answer-1'),
    )

    await answerRepository.create(newAnswer)

    const response = await sut.execute({
      authorId: 'any_author_id',
      answerId: 'answer-1',
    })

    expect(response.isLeft()).toBeTruthy()
    expect(response.isLeft() && response.value).toBeInstanceOf(NotAllowedError)
  })
})

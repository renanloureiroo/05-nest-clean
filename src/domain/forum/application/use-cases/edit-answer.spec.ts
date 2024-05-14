import { makeAnswer } from 'test/factories/make-answer'
import { InMemoryAnswerAttachmentsRepository } from 'test/repositories/in-memory-answer-attachments-repository'
import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository'

import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { NotAllowedError } from '@/core/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found'

import { AnswerAttachmentsRepository } from '../repositories/answer-attachments-repository'
import { AnswersRepository } from '../repositories/answers-repository'
import { EditAnswerUseCase } from './edit-answer'

let answerAttachmentsRepository: AnswerAttachmentsRepository
let answerRepository: AnswersRepository
let sut: EditAnswerUseCase

describe('UseCases => Edit Answer', () => {
  beforeEach(() => {
    answerAttachmentsRepository = new InMemoryAnswerAttachmentsRepository()
    answerRepository = new InMemoryAnswersRepository(
      answerAttachmentsRepository,
    )
    sut = new EditAnswerUseCase(answerRepository, answerAttachmentsRepository)
  })

  it('should be able edit a answer', async () => {
    const newAnswer = makeAnswer({}, new UniqueEntityId('answer-1'))

    await answerRepository.create(newAnswer)

    await sut.execute({
      authorId: newAnswer.authorId.toString(),
      answerId: newAnswer.id.toString(),
      content: 'new content test',
      attachmentsIds: [],
    })

    const question = await answerRepository.findById(newAnswer.id.toString())

    expect(question?.content).toEqual('new content test')
  })

  it("should not be able edit a answer that doesn't exist", async () => {
    const response = await sut.execute({
      authorId: 'any_author_id',
      answerId: 'answer-1',
      content: 'new content',
      attachmentsIds: [],
    })

    expect(response.isLeft()).toBeTruthy()
    expect(response.isLeft() && response.value).toBeInstanceOf(
      ResourceNotFoundError,
    )
  })

  it("should not be able edit a answer that you don't own", async () => {
    const newAnswer = makeAnswer(
      {
        authorId: new UniqueEntityId('author-id-1'),
      },
      new UniqueEntityId('question-1'),
    )

    await answerRepository.create(newAnswer)

    const response = await sut.execute({
      authorId: 'any_author_id',
      answerId: newAnswer.id.toString(),
      content: 'new content',
      attachmentsIds: [],
    })

    expect(response.isLeft()).toBeTruthy()

    expect(response.isLeft() && response.value).toBeInstanceOf(NotAllowedError)
  })
})

import { makeQuestion } from 'test/factories/make-question'
import { makeQuestionAttachment } from 'test/factories/make-question-attachment'
import { InMemoryQuestionAttachmentsRepository } from 'test/repositories/in-memory-question-attachments-repository'
import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'

import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { NotAllowedError } from '@/core/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found'

import { QuestionsRepository } from '../repositories/questions-repository'
import { EditQuestionUseCase } from './edit-question'

let questionRepository: QuestionsRepository
let questionAttachmentsRepository: InMemoryQuestionAttachmentsRepository
let sut: EditQuestionUseCase

describe('UseCases => Edit Question', () => {
  beforeEach(() => {
    questionAttachmentsRepository = new InMemoryQuestionAttachmentsRepository()
    questionRepository = new InMemoryQuestionsRepository(
      questionAttachmentsRepository,
    )
    sut = new EditQuestionUseCase(
      questionRepository,
      questionAttachmentsRepository,
    )
  })

  it('should be able to edit a question', async () => {
    const newQuestion = makeQuestion({}, new UniqueEntityId('question-1'))

    await questionRepository.create(newQuestion)

    await questionAttachmentsRepository.create(
      makeQuestionAttachment({
        questionId: newQuestion.id,
        attachmentId: new UniqueEntityId('1'),
      }),
    )
    await questionAttachmentsRepository.create(
      makeQuestionAttachment({
        questionId: newQuestion.id,
        attachmentId: new UniqueEntityId('2'),
      }),
    )

    await sut.execute({
      authorId: newQuestion.authorId.toString(),
      questionId: newQuestion.id.toString(),
      content: 'new content test',
      title: 'new title test',
      attachmentsIds: ['1', '3'],
    })

    const question = await questionRepository.findById(
      newQuestion.id.toString(),
    )
    expect(question?.title).toEqual('new title test')
    expect(question?.content).toEqual('new content test')
    expect(question?.attachments.compareItems).toHaveLength(2)

    expect(question?.attachments.currentItems).toEqual([
      expect.objectContaining({
        attachmentId: new UniqueEntityId('1'),
      }),
      expect.objectContaining({
        attachmentId: new UniqueEntityId('3'),
      }),
    ])
  })

  it("should not be able edit a question that doesn't exist", async () => {
    const response = await sut.execute({
      authorId: 'any_author_id',
      questionId: 'question-1',
      content: 'new content',
      title: 'new title',
      attachmentsIds: [],
    })

    expect(response.isLeft()).toBeTruthy()
    expect(response.isLeft() && response.value).toBeInstanceOf(
      ResourceNotFoundError,
    )
  })

  it("should not be able edit a question that you don't own", async () => {
    const newQuestion = makeQuestion(
      {
        authorId: new UniqueEntityId('author-id-1'),
      },
      new UniqueEntityId('question-1'),
    )

    await questionRepository.create(newQuestion)

    const response = await sut.execute({
      authorId: 'any_author_id',
      questionId: newQuestion.id.toString(),
      content: 'new content',
      title: 'new title',
      attachmentsIds: [],
    })

    expect(response.isLeft()).toBeTruthy()
    expect(response.isLeft() && response.value).toBeInstanceOf(NotAllowedError)
  })
})

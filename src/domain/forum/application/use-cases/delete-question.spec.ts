import { makeQuestion } from 'test/factories/make-question'
import { makeQuestionAttachment } from 'test/factories/make-question-attachment'
import { InMemoryQuestionAttachmentsRepository } from 'test/repositories/in-memory-question-attachments-repository'
import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'

import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { NotAllowedError } from '@/core/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found'

import { QuestionAttachmentsRepository } from '../repositories/question-attachments-repository'
import { QuestionsRepository } from '../repositories/questions-repository'
import { DeleteQuestionUseCase } from './delete-question'

let questionAttachmentsRepository: QuestionAttachmentsRepository
let questionRepository: QuestionsRepository
let sut: DeleteQuestionUseCase

describe('UseCases => Delete Question', () => {
  beforeEach(() => {
    questionAttachmentsRepository = new InMemoryQuestionAttachmentsRepository()
    questionRepository = new InMemoryQuestionsRepository(
      questionAttachmentsRepository,
    )
    sut = new DeleteQuestionUseCase(questionRepository)
  })

  it('should be able delete a question', async () => {
    const newQuestion = makeQuestion({}, new UniqueEntityId('question-1'))

    await questionRepository.create(newQuestion)
    await questionAttachmentsRepository.create(
      makeQuestionAttachment({
        questionId: newQuestion.id,
      }),
    )
    await questionAttachmentsRepository.create(
      makeQuestionAttachment({
        questionId: newQuestion.id,
      }),
    )
    await questionAttachmentsRepository.create(
      makeQuestionAttachment({
        questionId: new UniqueEntityId('question-2'),
      }),
    )

    await sut.execute({
      authorId: newQuestion.authorId.toString(),
      questionId: 'question-1',
    })

    const question = await questionRepository.findById('question-1')
    const attachments =
      await questionAttachmentsRepository.findManyByQuestionId('question-1')

    expect(question).toBeNull()
    expect(attachments).toHaveLength(0)
  })

  it("should not be able delete a question that doesn't exist", async () => {
    const response = await sut.execute({
      authorId: 'any_author_id',
      questionId: 'question-1',
    })
    expect(response.isLeft()).toBeTruthy()
    expect(response.isLeft() && response.value).toBeInstanceOf(
      ResourceNotFoundError,
    )
  })

  it("should not be able delete a question that you don't own", async () => {
    const newQuestion = makeQuestion(
      {
        authorId: new UniqueEntityId('author-id-1'),
      },
      new UniqueEntityId('question-1'),
    )

    await questionRepository.create(newQuestion)

    const response = await sut.execute({
      authorId: 'any_author_id',
      questionId: 'question-1',
    })

    expect(response.isLeft()).toBeTruthy()
    expect(response.isLeft() && response.value).toBeInstanceOf(NotAllowedError)
  })
})

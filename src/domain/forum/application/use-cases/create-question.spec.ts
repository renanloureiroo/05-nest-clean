import { InMemoryQuestionAttachmentsRepository } from 'test/repositories/in-memory-question-attachments-repository'
import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'

import { UniqueEntityId } from '@/core/entities/unique-entity-id'

import { QuestionAttachmentsRepository } from '../repositories/question-attachments-repository'
import { QuestionsRepository } from '../repositories/questions-repository'
import { CreateQuestionUseCase } from './create-question'

let questionAttachmentsRepository: QuestionAttachmentsRepository
let questionRepository: QuestionsRepository
let sut: CreateQuestionUseCase

describe('UseCases =>  Create Question', () => {
  beforeEach(() => {
    questionAttachmentsRepository = new InMemoryQuestionAttachmentsRepository()
    questionRepository = new InMemoryQuestionsRepository(
      questionAttachmentsRepository,
    )
    sut = new CreateQuestionUseCase(questionRepository)
  })

  it('should be able create a question', async () => {
    const question = await sut.execute({
      authorId: 'any_author_id',
      content: 'Conteúdo da pergunta',
      title: 'Titulo da pergunta',
      attachmentsIds: ['any_attachment_id-1', 'any_attachment_id-2'],
    })

    expect(question.isRight()).toBeTruthy()
    expect(question.isRight() && question.value.question.id).toBeTruthy()
    expect(
      question.isRight() && question.value?.question.attachments.currentItems,
    ).toHaveLength(2)
    expect(
      question.isRight() && question.value?.question.attachments.currentItems,
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

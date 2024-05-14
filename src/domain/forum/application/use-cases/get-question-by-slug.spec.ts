import { makeQuestion } from 'test/factories/make-question'
import { InMemoryQuestionAttachmentsRepository } from 'test/repositories/in-memory-question-attachments-repository'
import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'

import { ResourceNotFoundError } from '@/core/errors/resource-not-found'

import { QuestionAttachmentsRepository } from '../repositories/question-attachments-repository'
import { QuestionsRepository } from '../repositories/questions-repository'
import { GetQuestionBySlugUseCase } from './get-question-by-slug'

let questionAttachmentsRepository: QuestionAttachmentsRepository
let questionRepository: QuestionsRepository
let sut: GetQuestionBySlugUseCase

describe('UseCases =>  Get Question By Slug', () => {
  beforeEach(() => {
    questionAttachmentsRepository = new InMemoryQuestionAttachmentsRepository()
    questionRepository = new InMemoryQuestionsRepository(
      questionAttachmentsRepository,
    )
    sut = new GetQuestionBySlugUseCase(questionRepository)
  })

  it('should be able to get a question by slug', async () => {
    const question = makeQuestion()

    await questionRepository.create(question)

    const response = await sut.execute({
      slug: question.slug.value,
    })

    expect(response.isRight()).toBeTruthy()

    expect(response.isRight() && response.value.question).toEqual(question)
  })

  it("should not be return a question if it doesn't exists", async () => {
    const response = await sut.execute({
      slug: 'titulo-da-pergunta',
    })

    expect(response.isLeft()).toBeTruthy()
    expect(response.isLeft() && response.value).toBeInstanceOf(
      ResourceNotFoundError,
    )
  })
})

import { makeQuestionComment } from 'test/factories/make-question-comment'
import { InMemoryQuestionCommentsRepository } from 'test/repositories/in-memory-question-comments-repository'

import { UniqueEntityId } from '@/core/entities/unique-entity-id'

import { QuestionCommentsRepository } from '../repositories/question-comments-repository'
import { ListQuestionCommentsUseCase } from './list-question-comments'

let questionCommentsRepository: QuestionCommentsRepository
let sut: ListQuestionCommentsUseCase

describe('List Question Comments', () => {
  beforeEach(() => {
    questionCommentsRepository = new InMemoryQuestionCommentsRepository()
    sut = new ListQuestionCommentsUseCase(questionCommentsRepository)
  })

  it("should be able to list question's comments", async () => {
    const questionId = 'question-id-test'

    for (let i = 0; i < 3; i++) {
      const questionComment = makeQuestionComment({
        questionId: new UniqueEntityId('question-id-test'),
      })

      await questionCommentsRepository.create(questionComment)
    }

    const response = await sut.execute({ questionId })

    expect(response.isRight()).toBeTruthy()
    expect(response.isRight() && response.value.questionComments).toHaveLength(
      3,
    )
  })

  it('should return an empty array if there are no comments', async () => {
    const questionId = 'question-id-test'

    const response = await sut.execute({ questionId })

    expect(response.isRight()).toBeTruthy()
    expect(response.isRight() && response.value.questionComments).toHaveLength(
      0,
    )
  })

  it('should be able to paginate the comments', async () => {
    const questionId = 'question-id-test'

    for (let i = 0; i < 30; i++) {
      const questionComment = makeQuestionComment({
        questionId: new UniqueEntityId('question-id-test'),
      })

      await questionCommentsRepository.create(questionComment)
    }

    const response1 = await sut.execute({
      questionId,
      page: 1,
    })

    const response2 = await sut.execute({
      questionId,
      page: 2,
    })

    expect(
      response1.isRight() && response1.value.questionComments,
    ).toHaveLength(20)
    expect(
      response2.isRight() && response2.value.questionComments,
    ).toHaveLength(10)
  })
})

import { makeAnswerComment } from 'test/factories/make-answer-comment'
import { InMemoryAnswerCommentsRepository } from 'test/repositories/in-memory-answer-comments-repository'

import { UniqueEntityId } from '@/core/entities/unique-entity-id'

import { AnswerCommentsRepository } from '../repositories/answer-comments-repository'
import { ListAnswerCommentsUseCase } from './list-answer-comments'

let answerCommentsRepository: AnswerCommentsRepository
let sut: ListAnswerCommentsUseCase

describe('List Answer Comments', () => {
  beforeEach(() => {
    answerCommentsRepository = new InMemoryAnswerCommentsRepository()
    sut = new ListAnswerCommentsUseCase(answerCommentsRepository)
  })

  it("should be able to list answer's comments", async () => {
    const answerId = 'answer-id-test'

    for (let i = 0; i < 3; i++) {
      const answerComment = makeAnswerComment({
        answerId: new UniqueEntityId('answer-id-test'),
      })

      await answerCommentsRepository.create(answerComment)
    }

    const response = await sut.execute({ answerId })

    expect(response.isRight()).toBeTruthy()
    expect(response.isRight() && response.value.answerComments).toHaveLength(3)
  })

  it('should return an empty array if there are no comments', async () => {
    const answerId = 'answer-id-test'

    const response = await sut.execute({ answerId })

    expect(response.isRight()).toBeTruthy()
    expect(response.isRight() && response.value.answerComments).toHaveLength(0)
  })

  it('should be able to paginate the comments', async () => {
    const answerId = 'answer-id-test'

    for (let i = 0; i < 30; i++) {
      const answerComment = makeAnswerComment({
        answerId: new UniqueEntityId('answer-id-test'),
      })

      await answerCommentsRepository.create(answerComment)
    }

    const response1 = await sut.execute({
      answerId,
      page: 1,
    })

    const response2 = await sut.execute({
      answerId,
      page: 2,
    })

    expect(response1.isRight() && response1.value.answerComments).toHaveLength(
      20,
    )
    expect(response2.isRight() && response2.value.answerComments).toHaveLength(
      10,
    )
  })
})

import { makeAnswer } from 'test/factories/make-answer'
import { InMemoryAnswerAttachmentsRepository } from 'test/repositories/in-memory-answer-attachments-repository'
import { InMemoryAnswerCommentsRepository } from 'test/repositories/in-memory-answer-comments-repository'
import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository'

import { ResourceNotFoundError } from '@/core/errors/resource-not-found'

import { AnswerAttachmentsRepository } from '../repositories/answer-attachments-repository'
import { AnswerCommentsRepository } from '../repositories/answer-comments-repository'
import { AnswersRepository } from '../repositories/answers-repository'
import { CommentOnAnswerUseCase } from './comment-on-answer'

let answerAttachmentsRepository: AnswerAttachmentsRepository
let answerRepository: AnswersRepository
let answerCommentsRepository: AnswerCommentsRepository
let sut: CommentOnAnswerUseCase

describe('Comment On Answer', () => {
  beforeEach(() => {
    answerAttachmentsRepository = new InMemoryAnswerAttachmentsRepository()
    answerRepository = new InMemoryAnswersRepository(
      answerAttachmentsRepository,
    )
    answerCommentsRepository = new InMemoryAnswerCommentsRepository()

    sut = new CommentOnAnswerUseCase(answerRepository, answerCommentsRepository)
  })

  it('should be able to create a new comment on answer', async () => {
    const answer = makeAnswer()
    answerRepository.create(answer)

    const response = await sut.execute({
      authorId: 'fake-author-id',
      answerId: answer.id.toString(),
      content: 'fake-content',
    })

    expect(response.isRight()).toBeTruthy()
    expect(
      response.isRight() && response.value?.answerComment.id.toString(),
    ).toBeDefined()
  })

  it('should not be able to create comment on a non-existing answer', async () => {
    const response = await sut.execute({
      authorId: 'fake-author-id',
      answerId: 'fake-answer-id',
      content: 'fake-content',
    })

    expect(response.isLeft()).toBeTruthy()

    expect(response.isLeft() && response.value).toBeInstanceOf(
      ResourceNotFoundError,
    )
  })
})

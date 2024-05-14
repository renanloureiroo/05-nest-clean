import { makeAnswerComment } from 'test/factories/make-answer-comment'
import { InMemoryAnswerCommentsRepository } from 'test/repositories/in-memory-answer-comments-repository'

import { ResourceNotFoundError } from '@/core/errors/resource-not-found'

import { AnswerCommentsRepository } from '../repositories/answer-comments-repository'
import { DeleteAnswerCommentUseCase } from './delete-answer-comment'

let answerCommentsRepository: AnswerCommentsRepository
let sut: DeleteAnswerCommentUseCase

describe('Delete Answer Comment', () => {
  beforeEach(() => {
    answerCommentsRepository = new InMemoryAnswerCommentsRepository()

    sut = new DeleteAnswerCommentUseCase(answerCommentsRepository)
  })

  it('should be able to delete a comment', async () => {
    const answerComment = makeAnswerComment()

    await answerCommentsRepository.create(answerComment)

    await sut.execute({
      authorId: answerComment.authorId.toString(),
      answerCommentId: answerComment.id.toString(),
    })

    const comment = await answerCommentsRepository.findById(
      answerComment.id.toString(),
    )
    expect(comment).toBeNull()
  })

  it('should not be able to delete a non-existing comment', async () => {
    const newAnswerComment = await sut.execute({
      authorId: 'fake-author-id',
      answerCommentId: 'fake-comment-id',
    })

    expect(newAnswerComment.isLeft()).toBeTruthy()
    expect(newAnswerComment.value).toBeInstanceOf(ResourceNotFoundError)
  })
})

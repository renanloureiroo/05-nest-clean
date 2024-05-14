import { makeQuestionComment } from 'test/factories/make-question-comment'
import { InMemoryQuestionCommentsRepository } from 'test/repositories/in-memory-question-comments-repository'

import { ResourceNotFoundError } from '@/core/errors/resource-not-found'

import { QuestionCommentsRepository } from '../repositories/question-comments-repository'
import { DeleteQuestionCommentUseCase } from './delete-question-comment'

let questionCommentsRepository: QuestionCommentsRepository
let sut: DeleteQuestionCommentUseCase

describe('Delete Question Comment', () => {
  beforeEach(() => {
    questionCommentsRepository = new InMemoryQuestionCommentsRepository()

    sut = new DeleteQuestionCommentUseCase(questionCommentsRepository)
  })

  it('should be able to delete a comment', async () => {
    const questionComment = makeQuestionComment()

    await questionCommentsRepository.create(questionComment)

    const response = await sut.execute({
      authorId: questionComment.authorId.toString(),
      questionCommentId: questionComment.id.toString(),
    })

    expect(response.isRight()).toBeTruthy()
  })

  it('should not be able to delete a non-existing comment', async () => {
    const response = await sut.execute({
      authorId: 'fake-author-id',
      questionCommentId: 'fake-comment-id',
    })

    expect(response.isLeft()).toBeTruthy()
    expect(response.isLeft() && response.value).toBeInstanceOf(
      ResourceNotFoundError,
    )
  })
})

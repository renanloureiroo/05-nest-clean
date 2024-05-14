import { Either, left, right } from '@/core/either'
import { NotAllowedError } from '@/core/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found'

import { AnswerCommentsRepository } from '../repositories/answer-comments-repository'

interface DeleteAnswerCommentUseCaseDTO {
  authorId: string
  answerCommentId: string
}

type DeleteAnswerCommentUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  null
>

class DeleteAnswerCommentUseCase {
  constructor(private commentRepository: AnswerCommentsRepository) {}

  async execute({
    answerCommentId,
    authorId,
  }: DeleteAnswerCommentUseCaseDTO): Promise<DeleteAnswerCommentUseCaseResponse> {
    const comment = await this.commentRepository.findById(answerCommentId)

    if (!comment) {
      return left(new ResourceNotFoundError())
    }

    if (comment.authorId.toString() !== authorId) {
      return left(new NotAllowedError())
    }

    await this.commentRepository.delete(answerCommentId)

    return right(null)
  }
}

export { DeleteAnswerCommentUseCase }

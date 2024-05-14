import { Either, left, right } from '@/core/either'
import { NotAllowedError } from '@/core/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found'

import { QuestionCommentsRepository } from '../repositories/question-comments-repository'

interface DeleteQuestionCommentUseCaseDTO {
  authorId: string
  questionCommentId: string
}

type DeleteQuestionCommentUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  null
>

class DeleteQuestionCommentUseCase {
  constructor(private commentRepository: QuestionCommentsRepository) {}

  async execute({
    questionCommentId,
    authorId,
  }: DeleteQuestionCommentUseCaseDTO): Promise<DeleteQuestionCommentUseCaseResponse> {
    const comment = await this.commentRepository.findById(questionCommentId)

    if (!comment) {
      return left(new ResourceNotFoundError())
    }

    if (comment.authorId.toString() !== authorId) {
      return left(new NotAllowedError())
    }

    await this.commentRepository.delete(questionCommentId)

    return right(null)
  }
}

export { DeleteQuestionCommentUseCase }

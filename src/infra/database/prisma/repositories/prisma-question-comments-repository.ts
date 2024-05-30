import { PaginationParams } from '@/core/repositories/pagination-params'
import { QuestionCommentsRepository } from '@/domain/forum/application/repositories/question-comments-repository'
import { QuestionComment } from '@/domain/forum/enterprise/entities/question-comment'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { PrismaQuestionCommentMapper } from '../mappers/prisma-question-comment-mapper'

@Injectable()
class PrismaQuestionCommentsRepository implements QuestionCommentsRepository {
  constructor(private readonly prismaService: PrismaService) {}
  async create(comment: QuestionComment): Promise<void> {
    const commentPrisma = PrismaQuestionCommentMapper.toPrisma(comment)

    await this.prismaService.comment.create({
      data: commentPrisma,
    })
  }

  async findById(id: string): Promise<QuestionComment | null> {
    const questionComment = await this.prismaService.comment.findUnique({
      where: { id },
    })

    if (!questionComment) return null

    return PrismaQuestionCommentMapper.toDomain(questionComment)
  }

  async findManyByQuestionId(
    questionId: string,
    { page, perPage }: PaginationParams,
  ): Promise<QuestionComment[]> {
    const comments = await this.prismaService.comment.findMany({
      where: { questionId },
      skip: (page! - 1) * perPage!,
      take: perPage,
      orderBy: { createdAt: 'desc' },
    })

    return comments.map(PrismaQuestionCommentMapper.toDomain)
  }

  async delete(id: string): Promise<void> {
    await this.prismaService.comment.delete({
      where: { id },
    })
  }
}

export { PrismaQuestionCommentsRepository }

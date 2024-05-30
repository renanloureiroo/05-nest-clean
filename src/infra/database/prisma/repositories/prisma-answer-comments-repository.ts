import { PaginationParams } from '@/core/repositories/pagination-params'
import { AnswerCommentsRepository } from '@/domain/forum/application/repositories/answer-comments-repository'
import { AnswerComment } from '@/domain/forum/enterprise/entities/answer-comment'
import { Injectable } from '@nestjs/common'
import { PrismaAnswerCommentMapper } from '../mappers/prisma-answer-comment-mapper'
import { PrismaService } from '../prisma.service'

@Injectable()
class PrismaAnswerCommentsRepository implements AnswerCommentsRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async create(comment: AnswerComment): Promise<void> {
    const answerComment = PrismaAnswerCommentMapper.toPrisma(comment)

    await this.prismaService.comment.create({
      data: answerComment,
    })
  }

  async findById(id: string): Promise<AnswerComment | null> {
    const comment = await this.prismaService.comment.findUnique({
      where: { id },
    })

    if (!comment) return null

    return PrismaAnswerCommentMapper.toDomain(comment)
  }

  async findManyByAnswerId(
    answerId: string,
    { page, perPage }: PaginationParams,
  ): Promise<AnswerComment[]> {
    const comments = await this.prismaService.comment.findMany({
      where: { answerId },
      skip: (page! - 1) * perPage!,
      take: perPage,
      orderBy: { createdAt: 'desc' },
    })

    return comments.map(PrismaAnswerCommentMapper.toDomain)
  }

  async delete(id: string): Promise<void> {
    await this.prismaService.comment.delete({
      where: { id },
    })
  }
}

export { PrismaAnswerCommentsRepository }

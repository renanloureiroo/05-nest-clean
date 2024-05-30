import { PaginationParams } from '@/core/repositories/pagination-params'
import { AnswersRepository } from '@/domain/forum/application/repositories/answers-repository'
import { Answer } from '@/domain/forum/enterprise/entities/answer'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { PrismaAnswerMapper } from '../mappers/prisma-answer-mapper'

@Injectable()
class PrismaAnswersRepository implements AnswersRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async create(answer: Answer): Promise<void> {
    const answerPrisma = PrismaAnswerMapper.toPrisma(answer)

    await this.prismaService.answer.create({
      data: answerPrisma,
    })
  }

  async delete(answer: Answer): Promise<void> {
    await this.prismaService.answer.delete({
      where: { id: answer.id.toString() },
    })
  }

  async findById(id: string): Promise<Answer | null> {
    const answer = await this.prismaService.answer.findUnique({
      where: { id },
    })

    if (!answer) return null

    return PrismaAnswerMapper.toDomain(answer)
  }

  async findManyByQuestionId(
    questionId: string,
    { page, perPage }: PaginationParams,
  ): Promise<Answer[]> {
    const answers = await this.prismaService.answer.findMany({
      where: { questionId },
      skip: (page! - 1) * perPage!,
      take: perPage,
      orderBy: { createdAt: 'desc' },
    })

    return answers.map(PrismaAnswerMapper.toDomain)
  }

  async update(answer: Answer): Promise<void> {
    const answerPrisma = PrismaAnswerMapper.toPrisma(answer)

    await this.prismaService.answer.update({
      where: { id: answerPrisma.id },
      data: answerPrisma,
    })
  }
}

export { PrismaAnswersRepository }

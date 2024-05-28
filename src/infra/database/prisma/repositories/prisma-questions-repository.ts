import { PaginationParams } from '@/core/repositories/pagination-params'
import { QuestionsRepository } from '@/domain/forum/application/repositories/questions-repository'
import { Question } from '@/domain/forum/enterprise/entities/question'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { PrismaQuestionMapper } from '../mappers/prisma-question-mapper'

@Injectable()
class PrismaQuestionsRepository implements QuestionsRepository {
  constructor(private readonly prismaService: PrismaService) {}
  async count(): Promise<number> {
    const numberOfQuestions = await this.prismaService.question.count()
    return numberOfQuestions
  }

  async create(question: Question): Promise<void> {
    const data = PrismaQuestionMapper.toPrisma(question)

    await this.prismaService.question.create({
      data,
    })
  }

  async delete(question: Question): Promise<void> {
    const data = PrismaQuestionMapper.toPrisma(question)

    await this.prismaService.question.delete({
      where: { id: data.id },
    })
  }

  async findBySlug(slug: string): Promise<Question | null> {
    const question = await this.prismaService.question.findUnique({
      where: { slug },
    })

    if (!question) return null

    return PrismaQuestionMapper.toDomain(question)
  }

  async findById(questionId: string): Promise<Question | null> {
    const question = await this.prismaService.question.findUnique({
      where: { id: questionId },
    })

    if (!question) return null

    return PrismaQuestionMapper.toDomain(question)
  }

  async findManyRecent({
    page,
    perPage,
  }: PaginationParams): Promise<Question[]> {
    const questions = await this.prismaService.question.findMany({
      take: perPage,
      skip: (page! - 1) * perPage!,
      orderBy: { createdAt: 'desc' },
    })
    return questions.map(PrismaQuestionMapper.toDomain)
  }

  async update(question: Question): Promise<void> {
    const data = PrismaQuestionMapper.toPrisma(question)

    await this.prismaService.question.update({
      where: { id: data.id },
      data,
    })
  }
}

export { PrismaQuestionsRepository }

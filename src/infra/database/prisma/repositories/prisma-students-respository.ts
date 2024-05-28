import { StudentsRepository } from '@/domain/forum/application/repositories/students-repository'
import { Student } from '@/domain/forum/enterprise/entities/student'
import { PrismaService } from '../prisma.service'
import { PrismaStudentsMapper } from '../mappers/prisma-students-mapper'
import { Injectable } from '@nestjs/common'

@Injectable()
class PrismaStudentsRepository implements StudentsRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async findByEmail(email: string): Promise<Student | null> {
    const student = await this.prismaService.user.findUnique({
      where: { email },
    })

    if (!student) return null

    return PrismaStudentsMapper.toDomain(student)
  }

  async create(student: Student): Promise<void> {
    const data = PrismaStudentsMapper.toPrisma(student)

    await this.prismaService.user.create({
      data,
    })
  }
}

export { PrismaStudentsRepository }

import { StudentsRepository } from '@/domain/forum/application/repositories/students-repository'
import { Student } from '@/domain/forum/enterprise/entities/student'

class InMemoryStudentsRepository implements StudentsRepository {
  private students: Student[]

  constructor() {
    this.students = []
  }

  async findByEmail(email: string): Promise<Student | null> {
    const student = this.students.find((student) => student.email === email)

    if (!student) return null
    return student
  }

  async create(student: Student): Promise<void> {
    this.students.push(student)
  }
}

export { InMemoryStudentsRepository }

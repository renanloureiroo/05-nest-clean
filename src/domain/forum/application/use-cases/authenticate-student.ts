import { Either, left, right } from '@/core/either'
import { StudentsRepository } from '../repositories/students-repository'
import { Injectable } from '@nestjs/common'

import { HashComparer } from '../cryptography/has-comparer'
import { StudentEmailOrPasswordIncorrect } from './errors/student-email-or-password-incorrect-error'
import { Encrypter } from '../cryptography/encrypter'

interface AuthenticateStudentUseCaseDTO {
  email: string
  password: string
}

type AuthenticateStudentUseCaseResponse = Either<
  StudentEmailOrPasswordIncorrect,
  {
    accessToken: string
  }
>

@Injectable()
class AuthenticateStudentUseCase {
  constructor(
    private readonly studentRepository: StudentsRepository,
    private readonly hashCompare: HashComparer,
    private readonly encrypter: Encrypter,
  ) {}

  async execute({
    email,
    password,
  }: AuthenticateStudentUseCaseDTO): Promise<AuthenticateStudentUseCaseResponse> {
    const studentExists = await this.studentRepository.findByEmail(email)

    if (!studentExists) {
      return left(new StudentEmailOrPasswordIncorrect())
    }

    const matchPassword = await this.hashCompare.compare(
      password,
      studentExists.password,
    )

    if (!matchPassword) {
      return left(new StudentEmailOrPasswordIncorrect())
    }

    const accessToken = await this.encrypter.encrypt({
      sub: studentExists.id.toString(),
    })

    return right({
      accessToken,
    })
  }
}

export { AuthenticateStudentUseCase }

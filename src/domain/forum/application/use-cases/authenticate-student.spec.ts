import { InMemoryStudentsRepository } from 'test/repositories/in-memory-students-repository'
import { StudentsRepository } from '../repositories/students-repository'

import { FakeHasher } from 'test/cryptography/fake-hasher'

import { makeStudent } from 'test/factories/make-student'

import { Encrypter } from '../cryptography/encrypter'
import { AuthenticateStudentUseCase } from './authenticate-student'
import { FakeEncrypter } from 'test/cryptography/fake-encrypter'
import { HashComparer } from '../cryptography/has-comparer'

let studentRepository: StudentsRepository
let hashCompare: HashComparer
let encrypter: Encrypter
let sut: AuthenticateStudentUseCase

describe('Register Student', () => {
  beforeEach(() => {
    studentRepository = new InMemoryStudentsRepository()
    hashCompare = new FakeHasher()
    encrypter = new FakeEncrypter()
    sut = new AuthenticateStudentUseCase(
      studentRepository,
      hashCompare,
      encrypter,
    )
  })
  it('should be able to authenticate student', async () => {
    await studentRepository.create(
      makeStudent({
        email: 'johndoe@email.com',
        password: await new FakeHasher().hash('any_password'),
      }),
    )

    const result = await sut.execute({
      email: 'johndoe@email.com',
      password: 'any_password',
    })

    expect(result.isRight()).toBeTruthy()
    expect(result.isRight() && result.value.accessToken).toBeTruthy()
  })
})

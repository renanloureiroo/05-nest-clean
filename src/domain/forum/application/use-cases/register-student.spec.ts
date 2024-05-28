import { InMemoryStudentsRepository } from 'test/repositories/in-memory-students-repository'
import { HashGenerator } from '../cryptography/hash-generator'
import { StudentsRepository } from '../repositories/students-repository'
import { RegisterStudentUseCase } from './register-student'
import { FakeHasher } from 'test/cryptography/fake-hasher'
import { waitFor } from 'test/utils/wait-for'
import { makeStudent } from 'test/factories/make-student'
import { StudentAlreadyExistsError } from './errors/student-already-exists-error'

let studentRepository: StudentsRepository
let hashGenerator: HashGenerator
let sut: RegisterStudentUseCase

describe('Register Student', () => {
  beforeEach(() => {
    studentRepository = new InMemoryStudentsRepository()
    hashGenerator = new FakeHasher()
    sut = new RegisterStudentUseCase(studentRepository, hashGenerator)
  })
  it('should be able to register a student', async () => {
    const result = await sut.execute({
      name: 'John Doe',
      email: 'johndoe@email.com',
      password: 'any_password',
    })

    const student = await studentRepository.findByEmail('johndoe@email.com')

    await waitFor(() => expect(result.isRight()).toBeTruthy())
    await waitFor(() => expect(student?.name).toBe('John Doe'))
  })

  it("should be able to hash the student's password", async () => {
    await sut.execute({
      name: 'John Doe',
      email: 'johndoe@email.com',
      password: 'any_password',
    })

    const student = await studentRepository.findByEmail('johndoe@email.com')

    await waitFor(() =>
      expect(student?.password).toEqual('any_password-hashed'),
    )
  })

  it('should not be able to register a student with an already registered same email', async () => {
    await studentRepository.create(makeStudent({ email: 'johndoe@email.com' }))

    const result = await sut.execute({
      name: 'John Doe',
      email: 'johndoe@email.com',
      password: 'any_password',
    })

    await waitFor(() => expect(result.isLeft()).toBe(true))
    await waitFor(() =>
      expect(result.value).instanceOf(StudentAlreadyExistsError),
    )
  })
})

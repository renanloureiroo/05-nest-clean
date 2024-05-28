import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import {
  Student,
  StudentProps,
} from '@/domain/forum/enterprise/entities/student'

export const makeStudent = (
  override?: Partial<StudentProps>,
  id?: UniqueEntityId,
): Student => {
  const student = Student.create(
    {
      name: 'John Doe',
      email: 'johndoe@email.com',
      password: 'any_password',
      ...override,
    },
    id,
  )

  return student
}

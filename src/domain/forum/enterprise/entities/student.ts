import { Entity } from '@/core/entities/entity'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'

interface StudentProps {
  name: string
}

class Student extends Entity<StudentProps> {
  get name() {
    return this.props.name
  }

  set name(value: string) {
    this.props.name = value
  }

  static create(props: StudentProps, id?: UniqueEntityId) {
    const question = new Student(
      {
        ...props,
      },
      id,
    )
    return question
  }
}

export { Student }

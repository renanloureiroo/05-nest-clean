import { Entity } from '@/core/entities/entity'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'

interface InstructorProps {
  name: string
}

class Instructor extends Entity<InstructorProps> {
  get name() {
    return this.props.name
  }

  set name(value: string) {
    this.props.name = value
  }

  static create(props: InstructorProps, id?: UniqueEntityId) {
    const question = new Instructor(
      {
        ...props,
      },
      id,
    )
    return question
  }
}

export { Instructor }

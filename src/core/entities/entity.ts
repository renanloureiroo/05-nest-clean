import { UniqueEntityId } from './unique-entity-id'

class Entity<Props> {
  private _id: UniqueEntityId

  protected props: Props

  protected constructor(props: Props, id?: UniqueEntityId) {
    this._id = id ?? new UniqueEntityId()
    this.props = props
  }

  get id() {
    return this._id
  }

  public equals(entity: Entity<unknown>): boolean {
    if (entity === this) return true

    if (entity._id === this._id) return true

    return false
  }
}

export { Entity }

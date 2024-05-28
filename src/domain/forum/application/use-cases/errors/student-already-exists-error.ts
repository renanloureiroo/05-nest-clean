import { UseCaseError } from '@/core/errors/use-case-error'

class StudentAlreadyExistsError extends Error implements UseCaseError {
  constructor(identifier: string) {
    super(`Student "${identifier}" already exists`)
  }
}

export { StudentAlreadyExistsError }

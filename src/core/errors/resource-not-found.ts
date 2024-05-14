import { UseCaseError } from '@/core/errors/use-case-error'

class ResourceNotFoundError extends Error implements UseCaseError {
  constructor() {
    super('Resource not found')
  }
}

export { ResourceNotFoundError }

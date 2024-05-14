import { UseCaseError } from '@/core/errors/use-case-error'

class NotAllowedError extends Error implements UseCaseError {
  constructor() {
    super('Not allowed')
  }
}

export { NotAllowedError }

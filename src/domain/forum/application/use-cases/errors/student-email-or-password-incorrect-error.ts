import { UseCaseError } from '@/core/errors/use-case-error'

class StudentEmailOrPasswordIncorrect extends Error implements UseCaseError {
  constructor() {
    super(`Email or password incorrect`)
  }
}

export { StudentEmailOrPasswordIncorrect }

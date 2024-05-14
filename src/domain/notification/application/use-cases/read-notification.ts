import { Either, left, right } from '@/core/either'
import { NotAllowedError } from '@/core/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found'

import { NotificationsRepository } from '../repositories/notifications-repository'

interface ReadNotificationUseCaseDTO {
  notificationId: string
  recipientId: string
}

type ReadNotificationUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  null
>

class ReadNotificationUseCase {
  constructor(private notificationRepository: NotificationsRepository) {}

  async execute({
    notificationId,
    recipientId,
  }: ReadNotificationUseCaseDTO): Promise<ReadNotificationUseCaseResponse> {
    const notification =
      await this.notificationRepository.findById(notificationId)

    if (!notification) {
      return left(new ResourceNotFoundError())
    }

    if (recipientId !== notification.recipientId.toString()) {
      return left(new NotAllowedError())
    }

    notification.read()

    await this.notificationRepository.update(notification)

    return right(null)
  }
}

export { ReadNotificationUseCase }

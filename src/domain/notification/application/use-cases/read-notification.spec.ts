import { makeNotification } from 'test/factories/make-notification'
import { InMemoryNotificationsRepository } from 'test/repositories/in-memory-notifications-repository'

import { NotificationsRepository } from '../repositories/notifications-repository'
import { ReadNotificationUseCase } from './read-notification'

let notificationsRepository: NotificationsRepository
let sut: ReadNotificationUseCase

describe('UseCases => ReadNotificationUseCase', () => {
  beforeEach(() => {
    notificationsRepository = new InMemoryNotificationsRepository()
    sut = new ReadNotificationUseCase(notificationsRepository)
  })

  it('should be able to read a notification', async () => {
    const notification = makeNotification()

    await notificationsRepository.create(notification)

    const response = await sut.execute({
      notificationId: notification.id.toString(),
      recipientId: notification.recipientId.toString(),
    })

    const updatedNotification = await notificationsRepository.findById(
      notification.id.toString(),
    )

    expect(response.isRight()).toBe(true)
    expect(updatedNotification?.readAt).toBeTruthy()
  })
})

import { InMemoryNotificationsRepository } from 'test/repositories/in-memory-notifications-repository'

import { NotificationsRepository } from '../repositories/notifications-repository'
import { SendNotificationUseCase } from './send-notification'

let notificationsRepository: NotificationsRepository
let sut: SendNotificationUseCase

describe('UseCases => Create Notification', () => {
  beforeEach(() => {
    notificationsRepository = new InMemoryNotificationsRepository()
    sut = new SendNotificationUseCase(notificationsRepository)
  })

  it('should be able to create a new notification', async () => {
    const response = await sut.execute({
      recipientId: 'any_recipient_id',
      title: 'Título da notificação',
      content: 'Conteúdo da notificação',
    })

    expect(response.isRight()).toBe(true)

    expect(response.isRight() && response.value.notification.id).toBeTruthy()
  })
})

import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import {
  Notification,
  NotificationProps,
} from '@/domain/notification/enterprise/entities/notification'
import { faker } from '@faker-js/faker'

export function makeNotification(
  override: Partial<NotificationProps> = {},
  id?: UniqueEntityId,
) {
  const notification = Notification.create(
    {
      recipientId: new UniqueEntityId('any_recipient_id'),
      title: faker.lorem.words(),
      content: faker.lorem.text(),
      ...override,
    },
    id,
  )

  return notification
}

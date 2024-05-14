import { NotificationsRepository } from '@/domain/notification/application/repositories/notifications-repository'
import { Notification } from '@/domain/notification/enterprise/entities/notification'

class InMemoryNotificationsRepository implements NotificationsRepository {
  async findById(notificationId: string): Promise<Notification | null> {
    const notification = this.notifications.find(
      (item) => item.id.toString() === notificationId,
    )

    if (!notification) return null

    return notification
  }

  async update(notification: Notification): Promise<void> {
    const notificationIndex = this.notifications.findIndex(
      (item) => item.id === notification.id,
    )

    this.notifications[notificationIndex] = notification
  }

  private readonly notifications: Notification[] = []
  async create(notification: Notification): Promise<void> {
    this.notifications.push(notification)
  }
}

export { InMemoryNotificationsRepository }

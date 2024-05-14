import { Notification } from '../../enterprise/entities/notification'

interface NotificationsRepository {
  create(notification: Notification): Promise<void>
  findById(notificationId: string): Promise<Notification | null>
  update(notification: Notification): Promise<void>
}

export { NotificationsRepository }

import { NotificationsRepository } from '@/domain/notification/application/repositories/notifications-repository'
import { Notification } from '@/domain/notification/enterprise/entities/notification'
import { Injectable } from '@nestjs/common'

@Injectable()
class PrismaNotificationsRepository implements NotificationsRepository {
  create(notification: Notification): Promise<void> {
    throw new Error('Method not implemented.')
  }

  findById(notificationId: string): Promise<Notification | null> {
    throw new Error('Method not implemented.')
  }

  update(notification: Notification): Promise<void> {
    throw new Error('Method not implemented.')
  }
}

export { PrismaNotificationsRepository }

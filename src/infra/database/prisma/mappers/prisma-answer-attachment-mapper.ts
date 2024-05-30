import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { AnswerAttachment } from '@/domain/forum/enterprise/entities/answer-attachment'

import { Attachment as PrismaAnswerAttachment } from '@prisma/client'

class PrismaAnswerAttachmentMapper {
  static toDomain(raw: PrismaAnswerAttachment): AnswerAttachment {
    if (!raw.answerId) throw new Error('AnswerId is required')

    return AnswerAttachment.create(
      {
        answerId: new UniqueEntityId(raw.answerId),
        attachmentId: new UniqueEntityId(raw.id),
      },
      new UniqueEntityId(raw.id),
    )
  }
}

export { PrismaAnswerAttachmentMapper }

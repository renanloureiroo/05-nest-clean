import { AnswerAttachment } from '../../enterprise/entities/answer-attachment'

interface AnswerAttachmentsRepository {
  findManyByAnswerId(answerId: string): Promise<AnswerAttachment[]>
  create(attachment: AnswerAttachment): Promise<void>
  deleteManyByAnswerId(answerId: string): Promise<void>
}

export { AnswerAttachmentsRepository }

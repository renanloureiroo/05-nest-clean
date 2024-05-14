import { AnswerAttachmentsRepository } from '@/domain/forum/application/repositories/answer-attachments-repository'
import { AnswerAttachment } from '@/domain/forum/enterprise/entities/answer-attachment'

class InMemoryAnswerAttachmentsRepository
  implements AnswerAttachmentsRepository
{
  private readonly answerAttachments: AnswerAttachment[] = []

  async findManyByAnswerId(answerId: string): Promise<AnswerAttachment[]> {
    const attachments = this.answerAttachments.filter(
      (answerAttachment) => answerAttachment.answerId.toString() === answerId,
    )

    return attachments
  }

  async create(attachment: AnswerAttachment): Promise<void> {
    this.answerAttachments.push(attachment)
  }

  async deleteManyByAnswerId(answerId: string): Promise<void> {
    const itens = this.answerAttachments.filter(
      (answerAttachment) => answerAttachment.answerId.toString() !== answerId,
    )

    this.answerAttachments.splice(0, this.answerAttachments.length, ...itens)
  }
}

export { InMemoryAnswerAttachmentsRepository }

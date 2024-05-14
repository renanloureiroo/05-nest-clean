import { WatchedList } from '@/core/entities/watched-list'

import { QuestionAttachment } from './question-attachment'

class QuestionAttachmentList extends WatchedList<QuestionAttachment> {
  compareItems(a: QuestionAttachment, b: QuestionAttachment): boolean {
    return a.attachmentId.equals(b.attachmentId)
  }

  static create(questionAttachments: QuestionAttachment[] = []) {
    return new QuestionAttachmentList(questionAttachments)
  }
}

export { QuestionAttachmentList }

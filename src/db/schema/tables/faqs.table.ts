import { createTable, id, textNotNull } from '@/lib/drizzle.lib';

export const faqs = createTable('faqs', {
  id: id(),
  questionAr: textNotNull(),
  questionEn: textNotNull(),
  answerAr: textNotNull(),
  answerEn: textNotNull()
});

import { createdAt, createTable, id, textNotNull } from '@/lib/drizzle.lib';
import { text } from 'drizzle-orm/sqlite-core';
// TODO: Define a relation between products user interested at
export const quotationsTable = createTable('quotations', {
  id: id(),
  createdAt: createdAt(),
  fullName: textNotNull(),
  phone: textNotNull(),
  email: text()
});

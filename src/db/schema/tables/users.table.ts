import { createTable, id, textNotNull } from '@/lib/drizzle.lib';

export const usersTable = createTable('users', {
  id: id(),
  email: textNotNull(),
  permissions: textNotNull()
});

import { createTable, id, textUniqueNotNull } from '@/lib/drizzle.lib';

export const suppliersTable = createTable('suppliers', {
  id: id(),
  imageStorageKey: textUniqueNotNull()
});

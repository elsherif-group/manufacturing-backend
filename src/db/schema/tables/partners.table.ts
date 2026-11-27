import { createTable, id, textUniqueNotNull } from '@/lib/drizzle.lib';

export const partnersTable = createTable('partners', {
  id: id(),
  imageStorageKey: textUniqueNotNull()
});

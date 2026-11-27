import { boolean, createTable, foreignKey, id, integerNotNull, textNotNull, textUniqueNotNull } from '@/lib/drizzle.lib';
import { sql } from 'drizzle-orm';
import { check, integer } from 'drizzle-orm/sqlite-core';

export const projectsTable = createTable('projects', {
  id: id(),
  slug: textUniqueNotNull(),
  partnerId: integer(),
  titleAr: textNotNull(),
  titleEn: textNotNull(),
  locationAr: textNotNull(),
  locationEn: textNotNull(),
  isHighlighted: boolean(),
  sortOrder: integerNotNull()
}, ({ sortOrder }) => [
  check('sort_order_positive', sql`${sortOrder} >= 0`)
]);

export const projectsImagesTable = createTable('project_images', {
  id: id(),
  projectId: foreignKey(projectsTable.id),
  storageKey: textNotNull(),
  sortOrder: integerNotNull()
});

import { sqliteTable, index, check } from 'drizzle-orm/sqlite-core';
import { boolean, foreignKey, uniquePrimaryKey, textNotNull, integerNotNull, textUniqueNotNull } from '@/utils/drizzle.utils';
import { sql } from 'drizzle-orm';

export const projects = sqliteTable('projects', {
  id: uniquePrimaryKey(),
  slug: textUniqueNotNull(),
  titleAr: textNotNull(),
  titleEn: textNotNull(),
  locationAr: textNotNull(),
  locationEn: textNotNull(),
  isHighlighted: boolean(),
  sortOrder: integerNotNull()
}, ({ sortOrder }) => [
  check('sort_order_positive', sql`${sortOrder} >= 0`),
]);

export const projectImages = sqliteTable('project_images', {
  id: uniquePrimaryKey(),
  projectId: foreignKey(projects.id),
  storageKey: textNotNull(),
  sortOrder: integerNotNull()
}, ({ projectId }) => [
  index('project_images_project_id_index').on(projectId)
]);

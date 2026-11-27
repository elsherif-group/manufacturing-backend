import { createTable, foreignKey, id, integerNotNull, textNotNull, textUniqueNotNull } from '@/lib/drizzle.lib';
import { sql } from 'drizzle-orm';
import { check } from 'drizzle-orm/sqlite-core';

export const productsTable = createTable('products', {
  id: id(),
  slug: textUniqueNotNull(),
  titleAr: textNotNull(),
  titleEn: textNotNull(),
  descriptionAr: textNotNull(),
  descriptionEn: textNotNull(),
  sortOrder: integerNotNull()
}, ({ sortOrder }) => [
  check('sort_order_positive', sql`${sortOrder} >= 0`)
]);

export const productsImagesTable = createTable('product_images', {
  id: id(),
  productId: foreignKey(productsTable.id),
  storageKey: textNotNull(),
  sortOrder: integerNotNull()
});

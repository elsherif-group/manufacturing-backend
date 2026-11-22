import { sqliteTable, check, index } from 'drizzle-orm/sqlite-core';
import { foreignKey, uniquePrimaryKey, textNotNull, integerNotNull, textUniqueNotNull } from '@/utils/drizzle.utils';
import { sql } from 'drizzle-orm';

export const products = sqliteTable('products', {
  id: uniquePrimaryKey(),
  slug: textUniqueNotNull(),
  titleAr: textNotNull(),
  titleEn: textNotNull(),
  descriptionAr: textNotNull(),
  descriptionEn: textNotNull(),
  sortOrder: integerNotNull()
}, ({ sortOrder }) => [
  check('sort_order_positive', sql`${sortOrder} >= 0`)
]);

export const productsImages = sqliteTable('product_images', {
  id: uniquePrimaryKey(),
  productId: foreignKey(products.id),
  storageKey: textNotNull(),
  sortOrder: integerNotNull()
}, ({ productId }) => [
  index('product_images_product_id_index').on(productId)
]);

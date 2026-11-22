import { sqliteTable, primaryKey, index } from 'drizzle-orm/sqlite-core';
import { foreignKey } from '@/utils/drizzle.utils';
import { projects } from './projects';
import { products } from './products';

export const projectProducts = sqliteTable('project_products', {
  projectId: foreignKey(projects.id),
  productId: foreignKey(products.id)
}, ({ projectId, productId }) => [
  primaryKey({ columns: [projectId, productId] }),
  index('project_products_product_id_index').on(productId)
]);

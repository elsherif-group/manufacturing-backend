import { createTable, foreignKey } from '@/lib/drizzle.lib';
import { primaryKey } from 'drizzle-orm/sqlite-core';
import { productsTable } from './products.table';
import { projectsTable } from './projects.table';

export const projectsProductsTable = createTable('project_products', {
  projectId: foreignKey(projectsTable.id),
  productId: foreignKey(productsTable.id)
}, ({ projectId, productId }) => [
  primaryKey({ columns: [projectId, productId] })
]);

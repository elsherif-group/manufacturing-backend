import { relations } from 'drizzle-orm';
import { projects, projectImages } from './projects';
import { products } from './products';
import { projectProducts } from './project-products';

export const projectsRelations = relations(projects, ({ many }) => ({
  images: many(projectImages),
  projectProducts: many(projectProducts)
}));

export const projectImagesRelations = relations(projectImages, ({ one }) => ({
  project: one(projects, { fields: [projectImages.projectId], references: [projects.id] })
}));

export const productsRelations = relations(products, ({ many }) => ({
  projectProducts: many(projectProducts)
}));

export const projectProductsRelations = relations(projectProducts, ({ one }) => ({
  project: one(projects, { fields: [projectProducts.projectId], references: [projects.id] }),
  product: one(products, { fields: [projectProducts.productId], references: [products.id] })
}));

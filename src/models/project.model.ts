import { db } from '@/db';
import { projectsImagesTable, projectsTable } from '@/db/schema';
import { asc, eq } from 'drizzle-orm';

const withImages = {
  images: { orderBy: [asc(projectsImagesTable.sortOrder)] }
};

const findProjects = () => {
  return db.query.projectsTable.findMany({
    orderBy: [asc(projectsTable.sortOrder)],
    with: withImages
  });
};

const findProjectBySlug = (slug: string) => {
  return db.query.projectsTable.findFirst({
    where: eq(projectsTable.slug, slug),
    with: withImages
  });
};

const insertProject = () => { };

const updateProject = () => { };

const deleteProject = () => { };

export const ProjectModel = Object.freeze({
  findProjects,
  findProjectBySlug,
  insertProject,
  updateProject,
  deleteProject
});

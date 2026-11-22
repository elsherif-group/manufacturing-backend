import { asc, eq } from 'drizzle-orm';
import { db } from '@/lib/db';
import { projects, projectImages } from '@/lib/schema';

const withImages = {
  images: { orderBy: [asc(projectImages.sortOrder)] }
};

const findProjects = () => {
  return db.query.projects.findMany({
    orderBy: [asc(projects.sortOrder)],
    with: withImages
  });
};

const findProjectBySlug = (slug: string) => {
  return db.query.projects.findFirst({
    where: eq(projects.slug, slug),
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

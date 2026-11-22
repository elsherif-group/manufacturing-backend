import { ProjectModel } from '@/models/project.model';

const getProjectBySlug = (slug: string) => {
  return ProjectModel.findProjectBySlug(slug);
};

const listProjects = () => { };
const createProject = () => { };
const updateProject = () => { };
const deleteProject = () => { };

export const ProjectService = Object.freeze({
  getProjectBySlug,
  listProjects,
  createProject,
  updateProject,
  deleteProject
});

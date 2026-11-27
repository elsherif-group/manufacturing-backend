import { factory } from '@/lib/factory.lib';
import { ProjectService } from '@/services/project.service';

const listProjects = factory.createHandlers(async (c) => {
  const projects = await ProjectService.listProjects();
  return c.json({ projects }, 200);
});

const getProject = factory.createHandlers(async (c) => {

});

export const ProjectController = Object.freeze({
  listProjects,
  getProject
});

import historyData from '../data/history.json';
import projectsData from '../data/projects.json';
import { resolveImage } from './imageRegistry';

export const getHistory = () => {
  return historyData.map(item => ({
    ...item,
    imageSrc: resolveImage(item.imageSrc, 'history'),
  }));
};

export const getProjects = () => {
  return projectsData.map(project => ({
    ...project,
    imageSrc: resolveImage(project.imageSrc, 'projects'),
    screenshots: (project.screenshots || [])
      .map(key => resolveImage(key, 'projects'))
      .filter(Boolean),
  }));
};

import historyData from '../data/history.json';
import projectsData from '../data/projects.json';
import keywordsData from '../data/keywords.json';
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

export const getKeywords = () => {
  return keywordsData.map(keyword => {
    // Extract filename and strip extension to match buildImageMap keys
    const filename = keyword.imageSrc.split('/').pop();
    const key = filename.substring(0, filename.lastIndexOf('.'));
    return {
      ...keyword,
      imageSrc: resolveImage(key, 'hero'),
    };
  });
};

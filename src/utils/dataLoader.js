import historyData from '../data/history.json';
import projectsData from '../data/projects.json';
import keywordsData from '../data/keywords.json';
import blogsData from '../data/blogs.json';
import { resolveImage } from './imageRegistry';
import { supabase } from '../admin/lib/supabaseClient';

export const getHistory = async () => {
  try {
    const { data, error } = await supabase
      .from('experience')
      .select('*')
      .order('sort_order', { ascending: true });
    if (error) throw error;
    return data.map(item => ({
      role: item.role,
      organisation: item.organisation,
      startDate: item.start_date,
      endDate: item.end_date,
      experiences: item.experiences,
      imageSrc: resolveImage(item.image_src, 'history'),
    }));
  } catch {
    return historyData.map(item => ({
      ...item,
      imageSrc: resolveImage(item.imageSrc, 'history'),
    }));
  }
};

export const getProjects = async () => {
  try {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('sort_order', { ascending: true });
    if (error) throw error;
    return data.map(item => {
      const proj = {
        title: item.title,
        imageSrc: resolveImage(item.image_src, 'projects'),
        description: item.description,
        skills: item.skills,
        screenshots: (item.screenshots || [])
          .map(key => resolveImage(key, 'projects'))
          .filter(Boolean),
      };
      if (item.demo) proj.demo = item.demo;
      if (item.source) proj.source = item.source;
      if (item.youtube_link) proj.youtubeLink = item.youtube_link;
      return proj;
    });
  } catch {
    return projectsData.map(project => ({
      ...project,
      imageSrc: resolveImage(project.imageSrc, 'projects'),
      screenshots: (project.screenshots || [])
        .map(key => resolveImage(key, 'projects'))
        .filter(Boolean),
    }));
  }
};

export const getBlogs = async () => {
  try {
    const { data, error } = await supabase
      .from('blogs')
      .select('*')
      .eq('published', true)
      .order('sort_order', { ascending: true });
    if (error) throw error;
    return data.map(item => ({
      title: item.title,
      slug: item.slug,
      date: item.date,
      excerpt: item.excerpt,
      content: item.content,
      imageSrc: resolveImage(item.image_src, 'blogs'),
    }));
  } catch {
    return blogsData.map(blog => ({
      ...blog,
      imageSrc: resolveImage(blog.imageSrc, 'blogs'),
    }));
  }
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

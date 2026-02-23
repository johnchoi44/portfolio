import { supabase } from './supabaseClient'

const BUCKET = 'portfolio-assets'
const RESUME_PATH = 'resume/resume.pdf'

const download = (content, filename, type = 'application/json') => {
  const blob = new Blob([content], { type })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

export const exportHistory = async () => {
  const { data, error } = await supabase
    .from('experience')
    .select('*')
    .order('sort_order', { ascending: true })

  if (error) throw new Error(error.message)

  const history = data.map(item => ({
    role: item.role,
    organisation: item.organisation,
    startDate: item.start_date,
    endDate: item.end_date,
    experiences: item.experiences,
    imageSrc: item.image_src,
  }))

  download(JSON.stringify(history, null, 2), 'history.json')
}

export const exportProjects = async () => {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .order('sort_order', { ascending: true })

  if (error) throw new Error(error.message)

  const projects = data.map(item => {
    const proj = {
      title: item.title,
      imageSrc: item.image_src,
      description: item.description,
      skills: item.skills,
    }
    if (item.demo) proj.demo = item.demo
    if (item.source) proj.source = item.source
    if (item.youtube_link) proj.youtubeLink = item.youtube_link
    proj.screenshots = item.screenshots
    return proj
  })

  download(JSON.stringify(projects, null, 2), 'projects.json')
}

export const getAboutText = async () => {
  const { data, error } = await supabase
    .from('about')
    .select('content')
    .limit(1)
    .single()

  if (error) throw new Error(error.message)
  return data.content
}

export const downloadResume = async () => {
  const { data } = supabase.storage.from(BUCKET).getPublicUrl(RESUME_PATH)
  window.open(data.publicUrl, '_blank')
}

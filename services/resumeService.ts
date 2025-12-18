
import { GeneratedResume, SavedResume } from '../types';

const RESUMES_KEY = 'cv_master_resumes';

export const resumeService = {
  saveResume: (userId: string, data: GeneratedResume, userEmail?: string): SavedResume => {
    const resumes = JSON.parse(localStorage.getItem(RESUMES_KEY) || '[]');
    
    const newResume: SavedResume = {
      id: Math.random().toString(36).substr(2, 9),
      userId,
      userEmail: userEmail?.toLowerCase().trim(),
      createdAt: new Date().toISOString(),
      data,
      title: data.structured.role || 'Currículo Sem Título'
    };

    resumes.unshift(newResume);
    localStorage.setItem(RESUMES_KEY, JSON.stringify(resumes));
    return newResume;
  },

  getResumesByUser: (userId: string, userEmail?: string): SavedResume[] => {
    const resumes = JSON.parse(localStorage.getItem(RESUMES_KEY) || '[]');
    const normalizedEmail = userEmail?.toLowerCase().trim();
    
    // Fallback logic: check both ID and Email to ensure persistence regardless of ID changes
    return resumes.filter((r: SavedResume) => {
        const matchId = String(r.userId) === String(userId);
        const matchEmail = normalizedEmail && r.userEmail === normalizedEmail;
        return matchId || matchEmail;
    });
  },

  deleteResume: (id: string): void => {
    const resumes = JSON.parse(localStorage.getItem(RESUMES_KEY) || '[]');
    const filtered = resumes.filter((r: SavedResume) => r.id !== id);
    localStorage.setItem(RESUMES_KEY, JSON.stringify(filtered));
  },

  updateResumeTitle: (id: string, newTitle: string): void => {
    const resumes = JSON.parse(localStorage.getItem(RESUMES_KEY) || '[]');
    const index = resumes.findIndex((r: SavedResume) => r.id === id);
    if (index !== -1) {
        resumes[index].title = newTitle;
        localStorage.setItem(RESUMES_KEY, JSON.stringify(resumes));
    }
  },

  appendCourseToResume: (resumeId: string, courseText: string, hours?: string, date?: string): boolean => {
    const resumes = JSON.parse(localStorage.getItem(RESUMES_KEY) || '[]');
    const index = resumes.findIndex((r: SavedResume) => r.id === resumeId);
    
    if (index !== -1) {
      const resume = resumes[index];
      
      let fullCourseInfo = courseText;
      const details = [];
      if (hours && hours.trim() !== '') details.push(`Carga horária: ${hours}h`);
      if (date && date.trim() !== '') {
        const formattedDate = date.split('-').reverse().join('/');
        details.push(`Concluído em: ${formattedDate}`);
      }
      
      if (details.length > 0) {
        fullCourseInfo += ` (${details.join(', ')})`;
      }

      const entry = `\n- ${fullCourseInfo}`;
      
      // Update Markdown content
      resume.data.markdown += entry;
      // Update Structured education field
      if (resume.data.structured) {
          resume.data.structured.education = (resume.data.structured.education || '') + entry;
      }
      
      resumes[index] = resume;
      localStorage.setItem(RESUMES_KEY, JSON.stringify(resumes));
      return true;
    }
    return false;
  },

  duplicateResume: (id: string): void => {
    const resumes = JSON.parse(localStorage.getItem(RESUMES_KEY) || '[]');
    const original = resumes.find((r: SavedResume) => r.id === id);
    
    if (original) {
        const copy: SavedResume = {
            ...original,
            id: Math.random().toString(36).substr(2, 9),
            title: `${original.title} (Cópia)`,
            createdAt: new Date().toISOString()
        };
        resumes.unshift(copy);
        localStorage.setItem(RESUMES_KEY, JSON.stringify(resumes));
    }
  }
};

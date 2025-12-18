
export interface ResumeFormData {
  fullName: string;
  email: string;
  phone: string;
  age?: string;
  location?: string;
  objective: string;
  experience: string;
  education: string;
  skills: string;
  projects?: string;
  socials?: string;
  photo?: string; // base64 string for the profile picture
}

export interface StructuredResume {
  fullName: string;
  role: string;
  summary: string;
  contact: {
    email: string;
    phone: string;
    location: string;
    linkedin?: string;
    website?: string;
  };
  skills: string[];
  languages: string[];
  experience: string; // Markdown content
  education: string; // Markdown content
  projects: string; // Markdown content
  certifications: string; // Markdown content
}

export interface GeneratedResume {
  markdown: string; // Fallback / Full text version
  structured: StructuredResume; // For Layouts
  suggestions: string;
}

export interface SavedResume {
  id: string;
  userId: string;
  userEmail?: string; // Added for robust persistence across updates
  createdAt: string;
  data: GeneratedResume;
  title: string;
}

export enum AppMode {
  HOME = 'HOME',
  TEMPLATES = 'TEMPLATES',
  CREATE = 'CREATE',
  CREATE_APPRENTICE = 'CREATE_APPRENTICE',
  REFINE = 'REFINE',
  RESULT = 'RESULT',
  PHOTO_STUDIO = 'PHOTO_STUDIO',
  BEFORE_AFTER = 'BEFORE_AFTER',
  JOB_ANALYSIS = 'JOB_ANALYSIS',
  ATS_CHECKER = 'ATS_CHECKER',
  LINKEDIN_GEN = 'LINKEDIN_GEN',
  INTERVIEW_SIM = 'INTERVIEW_SIM',
  COMPARISON = 'COMPARISON',
  COURSES = 'COURSES',
  JOB_SEARCH = 'JOB_SEARCH',
  HISTORY = 'HISTORY',
  ADMIN = 'ADMIN'
}

export type TemplateId = 
  | 'modern' 
  | 'classic' 
  | 'vertical' 
  | 'horizontal' 
  | 'informal' 
  | 'metro' 
  | 'minimal' 
  | 'creative' 
  | 'tech' 
  | 'elegant';

export type PhotoStyle = 
  | 'classic'
  | 'modern'
  | 'corporate'
  | 'bokeh'
  | 'bw';

export interface FileUpload {
  name: string;
  type: string;
  data: string; // base64
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
  createdAt: string;
  licenseCode?: string;
  credits: number;
}

export interface License {
  code: string;
  status: 'active' | 'used';
  createdAt: string;
  createdBy: string;
  usedBy?: string; // User Email
  usedAt?: string;
}

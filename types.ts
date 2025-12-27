export interface Project {
  id: string;
  title: string;
  description: string;
  tags: string[];
  imageUrl: string;
  link: string;
}

export interface Skill {
  name: string;
  category: 'Frontend' | 'Backend' | 'Tools' | 'Soft Skills';
  level: number; // 0 to 100
  description?: string; // Detailed breakdown for pop-ups
}

export interface Experience {
  company: string;
  role: string;
  period: string;
  description: string;
}

export interface Message {
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

export interface PersonalData {
  name: string;
  title: string;
  tagline: string;
  bio: string;
  email: string;
  linkedinUrl?: string;
  skills: Skill[];
  projects: Project[];
  experience: Experience[];
}
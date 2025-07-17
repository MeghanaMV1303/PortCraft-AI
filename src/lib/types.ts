export interface Project {
  id: string;
  title: string;
  techStack: string;
  description: string;
  link?: string;
  imageUrl?: string;
}

export interface Skill {
  id: string;
  name: string;
}

export interface Experience {
    id: string;
    role: string;
    company: string;
    period: string;
    description: string;
}

export interface Testimonial {
    id: string;
    name: string;
    role: string;
    text: string;
    avatarUrl?: string;
}

export interface Contact {
    email: string;
    github: string;
    linkedin: string;
}

export interface ThemeSettings {
    colorScheme: 'light' | 'dark';
    layout: 'standard' | 'minimal' | 'creative';
}

export interface PortfolioData {
  name: string;
  headline: string;
  aboutMe: string;
  projects: Project[];
  skills: Skill[];
  experiences: Experience[];
  testimonials: Testimonial[];
  contact: Contact;
  theme: ThemeSettings;
}

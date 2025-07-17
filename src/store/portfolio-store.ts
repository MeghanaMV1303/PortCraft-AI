'use client';

import { create } from 'zustand';
import type { PortfolioData, Project, Skill, Experience, Testimonial, Contact, ThemeSettings } from '@/lib/types';

interface PortfolioState extends PortfolioData {
  setName: (name: string) => void;
  setHeadline: (headline: string) => void;
  setAboutMe: (aboutMe: string) => void;
  setProjects: (projects: Project[]) => void;
  setSkills: (skills: Skill[]) => void;
  setExperiences: (experiences: Experience[]) => void;
  setTestimonials: (testimonials: Testimonial[]) => void;
  setContact: (contact: Contact) => void;
  setTheme: (theme: ThemeSettings) => void;
  setPortfolioData: (data: PortfolioData) => void;
}

const usePortfolioStore = create<PortfolioState>((set) => ({
  name: '',
  headline: '',
  aboutMe: '',
  projects: [],
  skills: [],
  experiences: [],
  testimonials: [],
  contact: { email: '', github: '', linkedin: '' },
  theme: { colorScheme: 'dark', layout: 'standard' },

  setName: (name) => set({ name }),
  setHeadline: (headline) => set({ headline }),
  setAboutMe: (aboutMe) => set({ aboutMe }),
  setProjects: (projects) => set({ projects }),
  setSkills: (skills) => set({ skills }),
  setExperiences: (experiences) => set({ experiences }),
  setTestimonials: (testimonials) => set({ testimonials }),
  setContact: (contact) => set({ contact }),
  setTheme: (theme) => set({ theme }),
  setPortfolioData: (data) => set({ ...data }),
}));

export { usePortfolioStore };

'use client';

import { useState } from 'react';
import type { Project, Skill } from '@/lib/types';
import { Header } from '@/components/header';
import { AboutMeSection } from '@/components/about-me-section';
import { ProjectsSection } from '@/components/projects-section';
import { SkillsSection } from '@/components/skills-section';
import { PortfolioPreview } from '@/components/portfolio-preview';
import { Separator } from '@/components/ui/separator';

const initialProjects: Project[] = [
  {
    id: '1',
    title: 'E-commerce Platform',
    techStack: 'React, Node.js, MongoDB',
    description: 'A full-stack e-commerce application with product listings, a shopping cart, and a checkout process. Integrated with Stripe for payments.',
    link: 'https://github.com',
    imageUrl: 'https://placehold.co/600x400.png',
  },
  {
    id: '2',
    title: 'Task Management App',
    techStack: 'Next.js, Firebase, Tailwind CSS',
    description: 'A responsive task management app that allows users to create, organize, and track their daily tasks with a clean, drag-and-drop interface.',
    link: 'https://github.com',
    imageUrl: 'https://placehold.co/600x400.png',
  },
];

const initialSkills: Skill[] = [
  { id: '1', name: 'JavaScript' },
  { id: '2', name: 'TypeScript' },
  { id: '3', name: 'React' },
  { id: '4', name: 'Next.js' },
  { id: '5', name: 'Node.js' },
  { id: '6', name: 'Python' },
  { id: '7', name: 'MongoDB' },
  { id: '8', name: 'Docker' },
];

export default function DashboardPage() {
  const [aboutMe, setAboutMe] = useState(
    "I'm a passionate software developer with a knack for creating dynamic and intuitive web applications. I thrive on solving complex problems and turning ideas into reality through code."
  );
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [skills, setSkills] = useState<Skill[]>(initialSkills);
  const [name, setName] = useState('Your Name');
  const [headline, setHeadline] = useState('Full-Stack Developer | AI Enthusiast');

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 container mx-auto p-4 md:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-8">
            <h1 className="text-3xl md:text-4xl font-bold font-headline text-primary">Portfolio Dashboard</h1>
            <AboutMeSection
              aboutMe={aboutMe}
              setAboutMe={setAboutMe}
              name={name}
              setName={setName}
              headline={headline}
              setHeadline={setHeadline}
            />
            <ProjectsSection projects={projects} setProjects={setProjects} />
            <SkillsSection skills={skills} setSkills={setSkills} />
          </div>
          <div className="relative">
            <div className="sticky top-8">
              <h2 className="text-2xl font-bold font-headline text-primary mb-4">Live Preview</h2>
              <div className="rounded-xl border bg-card text-card-foreground shadow-lg overflow-hidden h-[calc(100vh-8rem)]">
                <PortfolioPreview
                  name={name}
                  headline={headline}
                  aboutMe={aboutMe}
                  projects={projects}
                  skills={skills}
                />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

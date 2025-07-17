'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { PortfolioData, Project, Skill, Experience, Contact, ThemeSettings, Testimonial } from '@/lib/types';
import { Header } from '@/components/header';
import { AboutMeSection } from '@/components/about-me-section';
import { ProjectsSection } from '@/components/projects-section';
import { SkillsSection } from '@/components/skills-section';
import { ExperienceSection } from '@/components/experience-section';
import { TestimonialsSection } from '@/components/testimonials-section';
import { ContactSection } from '@/components/contact-section';
import { CoverLetterSection } from '@/components/cover-letter-section';
import { ThemeSection } from '@/components/theme-section';
import { PortfolioPreview } from '@/components/portfolio-preview';
import { PortfolioEvaluatorSection } from '@/components/portfolio-evaluator-section';
import { Button } from '@/components/ui/button';
import { Rocket } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { usePortfolioStore } from '@/store/portfolio-store';

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

const initialExperience: Experience[] = [
    {
        id: '1',
        role: 'Software Engineer',
        company: 'Tech Solutions Inc.',
        period: '2020 - Present',
        description: 'Developed and maintained web applications using React and Node.js. Collaborated with cross-functional teams to deliver high-quality software products.'
    },
    {
        id: '2',
        role: 'Junior Developer',
        company: 'Web Wizards LLC',
        period: '2018 - 2020',
        description: 'Assisted in the development of client websites, focusing on front-end features and responsive design. Gained experience with modern JavaScript frameworks.'
    }
];

const initialTestimonials: Testimonial[] = [
    {
        id: '1',
        name: 'Alex Johnson',
        role: 'Project Manager at Tech Solutions Inc.',
        text: 'An exceptional developer who is not only technically proficient but also a great team player. Consistently delivers high-quality work on time.',
        avatarUrl: 'https://i.pravatar.cc/150?u=a042581f4e29026704d',
    }
];

export default function DashboardPage() {
  const router = useRouter();
  const { toast } = useToast();

  const {
    name, setName,
    headline, setHeadline,
    aboutMe, setAboutMe,
    projects, setProjects,
    skills, setSkills,
    experiences, setExperiences,
    testimonials, setTestimonials,
    contact, setContact,
    theme, setTheme,
    setPortfolioData,
  } = usePortfolioStore();

  useState(() => {
    setPortfolioData({
      name: 'Your Name',
      headline: 'Full-Stack Developer | AI Enthusiast',
      aboutMe: "I'm a passionate software developer with a knack for creating dynamic and intuitive web applications. I thrive on solving complex problems and turning ideas into reality through code.",
      projects: initialProjects,
      skills: initialSkills,
      experiences: initialExperience,
      testimonials: initialTestimonials,
      contact: {
        email: 'your.email@example.com',
        github: 'your-github',
        linkedin: 'your-linkedin'
      },
      theme: {
        colorScheme: 'dark',
        layout: 'standard'
      }
    });
  });

  const handlePublish = () => {
    toast({
      title: "Let's Go!",
      description: "Your portfolio is ready in a new tab.",
    });
    window.open('/portfolio', '_blank');
  };

  const portfolioData = {
    name,
    headline,
    aboutMe,
    projects,
    skills,
    experiences,
    testimonials,
    contact,
    theme,
  };


  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 container mx-auto p-4 md:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-8">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl md:text-4xl font-bold font-headline text-primary">Portfolio Dashboard</h1>
                <Button onClick={handlePublish}>
                    <Rocket className="mr-2" />
                    Publish
                </Button>
            </div>
            <AboutMeSection
              aboutMe={aboutMe}
              setAboutMe={setAboutMe}
              name={name}
              setName={setName}
              headline={headline}
              setHeadline={setHeadline}
            />
            <ThemeSection theme={theme} setTheme={setTheme} />
            <ProjectsSection projects={projects} setProjects={setProjects} />
            <SkillsSection skills={skills} setSkills={setSkills} />
            <ExperienceSection experiences={experiences} setExperiences={setExperiences} />
            <TestimonialsSection testimonials={testimonials} setTestimonials={setTestimonials} />
            <ContactSection contact={contact} setContact={setContact} />
            <PortfolioEvaluatorSection portfolioData={portfolioData} />
            <CoverLetterSection portfolioData={portfolioData} />
          </div>
          <div className="relative">
            <div className="sticky top-8">
              <h2 className="text-2xl font-bold font-headline text-primary mb-4">Live Preview</h2>
              <div className="rounded-xl border bg-card text-card-foreground shadow-lg overflow-hidden h-[calc(100vh-8rem)]">
                <PortfolioPreview {...portfolioData} />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

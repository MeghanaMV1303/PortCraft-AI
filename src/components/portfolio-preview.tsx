'use client';

import type { Project, Skill, Experience, Contact, ThemeSettings } from '@/lib/types';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Link2, Mail, Github, Linkedin } from 'lucide-react';
import { cn } from '@/lib/utils';
import React from 'react';

interface PortfolioPreviewProps {
  name: string;
  headline: string;
  aboutMe: string;
  projects: Project[];
  skills: Skill[];
  experiences: Experience[];
  contact: Contact;
  theme: ThemeSettings;
}

const colorSchemes = {
  dark: {
    '--preview-background': 'hsl(240 10% 3.9%)',
    '--preview-foreground': 'hsl(0 0% 98%)',
    '--preview-primary': 'hsl(0 0% 98%)',
    '--preview-primary-foreground': 'hsl(240 10% 3.9%)',
    '--preview-secondary': 'hsl(240 3.7% 15.9%)',
    '--preview-secondary-foreground': 'hsl(0 0% 98%)',
    '--preview-muted': 'hsl(240 3.7% 15.9%)',
    '--preview-muted-foreground': 'hsl(240 5% 64.9%)',
    '--preview-accent': 'hsl(0 0% 98%)',
    '--preview-accent-foreground': 'hsl(240 5.9% 10%)',
    '--preview-border': 'hsl(240 3.7% 15.9%)',
    '--preview-card': 'hsl(240 3.7% 15.9%)',
    '--preview-card-foreground': 'hsl(0 0% 98%)',
  },
  light: {
    '--preview-background': 'hsl(0 0% 100%)',
    '--preview-foreground': 'hsl(240 10% 3.9%)',
    '--preview-primary': 'hsl(240 5.9% 10%)',
    '--preview-primary-foreground': 'hsl(0 0% 98%)',
    '--preview-secondary': 'hsl(240 4.8% 95.9%)',
    '--preview-secondary-foreground': 'hsl(240 5.9% 10%)',
    '--preview-muted': 'hsl(240 4.8% 95.9%)',
    '--preview-muted-foreground': 'hsl(240 3.8% 46.1%)',
    '--preview-accent': 'hsl(240 5.9% 10%)',
    '--preview-accent-foreground': 'hsl(0 0% 98%)',
    '--preview-border': 'hsl(240 5.9% 90%)',
    '--preview-card': 'hsl(0 0% 100%)',
    '--preview-card-foreground': 'hsl(240 10% 3.9%)',
  },
};

export function PortfolioPreview({ name, headline, aboutMe, projects, skills, experiences, contact, theme }: PortfolioPreviewProps) {
  
  const layoutComponents = {
    standard: StandardLayout,
    minimal: MinimalLayout,
  };

  const Layout = layoutComponents[theme.layout] || StandardLayout;

  return (
    <ScrollArea className="h-full w-full">
      <div 
        className="p-6 md:p-8"
        style={colorSchemes[theme.colorScheme] as React.CSSProperties}
      >
        <Layout
          name={name}
          headline={headline}
          aboutMe={aboutMe}
          projects={projects}
          skills={skills}
          experiences={experiences}
          contact={contact}
        />
      </div>
    </ScrollArea>
  );
}

const HeaderSection = ({ name, headline, contact }: Omit<PortfolioPreviewProps, 'aboutMe' | 'projects' | 'skills' | 'experiences' | 'theme'>) => (
  <header className="flex flex-col md:flex-row items-start md:items-center justify-between space-y-4 md:space-y-0 mb-8">
    <div className="flex items-center space-x-4">
      <Avatar className="h-20 w-20 border-2 border-[hsl(var(--preview-border))]">
        <AvatarImage src={`https://api.dicebear.com/8.x/initials/svg?seed=${name}`} alt={name} />
        <AvatarFallback>{name.charAt(0).toUpperCase()}</AvatarFallback>
      </Avatar>
      <div>
        <h1 className="text-3xl font-bold font-headline text-[hsl(var(--preview-primary))]">{name}</h1>
        <p className="text-xl text-[hsl(var(--preview-muted-foreground))]">{headline}</p>
      </div>
    </div>
    <div className="flex items-center space-x-4">
      {contact.email && <a href={`mailto:${contact.email}`} className="text-[hsl(var(--preview-muted-foreground))] hover:text-[hsl(var(--preview-primary))]"><Mail /></a>}
      {contact.github && <a href={`https://github.com/${contact.github}`} target="_blank" rel="noopener noreferrer" className="text-[hsl(var(--preview-muted-foreground))] hover:text-[hsl(var(--preview-primary))]"><Github /></a>}
      {contact.linkedin && <a href={`https://linkedin.com/in/${contact.linkedin}`} target="_blank" rel="noopener noreferrer" className="text-[hsl(var(--preview-muted-foreground))] hover:text-[hsl(var(--preview-primary))]"><Linkedin /></a>}
    </div>
  </header>
);

const AboutSection = ({ aboutMe }: { aboutMe: string }) => (
  <section id="about" className="mb-12">
    <h2 className="text-2xl font-semibold font-headline border-b border-[hsl(var(--preview-border))] pb-2 mb-4 text-[hsl(var(--preview-foreground))]">About Me</h2>
    <p className="text-[hsl(var(--preview-foreground))] opacity-80 leading-relaxed whitespace-pre-wrap">{aboutMe}</p>
  </section>
);

const SkillsSection = ({ skills }: { skills: Skill[] }) => (
  <section id="skills" className="mb-12">
    <h2 className="text-2xl font-semibold font-headline border-b border-[hsl(var(--preview-border))] pb-2 mb-4 text-[hsl(var(--preview-foreground))]">Skills</h2>
    <div className="flex flex-wrap gap-2">
      {skills.map((skill) => (
        <Badge key={skill.id} variant="secondary" className="text-sm px-3 py-1 bg-[hsl(var(--preview-secondary))] text-[hsl(var(--preview-secondary-foreground))]">
          {skill.name}
        </Badge>
      ))}
    </div>
  </section>
);

const ExperienceSectionPreview = ({ experiences }: { experiences: Experience[] }) => (
    <section id="experience" className="mb-12">
        <h2 className="text-2xl font-semibold font-headline border-b border-[hsl(var(--preview-border))] pb-2 mb-4 text-[hsl(var(--preview-foreground))]">Experience</h2>
        <div className="space-y-6">
            {experiences.map(exp => (
                <div key={exp.id}>
                    <h3 className="text-xl font-bold text-[hsl(var(--preview-primary))]">{exp.role}</h3>
                    <div className="flex justify-between items-baseline">
                        <p className="font-semibold text-[hsl(var(--preview-foreground))] opacity-90">{exp.company}</p>
                        <p className="text-sm text-[hsl(var(--preview-muted-foreground))]">{exp.period}</p>
                    </div>
                    <p className="mt-2 text-[hsl(var(--preview-foreground))] opacity-80 whitespace-pre-wrap">{exp.description}</p>
                </div>
            ))}
        </div>
    </section>
);


const ProjectsSectionPreview = ({ projects }: { projects: Project[] }) => (
  <section id="projects">
    <h2 className="text-2xl font-semibold font-headline border-b border-[hsl(var(--preview-border))] pb-2 mb-4 text-[hsl(var(--preview-foreground))]">Projects</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {projects.map((project) => (
        <Card key={project.id} className="overflow-hidden bg-[hsl(var(--preview-card))] text-[hsl(var(--preview-card-foreground))] border-[hsl(var(--preview-border))]">
          {project.imageUrl && (
            <Image
              src={project.imageUrl}
              alt={project.title}
              width={600}
              height={400}
              className="w-full h-48 object-cover"
              data-ai-hint="technology project"
            />
          )}
          <CardHeader>
            <CardTitle>{project.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-[hsl(var(--preview-muted-foreground))] mb-4 h-20 overflow-y-auto">{project.description}</p>
            <div className="flex flex-wrap gap-2 mb-4">
              {project.techStack.split(',').map((tech, index) => (
                <Badge key={index} variant="outline" className="border-[hsl(var(--preview-border))]">
                  {tech.trim()}
                </Badge>
              ))}
            </div>
            {project.link && (
                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-[hsl(var(--preview-accent))] hover:underline"
                >
                  <Link2 className="h-4 w-4" />
                  View Project
                </a>
              )}
          </CardContent>
        </Card>
      ))}
    </div>
  </section>
);


type LayoutProps = Omit<PortfolioPreviewProps, 'theme'>;

const StandardLayout = (props: LayoutProps) => (
  <>
    <HeaderSection {...props} />
    <AboutSection {...props} />
    <ExperienceSectionPreview {...props} />
    <SkillsSection {...props} />
    <ProjectsSectionPreview {...props} />
  </>
);

const MinimalLayout = (props: LayoutProps) => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
            <HeaderSection {...props} />
            <AboutSection {...props} />
        </div>
        <div className="md:col-span-2">
            <ExperienceSectionPreview {...props} />
            <ProjectsSectionPreview {...props} />
            <SkillsSection {...props} />
        </div>
    </div>
);

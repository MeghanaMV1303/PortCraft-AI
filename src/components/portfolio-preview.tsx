'use client';

import type { Project, Skill, Experience, Contact, ThemeSettings, Testimonial } from '@/lib/types';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Link2, Mail, Github, Linkedin, Quote } from 'lucide-react';
import { cn } from '@/lib/utils';
import React from 'react';

interface PortfolioPreviewProps {
  name: string;
  headline: string;
  aboutMe: string;
  projects: Project[];
  skills: Skill[];
  experiences: Experience[];
  testimonials: Testimonial[];
  contact: Contact;
  theme: ThemeSettings;
  isPublicView?: boolean;
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

export function PortfolioPreview({ isPublicView = false, ...props }: PortfolioPreviewProps) {
  
  const layoutComponents = {
    standard: StandardLayout,
    minimal: MinimalLayout,
    creative: CreativeLayout,
  };

  const Layout = layoutComponents[props.theme.layout] || StandardLayout;

  const content = (
      <div 
        className={cn("p-6 md:p-8", isPublicView ? "" : "bg-[hsl(var(--preview-background))]")}
        style={colorSchemes[props.theme.colorScheme] as React.CSSProperties}
      >
        <Layout {...props} />
      </div>
  );
  
  if (isPublicView) {
    return content;
  }

  return (
    <ScrollArea className="h-full w-full">
      {content}
    </ScrollArea>
  );
}

type LayoutProps = Omit<PortfolioPreviewProps, 'theme' | 'isPublicView'>;

const HeaderSection = ({ name, headline, contact }: Omit<LayoutProps, 'aboutMe' | 'projects' | 'skills' | 'experiences' | 'testimonials'>) => (
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

const Section = ({ title, children }: { title: string, children: React.ReactNode }) => (
    <section className="mb-12">
        <h2 className="text-2xl font-semibold font-headline border-b border-[hsl(var(--preview-border))] pb-2 mb-4 text-[hsl(var(--preview-foreground))]">{title}</h2>
        {children}
    </section>
);


const AboutSection = ({ aboutMe }: { aboutMe: string }) => (
  <Section title="About Me">
    <p className="text-[hsl(var(--preview-foreground))] opacity-80 leading-relaxed whitespace-pre-wrap">{aboutMe}</p>
  </Section>
);

const SkillsSection = ({ skills }: { skills: Skill[] }) => (
  <Section title="Skills">
    <div className="flex flex-wrap gap-2">
      {skills.map((skill) => (
        <Badge key={skill.id} variant="secondary" className="text-sm px-3 py-1 bg-[hsl(var(--preview-secondary))] text-[hsl(var(--preview-secondary-foreground))]">
          {skill.name}
        </Badge>
      ))}
    </div>
  </Section>
);

const ExperienceSectionPreview = ({ experiences }: { experiences: Experience[] }) => (
    <Section title="Experience">
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
    </Section>
);

const TestimonialsSectionPreview = ({ testimonials }: { testimonials: Testimonial[] }) => (
    <Section title="Testimonials">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {testimonials.map(t => (
                <Card key={t.id} className="p-6 bg-[hsl(var(--preview-card))] text-[hsl(var(--preview-card-foreground))] border-[hsl(var(--preview-border))]">
                    <CardContent className="p-0">
                        <Quote className="w-8 h-8 text-[hsl(var(--preview-muted-foreground))] mb-4" />
                        <p className="mb-4 text-[hsl(var(--preview-foreground))] opacity-80 italic">"{t.text}"</p>
                        <div className="flex items-center gap-4">
                            <Avatar>
                                <AvatarImage src={t.avatarUrl} alt={t.name} />
                                <AvatarFallback>{t.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                                <p className="font-bold text-[hsl(var(--preview-primary))]">{t.name}</p>
                                <p className="text-sm text-[hsl(var(--preview-muted-foreground))]">{t.role}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    </Section>
);


const ProjectsSectionPreview = ({ projects }: { projects: Project[] }) => (
  <Section title="Projects">
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
  </Section>
);

const StandardLayout = (props: LayoutProps) => (
  <>
    <HeaderSection {...props} />
    <AboutSection {...props} />
    <ExperienceSectionPreview {...props} />
    <SkillsSection {...props} />
    <ProjectsSectionPreview {...props} />
    <TestimonialsSectionPreview {...props} />
  </>
);

const MinimalLayout = (props: LayoutProps) => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
            <HeaderSection {...props} />
            <AboutSection {...props} />
            <SkillsSection {...props} />
        </div>
        <div className="md:col-span-2">
            <ExperienceSectionPreview {...props} />
            <ProjectsSectionPreview {...props} />
            <TestimonialsSectionPreview {...props} />
        </div>
    </div>
);

const CreativeLayout = (props: LayoutProps) => (
  <div className="flex flex-col md:flex-row gap-12">
      <aside className="md:w-1/3 md:sticky top-8 self-start">
        <HeaderSection {...props} />
        <AboutSection {...props} />
        <SkillsSection {...props} />
      </aside>
      <main className="md:w-2/3">
        <ExperienceSectionPreview {...props} />
        <ProjectsSectionPreview {...props} />
        <TestimonialsSectionPreview {...props} />
      </main>
  </div>
);

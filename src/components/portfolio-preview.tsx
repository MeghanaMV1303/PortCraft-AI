'use client';

import type { Project, Skill } from '@/lib/types';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Link2 } from 'lucide-react';

interface PortfolioPreviewProps {
  name: string;
  headline: string;
  aboutMe: string;
  projects: Project[];
  skills: Skill[];
}

export function PortfolioPreview({ name, headline, aboutMe, projects, skills }: PortfolioPreviewProps) {
  return (
    <ScrollArea className="h-full w-full">
      <div className="p-6 md:p-8 bg-background">
        <header className="flex items-center space-x-4 mb-8">
          <Avatar className="h-20 w-20">
            <AvatarImage src={`https://api.dicebear.com/8.x/initials/svg?seed=${name}`} alt={name} />
            <AvatarFallback>{name.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-3xl font-bold font-headline text-primary">{name}</h1>
            <p className="text-xl text-muted-foreground">{headline}</p>
          </div>
        </header>

        <section id="about" className="mb-12">
          <h2 className="text-2xl font-semibold font-headline border-b pb-2 mb-4">About Me</h2>
          <p className="text-foreground/80 leading-relaxed whitespace-pre-wrap">{aboutMe}</p>
        </section>

        <section id="skills" className="mb-12">
          <h2 className="text-2xl font-semibold font-headline border-b pb-2 mb-4">Skills</h2>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill) => (
              <Badge key={skill.id} variant="secondary" className="text-sm px-3 py-1">
                {skill.name}
              </Badge>
            ))}
          </div>
        </section>

        <section id="projects">
          <h2 className="text-2xl font-semibold font-headline border-b pb-2 mb-4">Projects</h2>
          <div className="space-y-8">
            {projects.map((project) => (
              <Card key={project.id} className="overflow-hidden">
                {project.imageUrl && (
                  <Image
                    src={project.imageUrl}
                    alt={project.title}
                    width={600}
                    height={400}
                    className="w-full object-cover"
                    data-ai-hint="technology project"
                  />
                )}
                <CardHeader>
                  <CardTitle>{project.title}</CardTitle>
                  <CardDescription className="flex items-center gap-2 pt-1">
                    {project.link && (
                      <a
                        href={project.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-accent hover:underline"
                      >
                        <Link2 className="h-4 w-4" />
                        View Project
                      </a>
                    )}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">{project.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {project.techStack.split(',').map((tech, index) => (
                      <Badge key={index} variant="outline">
                        {tech.trim()}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </ScrollArea>
  );
}

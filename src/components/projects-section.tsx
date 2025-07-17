'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { Project } from '@/lib/types';
import { generateProjectDescription } from '@/ai/flows/generate-project-description';
import { generateProjectImage } from '@/ai/flows/generate-project-image';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { PlusCircle, Trash2, Edit, Loader2, Sparkles, Link2, Image as ImageIcon } from 'lucide-react';
import Image from 'next/image';
import { Badge } from './ui/badge';

const projectSchema = z.object({
  title: z.string().min(1, 'Title is required.'),
  techStack: z.string().min(1, 'Tech stack is required.'),
  description: z.string().min(10, 'Description must be at least 10 characters.'),
  link: z.string().url('Please enter a valid URL.').optional().or(z.literal('')),
});

interface ProjectsSectionProps {
  projects: Project[];
  setProjects: (projects: Project[]) => void;
}

export function ProjectsSection({ projects, setProjects }: ProjectsSectionProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  const addProject = (project: Omit<Project, 'id'>) => {
    setProjects([...projects, { ...project, id: new Date().toISOString() }]);
  };

  const updateProject = (updatedProject: Project) => {
    setProjects(projects.map((p) => (p.id === updatedProject.id ? updatedProject : p)));
  };

  const deleteProject = (id: string) => {
    setProjects(projects.filter((p) => p.id !== id));
  };

  const openEditDialog = (project: Project) => {
    setEditingProject(project);
    setIsDialogOpen(true);
  };
  
  const openNewDialog = () => {
    setEditingProject(null);
    setIsDialogOpen(true);
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Projects</CardTitle>
          <CardDescription>Showcase your best work. Use AI to generate images and descriptions.</CardDescription>
        </div>
        <Button onClick={openNewDialog}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Project
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {projects.length > 0 ? (
          projects.map((project) => (
            <Card key={project.id} className="flex flex-col sm:flex-row items-start gap-4 p-4">
               <Image
                  src={project.imageUrl || "https://placehold.co/600x400.png"}
                  alt={project.title}
                  width={150}
                  height={100}
                  className="rounded-md object-cover w-full sm:w-[150px]"
                  data-ai-hint="technology project"
                />
              <div className="flex-1">
                <h3 className="font-semibold">{project.title}</h3>
                <p className="text-sm text-muted-foreground mt-1 mb-2">{project.description}</p>
                <div className="flex flex-wrap gap-1 mb-2">
                    {project.techStack.split(',').map(t => <Badge key={t} variant="secondary">{t.trim()}</Badge>)}
                </div>
                 {project.link && (
                      <a
                        href={project.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm flex items-center gap-1 text-accent hover:underline"
                      >
                        <Link2 className="h-3 w-3" />
                        View Project
                      </a>
                    )}
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="icon" onClick={() => openEditDialog(project)}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={() => deleteProject(project.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </Card>
          ))
        ) : (
          <p className="text-muted-foreground text-center">No projects added yet.</p>
        )}
      </CardContent>
      <ProjectDialog
        isOpen={isDialogOpen}
        setIsOpen={setIsDialogOpen}
        addProject={addProject}
        updateProject={updateProject}
        editingProject={editingProject}
      />
    </Card>
  );
}

function ProjectDialog({
  isOpen,
  setIsOpen,
  addProject,
  updateProject,
  editingProject,
}: {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  addProject: (project: Omit<Project, 'id'>) => void;
  updateProject: (project: Project) => void;
  editingProject: Project | null;
}) {
  const [isGeneratingDesc, setIsGeneratingDesc] = useState(false);
  const [isGeneratingImg, setIsGeneratingImg] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof projectSchema>>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      title: '',
      techStack: '',
      description: '',
      link: '',
    },
  });

  useState(() => {
    if (editingProject) {
      form.reset(editingProject);
    } else {
      form.reset({ title: '', techStack: '', description: '', link: '' });
    }
  }, [editingProject, form]);

  const handleGenerateDescription = async () => {
    const { title, techStack } = form.getValues();
    if (!title || !techStack) {
      toast({
        variant: 'destructive',
        title: 'Title and Tech Stack needed',
        description: 'Please provide a title and tech stack to generate a description.',
      });
      return;
    }

    setIsGeneratingDesc(true);
    try {
      const result = await generateProjectDescription({ title, techStack });
      if (result && result.description) {
        form.setValue('description', result.description);
        toast({ title: 'Description generated successfully!' });
      }
    } catch (error) {
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to generate description.' });
    } finally {
      setIsGeneratingDesc(false);
    }
  };

  const handleGenerateImage = async () => {
      if (!editingProject) return;
      const { title, description } = form.getValues();
      if (!title || !description) {
          toast({ variant: 'destructive', title: 'Info needed', description: 'Please provide a title and description to generate an image.' });
          return;
      }
      setIsGeneratingImg(true);
      try {
          const result = await generateProjectImage({ title, description });
          if (result && result.imageUrl) {
              updateProject({ ...editingProject, ...form.getValues(), imageUrl: result.imageUrl });
              toast({ title: 'Image generated and saved!' });
          }
      } catch (error) {
          toast({ variant: 'destructive', title: 'Error', description: 'Failed to generate image.' });
      } finally {
          setIsGeneratingImg(false);
      }
  };


  const onSubmit = (values: z.infer<typeof projectSchema>) => {
    if (editingProject) {
      updateProject({ ...editingProject, ...values });
      toast({ title: 'Project updated!' });
    } else {
      addProject({ ...values, imageUrl: 'https://placehold.co/600x400.png' });
      toast({ title: 'Project added!' });
    }
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>{editingProject ? 'Edit Project' : 'Add Project'}</DialogTitle>
          <DialogDescription>
            Fill in the details of your project. Use the AI generator for a quick description or a new image.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project Title</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. My Awesome App" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="techStack"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tech Stack</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. React, Next.js, TypeScript" {...field} />
                  </FormControl>
                  <FormDescription>Comma-separated list of technologies.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea rows={4} placeholder="Describe your project..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex gap-2">
                <Button type="button" variant="outline" size="sm" onClick={handleGenerateDescription} disabled={isGeneratingDesc}>
                    {isGeneratingDesc ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                    Generate Description
                </Button>
                {editingProject && (
                    <Button type="button" variant="outline" size="sm" onClick={handleGenerateImage} disabled={isGeneratingImg}>
                        {isGeneratingImg ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ImageIcon className="mr-2 h-4 w-4" />}
                        Generate Image
                    </Button>
                )}
            </div>
            <FormField
              control={form.control}
              name="link"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project Link</FormLabel>
                  <FormControl>
                    <Input placeholder="https://github.com/user/repo" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="button" variant="ghost" onClick={() => setIsOpen(false)}>Cancel</Button>
              <Button type="submit">Save Project</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

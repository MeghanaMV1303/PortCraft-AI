'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { Experience } from '@/lib/types';
import { generateExperienceDescription } from '@/ai/flows/generate-experience-description';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { PlusCircle, Trash2, Edit, Loader2, Sparkles } from 'lucide-react';
import { Badge } from './ui/badge';

const experienceSchema = z.object({
  role: z.string().min(1, 'Role is required.'),
  company: z.string().min(1, 'Company is required.'),
  period: z.string().min(1, 'Period is required.'),
  description: z.string().min(10, 'Description must be at least 10 characters.'),
});

const aiSchema = z.object({
    tasks: z.string().min(10, 'Please provide a summary of your tasks.')
});

interface ExperienceSectionProps {
  experiences: Experience[];
  setExperiences: (experiences: Experience[]) => void;
}

export function ExperienceSection({ experiences, setExperiences }: ExperienceSectionProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingExperience, setEditingExperience] = useState<Experience | null>(null);

  const addExperience = (experience: Omit<Experience, 'id'>) => {
    setExperiences([...experiences, { ...experience, id: new Date().toISOString() }]);
  };

  const updateExperience = (updatedExperience: Experience) => {
    setExperiences(experiences.map((p) => (p.id === updatedExperience.id ? updatedExperience : p)));
  };

  const deleteExperience = (id: string) => {
    setExperiences(experiences.filter((p) => p.id !== id));
  };

  const openEditDialog = (experience: Experience) => {
    setEditingExperience(experience);
    setIsDialogOpen(true);
  };
  
  const openNewDialog = () => {
    setEditingExperience(null);
    setIsDialogOpen(true);
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Experience</CardTitle>
          <CardDescription>Detail your professional history.</CardDescription>
        </div>
        <Button onClick={openNewDialog}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Experience
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {experiences.length > 0 ? (
          experiences.map((exp) => (
            <Card key={exp.id} className="p-4">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="font-semibold">{exp.role}</h3>
                  <p className="text-sm text-muted-foreground">{exp.company} | {exp.period}</p>
                  <p className="text-sm mt-2">{exp.description}</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="icon" onClick={() => openEditDialog(exp)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={() => deleteExperience(exp.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))
        ) : (
          <p className="text-muted-foreground text-center">No experience added yet.</p>
        )}
      </CardContent>
      <ExperienceDialog
        isOpen={isDialogOpen}
        setIsOpen={setIsDialogOpen}
        addExperience={addExperience}
        updateExperience={updateExperience}
        editingExperience={editingExperience}
      />
    </Card>
  );
}

function ExperienceDialog({
  isOpen,
  setIsOpen,
  addExperience,
  updateExperience,
  editingExperience,
}: {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  addExperience: (experience: Omit<Experience, 'id'>) => void;
  updateExperience: (experience: Experience) => void;
  editingExperience: Experience | null;
}) {
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof experienceSchema>>({
    resolver: zodResolver(experienceSchema),
    defaultValues: { role: '', company: '', period: '', description: '' },
  });

  const aiForm = useForm<z.infer<typeof aiSchema>>({
      resolver: zodResolver(aiSchema),
      defaultValues: { tasks: '' },
  });

  useState(() => {
    if (editingExperience) {
      form.reset(editingExperience);
    } else {
      form.reset({ role: '', company: '', period: '', description: '' });
    }
  }, [editingExperience, form]);

  const handleGenerateDescription = async (values: z.infer<typeof aiSchema>) => {
    const { role, company } = form.getValues();
    if (!role || !company) {
      toast({
        variant: 'destructive',
        title: 'Role and Company needed',
        description: 'Please provide a role and company to generate a description.',
      });
      return;
    }

    setIsGenerating(true);
    try {
      const result = await generateExperienceDescription({ role, company, tasks: values.tasks });
      if (result && result.description) {
        form.setValue('description', result.description);
        toast({ title: 'Description generated successfully!' });
      }
    } catch (error) {
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to generate description.' });
    } finally {
      setIsGenerating(false);
    }
  };

  const onSubmit = (values: z.infer<typeof experienceSchema>) => {
    if (editingExperience) {
      updateExperience({ ...editingExperience, ...values });
      toast({ title: 'Experience updated!' });
    } else {
      addExperience(values);
      toast({ title: 'Experience added!' });
    }
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>{editingExperience ? 'Edit Experience' : 'Add Experience'}</DialogTitle>
          <DialogDescription>
            Fill in the details of your professional experience.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField control={form.control} name="role" render={({ field }) => (
                <FormItem>
                  <FormLabel>Role / Title</FormLabel>
                  <FormControl><Input placeholder="e.g. Software Engineer" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
            )} />
            <FormField control={form.control} name="company" render={({ field }) => (
                <FormItem>
                  <FormLabel>Company</FormLabel>
                  <FormControl><Input placeholder="e.g. Tech Solutions Inc." {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
            )} />
            <FormField control={form.control} name="period" render={({ field }) => (
                <FormItem>
                  <FormLabel>Period</FormLabel>
                  <FormControl><Input placeholder="e.g. 2020 - Present" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
            )} />
            <FormField control={form.control} name="description" render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl><Textarea rows={4} placeholder="Describe your responsibilities and achievements..." {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
            )} />

            <DialogFooter>
              <Button type="button" variant="ghost" onClick={() => setIsOpen(false)}>Cancel</Button>
              <Button type="submit">Save Experience</Button>
            </DialogFooter>
          </form>
        </Form>
        <hr className="my-4" />
        <Form {...aiForm}>
            <form onSubmit={aiForm.handleSubmit(handleGenerateDescription)} className="space-y-4">
                <FormField control={aiForm.control} name="tasks" render={({ field }) => (
                    <FormItem>
                        <FormLabel className="text-base">Generate Description with AI</FormLabel>
                        <FormControl>
                            <Textarea placeholder="Briefly describe your main tasks and responsibilities..." {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )} />
                <Button type="submit" variant="outline" size="sm" disabled={isGenerating}>
                    {isGenerating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                    Generate with AI
                </Button>
            </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

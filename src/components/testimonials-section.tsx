'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { Testimonial } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { PlusCircle, Trash2, Edit } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';


const testimonialSchema = z.object({
  name: z.string().min(1, 'Name is required.'),
  role: z.string().min(1, 'Role is required.'),
  text: z.string().min(10, 'Testimonial text must be at least 10 characters.'),
  avatarUrl: z.string().url('Please enter a valid URL.').optional().or(z.literal('')),
});

interface TestimonialsSectionProps {
  testimonials: Testimonial[];
  setTestimonials: (testimonials: Testimonial[]) => void;
}

export function TestimonialsSection({ testimonials, setTestimonials }: TestimonialsSectionProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);

  const addTestimonial = (testimonial: Omit<Testimonial, 'id'>) => {
    const avatarUrl = testimonial.avatarUrl || `https://api.dicebear.com/8.x/initials/svg?seed=${testimonial.name}`;
    setTestimonials([...testimonials, { ...testimonial, id: new Date().toISOString(), avatarUrl }]);
  };

  const updateTestimonial = (updatedTestimonial: Testimonial) => {
    setTestimonials(testimonials.map((t) => (t.id === updatedTestimonial.id ? updatedTestimonial : t)));
  };

  const deleteTestimonial = (id: string) => {
    setTestimonials(testimonials.filter((t) => t.id !== id));
  };

  const openEditDialog = (testimonial: Testimonial) => {
    setEditingTestimonial(testimonial);
    setIsDialogOpen(true);
  };
  
  const openNewDialog = () => {
    setEditingTestimonial(null);
    setIsDialogOpen(true);
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Testimonials</CardTitle>
          <CardDescription>Add quotes from colleagues or clients.</CardDescription>
        </div>
        <Button onClick={openNewDialog}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Testimonial
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {testimonials.length > 0 ? (
          testimonials.map((t) => (
            <Card key={t.id} className="p-4 flex items-start gap-4">
              <Avatar>
                <AvatarImage src={t.avatarUrl} alt={t.name} />
                <AvatarFallback>{t.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h3 className="font-semibold">{t.name} <span className="text-sm text-muted-foreground font-normal">- {t.role}</span></h3>
                <p className="text-sm mt-1 italic">"{t.text}"</p>
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="icon" onClick={() => openEditDialog(t)}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={() => deleteTestimonial(t.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </Card>
          ))
        ) : (
          <p className="text-muted-foreground text-center">No testimonials added yet.</p>
        )}
      </CardContent>
      <TestimonialDialog
        isOpen={isDialogOpen}
        setIsOpen={setIsDialogOpen}
        addTestimonial={addTestimonial}
        updateTestimonial={updateTestimonial}
        editingTestimonial={editingTestimonial}
      />
    </Card>
  );
}

function TestimonialDialog({
  isOpen,
  setIsOpen,
  addTestimonial,
  updateTestimonial,
  editingTestimonial,
}: {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  addTestimonial: (testimonial: Omit<Testimonial, 'id'>) => void;
  updateTestimonial: (testimonial: Testimonial) => void;
  editingTestimonial: Testimonial | null;
}) {
  const { toast } = useToast();

  const form = useForm<z.infer<typeof testimonialSchema>>({
    resolver: zodResolver(testimonialSchema),
    defaultValues: { name: '', role: '', text: '', avatarUrl: '' },
  });

  useState(() => {
    if (editingTestimonial) {
      form.reset(editingTestimonial);
    } else {
      form.reset({ name: '', role: '', text: '', avatarUrl: '' });
    }
  }, [editingTestimonial, form]);

  const onSubmit = (values: z.infer<typeof testimonialSchema>) => {
    if (editingTestimonial) {
      updateTestimonial({ ...editingTestimonial, ...values });
      toast({ title: 'Testimonial updated!' });
    } else {
      addTestimonial(values);
      toast({ title: 'Testimonial added!' });
    }
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>{editingTestimonial ? 'Edit Testimonial' : 'Add Testimonial'}</DialogTitle>
          <DialogDescription>
            Fill in the details for the testimonial.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField control={form.control} name="name" render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl><Input placeholder="e.g. Jane Doe" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
            )} />
            <FormField control={form.control} name="role" render={({ field }) => (
                <FormItem>
                  <FormLabel>Role / Company</FormLabel>
                  <FormControl><Input placeholder="e.g. Project Manager at Acme Inc." {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
            )} />
             <FormField control={form.control} name="text" render={({ field }) => (
                <FormItem>
                  <FormLabel>Testimonial</FormLabel>
                  <FormControl><Textarea rows={4} placeholder="Enter the testimonial text..." {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
            )} />
            <FormField control={form.control} name="avatarUrl" render={({ field }) => (
                <FormItem>
                  <FormLabel>Avatar Image URL</FormLabel>
                  <FormControl><Input placeholder="https://..." {...field} /></FormControl>
                  <FormDescription>Optional. If left blank, an initial-based avatar will be used.</FormDescription>
                  <FormMessage />
                </FormItem>
            )} />
            <DialogFooter>
              <Button type="button" variant="ghost" onClick={() => setIsOpen(false)}>Cancel</Button>
              <Button type="submit">Save Testimonial</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

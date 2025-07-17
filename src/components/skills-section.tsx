'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { Skill } from '@/lib/types';
import { suggestSkillTags } from '@/ai/flows/suggest-skill-tags';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Sparkles, X, Plus } from 'lucide-react';

const skillsSchema = z.object({
  skillInput: z.string().min(2, 'Please enter a skill.'),
});

interface SkillsSectionProps {
  skills: Skill[];
  setSkills: (skills: Skill[]) => void;
}

export function SkillsSection({ skills, setSkills }: SkillsSectionProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [suggestedSkills, setSuggestedSkills] = useState<string[]>([]);
  const { toast } = useToast();

  const form = useForm({
    resolver: zodResolver(skillsSchema),
    defaultValues: { skillInput: '' },
  });

  const addSkill = (skillName: string) => {
    const trimmedName = skillName.trim();
    if (trimmedName && !skills.some(s => s.name.toLowerCase() === trimmedName.toLowerCase())) {
      const newSkill: Skill = { id: new Date().toISOString(), name: trimmedName };
      setSkills([...skills, newSkill]);
      return true;
    }
    return false;
  };

  const removeSkill = (id: string) => {
    setSkills(skills.filter((s) => s.id !== id));
  };

  const onAddSkillSubmit = (values: z.infer<typeof skillsSchema>) => {
    if (addSkill(values.skillInput)) {
      form.reset({ skillInput: '' });
      setSuggestedSkills(suggestedSkills.filter(s => s.toLowerCase() !== values.skillInput.toLowerCase()));
    } else {
        toast({ variant: 'destructive', title: 'Skill already exists.' });
    }
  };

  const handleGenerateSkills = async () => {
    const currentSkills = skills.map(s => s.name).join(', ');
    if (!currentSkills) {
      toast({ variant: 'destructive', title: 'Add some skills first!', description: 'Please add at least one skill to get suggestions.' });
      return;
    }
    setIsLoading(true);
    try {
      const result = await suggestSkillTags({ skills: currentSkills });
      const newSuggestions = result.skillTags.filter(suggestion => !skills.some(s => s.name.toLowerCase() === suggestion.toLowerCase()));
      setSuggestedSkills(newSuggestions);
      toast({ title: 'Suggestions Ready!', description: 'Click on a suggestion to add it to your skills.' });
    } catch (error) {
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to generate skill suggestions.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Skills</CardTitle>
        <CardDescription>List your technical skills. Get suggestions from our AI.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="text-sm font-medium mb-2">Your Skills</h3>
          <div className="p-4 border rounded-lg min-h-[80px] flex flex-wrap gap-2">
            {skills.length > 0 ? (
              skills.map((skill) => (
                <Badge key={skill.id} className="text-base">
                  {skill.name}
                  <button onClick={() => removeSkill(skill.id)} className="ml-2 rounded-full hover:bg-destructive/80 p-0.5">
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">Add some skills to get started.</p>
            )}
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onAddSkillSubmit)} className="flex items-start gap-2">
            <FormField
              control={form.control}
              name="skillInput"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel className="sr-only">Add Skill</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Python" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" aria-label="Add Skill"><Plus className="h-4 w-4" /></Button>
          </form>
        </Form>
        
        <div className="space-y-4">
            <Button type="button" variant="outline" onClick={handleGenerateSkills} disabled={isLoading}>
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Sparkles className="mr-2 h-4 w-4" />
              )}
              Suggest Skills with AI
            </Button>

            {suggestedSkills.length > 0 && (
                <div>
                    <h3 className="text-sm font-medium mb-2">Suggestions</h3>
                    <div className="flex flex-wrap gap-2">
                        {suggestedSkills.map((skill) => (
                        <Badge key={skill} variant="secondary" className="cursor-pointer hover:bg-accent hover:text-accent-foreground" onClick={() => onAddSkillSubmit({skillInput: skill})}>
                           <Plus className="h-3 w-3 mr-1" /> {skill}
                        </Badge>
                        ))}
                    </div>
                </div>
            )}
        </div>
      </CardContent>
    </Card>
  );
}

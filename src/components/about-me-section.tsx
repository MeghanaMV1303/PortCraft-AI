'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { generateAboutMe } from '@/ai/flows/generate-about-me';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Sparkles } from 'lucide-react';
import { Label } from '@/components/ui/label';

const aboutMeSchema = z.object({
  resumeText: z.string().min(50, 'Please provide more details from your resume.'),
});

interface AboutMeSectionProps {
  aboutMe: string;
  setAboutMe: (value: string) => void;
  name: string;
  setName: (value: string) => void;
  headline: string;
  setHeadline: (value: string) => void;
}

export function AboutMeSection({ aboutMe, setAboutMe, name, setName, headline, setHeadline }: AboutMeSectionProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof aboutMeSchema>>({
    resolver: zodResolver(aboutMeSchema),
    defaultValues: {
      resumeText: '',
    },
  });

  const handleGenerateAboutMe = async (values: z.infer<typeof aboutMeSchema>) => {
    setIsLoading(true);
    try {
      const result = await generateAboutMe({ resumeText: values.resumeText });
      if (result && result.aboutMe) {
        setAboutMe(result.aboutMe);
        toast({
          title: 'Success!',
          description: 'Your new "About Me" section has been generated.',
        });
      }
    } catch (error) {
      console.error('Error generating about me:', error);
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description: 'There was a problem with your request. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Personal Information</CardTitle>
        <CardDescription>Update your personal details and generate an "About Me" section using AI.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Your Name</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Jane Doe" />
          </div>
          <div className="space-y-2">
            <Label>Headline</Label>
            <Input value={headline} onChange={(e) => setHeadline(e.target.value)} placeholder="e.g. Senior Software Engineer" />
          </div>
        </div>

        <div className="space-y-2">
          <Label>About Me</Label>
          <Textarea
            value={aboutMe}
            onChange={(e) => setAboutMe(e.target.value)}
            placeholder="Tell us a little about yourself..."
            rows={4}
          />
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleGenerateAboutMe)} className="space-y-4">
            <FormField
              control={form.control}
              name="resumeText"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base">Generate with AI</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Paste your resume, LinkedIn profile, or a brief description of your experience here..."
                      rows={6}
                    />
                  </FormControl>
                  <FormDescription>
                    Provide some context and let our AI create a compelling "About Me" section for you.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Sparkles className="mr-2 h-4 w-4" />
              )}
              Generate "About Me"
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

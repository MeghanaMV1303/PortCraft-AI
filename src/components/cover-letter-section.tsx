'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { generateCoverLetter } from '@/ai/flows/generate-cover-letter';
import type { PortfolioData } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Sparkles, Clipboard } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const coverLetterSchema = z.object({
  jobDescription: z.string().min(50, 'Please paste a complete job description.'),
});

interface CoverLetterSectionProps {
  portfolioData: PortfolioData;
}

export function CoverLetterSection({ portfolioData }: CoverLetterSectionProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [generatedLetter, setGeneratedLetter] = useState('');
  const { toast } = useToast();

  const form = useForm<z.infer<typeof coverLetterSchema>>({
    resolver: zodResolver(coverLetterSchema),
    defaultValues: {
      jobDescription: '',
    },
  });

  const handleGenerateLetter = async (values: z.infer<typeof coverLetterSchema>) => {
    setIsLoading(true);
    setGeneratedLetter('');
    try {
      const input = {
        jobDescription: values.jobDescription,
        portfolioData: {
          name: portfolioData.name,
          aboutMe: portfolioData.aboutMe,
          skills: portfolioData.skills.map(s => s.name),
          experience: portfolioData.experiences.map(e => ({ role: e.role, company: e.company, description: e.description })),
          projects: portfolioData.projects.map(p => ({ title: p.title, description: p.description })),
        }
      };
      const result = await generateCoverLetter(input);
      if (result && result.coverLetter) {
        setGeneratedLetter(result.coverLetter);
        toast({
          title: 'Success!',
          description: 'Your new cover letter has been generated.',
        });
      }
    } catch (error) {
      console.error('Error generating cover letter:', error);
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description: 'There was a problem with your request. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(generatedLetter);
    toast({ title: 'Copied to clipboard!' });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>AI Cover Letter Generator</CardTitle>
        <CardDescription>
          Generate a tailored cover letter for a specific job application based on your portfolio data.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
                <AccordionTrigger>How does this work?</AccordionTrigger>
                <AccordionContent>
                This tool uses the information you've already entered in your portfolio (like your "About Me" section, skills, and experience) and combines it with the job description you provide. The AI analyzes both to write a cover letter that highlights your most relevant qualifications for the role.
                </AccordionContent>
            </AccordionItem>
        </Accordion>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleGenerateLetter)} className="space-y-6 mt-6">
            <FormField
              control={form.control}
              name="jobDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base">Job Description</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Paste the full job description here..."
                      rows={8}
                    />
                  </FormControl>
                  <FormDescription>
                    Provide the job description for the role you're applying for.
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
              Generate Cover Letter
            </Button>
          </form>
        </Form>
        {generatedLetter && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2">Generated Cover Letter</h3>
            <div className="relative">
                <Textarea
                    readOnly
                    value={generatedLetter}
                    rows={15}
                    className="bg-muted"
                />
                <Button 
                    variant="ghost" 
                    size="icon" 
                    className="absolute top-2 right-2"
                    onClick={handleCopyToClipboard}
                >
                    <Clipboard className="h-4 w-4" />
                </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

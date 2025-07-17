'use server';

/**
 * @fileOverview Generates project descriptions based on project title and tech stack.
 *
 * - generateProjectDescription - A function that generates project descriptions.
 * - GenerateProjectDescriptionInput - The input type for the generateProjectDescription function.
 * - GenerateProjectDescriptionOutput - The return type for the generateProjectDescription function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateProjectDescriptionInputSchema = z.object({
  title: z.string().describe('The title of the project.'),
  techStack: z.string().describe('The tech stack used in the project (e.g., React, Node.js, Python).'),
});
export type GenerateProjectDescriptionInput = z.infer<typeof GenerateProjectDescriptionInputSchema>;

const GenerateProjectDescriptionOutputSchema = z.object({
  description: z.string().describe('A detailed description of the project, up to 60 words.'),
});
export type GenerateProjectDescriptionOutput = z.infer<typeof GenerateProjectDescriptionOutputSchema>;

export async function generateProjectDescription(
  input: GenerateProjectDescriptionInput
): Promise<GenerateProjectDescriptionOutput> {
  return generateProjectDescriptionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateProjectDescriptionPrompt',
  input: {schema: GenerateProjectDescriptionInputSchema},
  output: {schema: GenerateProjectDescriptionOutputSchema},
  prompt: `You are a career coach who is an expert at writing project descriptions for software developer portfolios.

  Based on the project title and tech stack provided, generate a detailed description of the project in no more than 60 words.

  Project Title: {{{title}}}
  Tech Stack: {{{techStack}}}
  `,
});

const generateProjectDescriptionFlow = ai.defineFlow(
  {
    name: 'generateProjectDescriptionFlow',
    inputSchema: GenerateProjectDescriptionInputSchema,
    outputSchema: GenerateProjectDescriptionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

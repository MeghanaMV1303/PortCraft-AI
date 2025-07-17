'use server';

/**
 * @fileOverview Generates job descriptions for portfolio experience sections.
 *
 * - generateExperienceDescription - A function that generates job descriptions.
 * - GenerateExperienceDescriptionInput - The input type for the function.
 * - GenerateExperienceDescriptionOutput - The return type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GenerateExperienceDescriptionInputSchema = z.object({
  role: z.string().describe('The job title or role.'),
  company: z.string().describe('The name of the company.'),
  tasks: z.string().describe('A brief summary of tasks and responsibilities.'),
});
export type GenerateExperienceDescriptionInput = z.infer<typeof GenerateExperienceDescriptionInputSchema>;

const GenerateExperienceDescriptionOutputSchema = z.object({
  description: z.string().describe('A detailed job description, up to 60 words.'),
});
export type GenerateExperienceDescriptionOutput = z.infer<typeof GenerateExperienceDescriptionOutputSchema>;

export async function generateExperienceDescription(
  input: GenerateExperienceDescriptionInput
): Promise<GenerateExperienceDescriptionOutput> {
  return generateExperienceDescriptionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateExperienceDescriptionPrompt',
  input: { schema: GenerateExperienceDescriptionInputSchema },
  output: { schema: GenerateExperienceDescriptionOutputSchema },
  prompt: `You are a career coach who is an expert at writing job descriptions for software developer portfolios.

  Based on the role, company, and summary of tasks provided, generate a detailed and professional job description of no more than 60 words.

  Role: {{{role}}}
  Company: {{{company}}}
  Tasks: {{{tasks}}}
  `,
});

const generateExperienceDescriptionFlow = ai.defineFlow(
  {
    name: 'generateExperienceDescriptionFlow',
    inputSchema: GenerateExperienceDescriptionInputSchema,
    outputSchema: GenerateExperienceDescriptionOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);

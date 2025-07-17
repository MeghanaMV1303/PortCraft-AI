'use server';

/**
 * @fileOverview Generates a cover letter based on user's portfolio and a job description.
 *
 * - generateCoverLetter - A function that generates the cover letter.
 * - GenerateCoverLetterInput - The input type for the function.
 * - GenerateCoverLetterOutput - The return type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GenerateCoverLetterInputSchema = z.object({
  jobDescription: z.string().describe('The job description to tailor the cover letter to.'),
  portfolioData: z.object({
    name: z.string(),
    aboutMe: z.string(),
    skills: z.array(z.string()),
    experience: z.array(
      z.object({
        role: z.string(),
        company: z.string(),
        description: z.string(),
      })
    ),
    projects: z.array(
      z.object({
        title: z.string(),
        description: z.string(),
      })
    ),
  }).describe('The user\'s portfolio data.'),
});
export type GenerateCoverLetterInput = z.infer<typeof GenerateCoverLetterInputSchema>;

const GenerateCoverLetterOutputSchema = z.object({
  coverLetter: z.string().describe('The generated cover letter text.'),
});
export type GenerateCoverLetterOutput = z.infer<typeof GenerateCoverLetterOutputSchema>;

export async function generateCoverLetter(
  input: GenerateCoverLetterInput
): Promise<GenerateCoverLetterOutput> {
  return generateCoverLetterFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateCoverLetterPrompt',
  input: { schema: GenerateCoverLetterInputSchema },
  output: { schema: GenerateCoverLetterOutputSchema },
  prompt: `You are a professional career coach and expert cover letter writer for software developers. Your task is to generate a compelling and professional cover letter.

  The user's name is: {{{portfolioData.name}}}

  Here is the user's "About Me" section:
  "{{{portfolioData.aboutMe}}}"

  Here are the user's skills:
  {{#each portfolioData.skills}}
  - {{{this}}}
  {{/each}}

  Here is the user's work experience:
  {{#each portfolioData.experience}}
  - Role: {{{role}}} at {{{company}}}. Description: {{{description}}}
  {{/each}}
  
  Here are some of the user's projects:
  {{#each portfolioData.projects}}
  - Project: {{{title}}}. Description: {{{description}}}
  {{/each}}

  Now, carefully analyze the following job description and write a cover letter that highlights the most relevant skills and experiences from the user's portfolio. The tone should be professional but enthusiastic. Keep the cover letter concise and impactful, around 3-4 paragraphs.

  Job Description:
  "{{{jobDescription}}}"
  
  Generate only the cover letter text.
  `,
});


const generateCoverLetterFlow = ai.defineFlow(
  {
    name: 'generateCoverLetterFlow',
    inputSchema: GenerateCoverLetterInputSchema,
    outputSchema: GenerateCoverLetterOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);

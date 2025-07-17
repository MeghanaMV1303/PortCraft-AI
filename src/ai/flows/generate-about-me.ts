'use server';

/**
 * @fileOverview A flow for generating an 'About Me' section for a user's portfolio.
 *
 * - generateAboutMe - A function that handles the generation of the 'About Me' section.
 * - GenerateAboutMeInput - The input type for the generateAboutMe function.
 * - GenerateAboutMeOutput - The return type for the generateAboutMe function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateAboutMeInputSchema = z.object({
  resumeText: z
    .string()
    .describe('The resume text or LinkedIn profile link of the user.'),
});
export type GenerateAboutMeInput = z.infer<typeof GenerateAboutMeInputSchema>;

const GenerateAboutMeOutputSchema = z.object({
  aboutMe: z.string().describe('The generated About Me section.'),
});
export type GenerateAboutMeOutput = z.infer<typeof GenerateAboutMeOutputSchema>;

export async function generateAboutMe(input: GenerateAboutMeInput): Promise<GenerateAboutMeOutput> {
  return generateAboutMeFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateAboutMePrompt',
  input: {schema: GenerateAboutMeInputSchema},
  output: {schema: GenerateAboutMeOutputSchema},
  prompt: `You are a career coach. Based on this resume text, generate a creative 3-line "About Me" section. Resume text: {{{resumeText}}}`,
});

const generateAboutMeFlow = ai.defineFlow(
  {
    name: 'generateAboutMeFlow',
    inputSchema: GenerateAboutMeInputSchema,
    outputSchema: GenerateAboutMeOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

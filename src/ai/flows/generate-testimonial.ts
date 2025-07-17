'use server';

/**
 * @fileOverview Generates a professional testimonial based on key traits.
 *
 * - generateTestimonial - A function that handles testimonial generation.
 * - GenerateTestimonialInput - The input type for the function.
 * - GenerateTestimonialOutput - The return type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GenerateTestimonialInputSchema = z.object({
  name: z.string().describe('The name of the person giving the testimonial.'),
  role: z.string().describe('The role or title of the person.'),
  traits: z.string().describe('A few keywords or traits about the subject of the testimonial (e.g., "great team player, expert in React").'),
});
export type GenerateTestimonialInput = z.infer<typeof GenerateTestimonialInputSchema>;

const GenerateTestimonialOutputSchema = z.object({
  testimonialText: z.string().describe('The full, professionally written testimonial text, around 2-3 sentences.'),
});
export type GenerateTestimonialOutput = z.infer<typeof GenerateTestimonialOutputSchema>;

export async function generateTestimonial(
  input: GenerateTestimonialInput
): Promise<GenerateTestimonialOutput> {
  return generateTestimonialFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateTestimonialPrompt',
  input: { schema: GenerateTestimonialInputSchema },
  output: { schema: GenerateTestimonialOutputSchema },
  prompt: `You are a professional writer who specializes in crafting compelling testimonials for developer portfolios.

  Based on the name, role, and key traits provided, write a professional and enthusiastic testimonial of about 2-3 sentences. The testimonial should sound authentic and highlight the person's positive qualities.

  Name of reviewer: {{{name}}}
  Role of reviewer: {{{role}}}
  Key Traits: {{{traits}}}

  Generate only the testimonial text.
  `,
});

const generateTestimonialFlow = ai.defineFlow(
  {
    name: 'generateTestimonialFlow',
    inputSchema: GenerateTestimonialInputSchema,
    outputSchema: GenerateTestimonialOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);

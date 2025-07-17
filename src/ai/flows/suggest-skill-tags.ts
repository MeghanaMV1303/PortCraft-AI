// src/ai/flows/suggest-skill-tags.ts
'use server';

/**
 * @fileOverview AI-powered skill tag suggestion and categorization.
 *
 * - suggestSkillTags - A function that suggests and categorizes skill tags based on user input.
 * - SuggestSkillTagsInput - The input type for the suggestSkillTags function.
 * - SuggestSkillTagsOutput - The return type for the suggestSkillTags function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestSkillTagsInputSchema = z.object({
  skills: z
    .string()
    .describe('A comma-separated list of skills entered by the user.'),
});
export type SuggestSkillTagsInput = z.infer<typeof SuggestSkillTagsInputSchema>;

const SuggestSkillTagsOutputSchema = z.object({
  skillTags: z
    .array(z.string())
    .describe('A categorized list of skill tags based on the user input.'),
});
export type SuggestSkillTagsOutput = z.infer<typeof SuggestSkillTagsOutputSchema>;

export async function suggestSkillTags(input: SuggestSkillTagsInput): Promise<SuggestSkillTagsOutput> {
  return suggestSkillTagsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestSkillTagsPrompt',
  input: {schema: SuggestSkillTagsInputSchema},
  output: {schema: SuggestSkillTagsOutputSchema},
  prompt: `You are a career coach specializing in helping software developers create professional portfolios.

  Based on the following list of skills, suggest a categorized list of skill tags.

  Skills: {{{skills}}}

  Provide the skill tags as a JSON array of strings.
  For example:
  [\'JavaScript\', \'React\', \'Node.js\', \'MongoDB\']`,
});

const suggestSkillTagsFlow = ai.defineFlow(
  {
    name: 'suggestSkillTagsFlow',
    inputSchema: SuggestSkillTagsInputSchema,
    outputSchema: SuggestSkillTagsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

'use server';

/**
 * @fileOverview Evaluates a user's portfolio and provides feedback.
 *
 * - evaluatePortfolio - A function that evaluates the portfolio.
 * - EvaluatePortfolioInput - The input type for the function.
 * - EvaluatePortfolioOutput - The return type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const EvaluatePortfolioInputSchema = z.object({
  portfolioData: z.object({
    name: z.string(),
    headline: z.string(),
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
export type EvaluatePortfolioInput = z.infer<typeof EvaluatePortfolioInputSchema>;

const EvaluatePortfolioOutputSchema = z.object({
    score: z.number().describe('An overall score for the portfolio out of 100.'),
    strengths: z.string().describe('A summary of the portfolio\'s strong points, in a single paragraph.'),
    suggestions: z.array(z.string()).describe('A list of actionable suggestions for improvement.'),
});
export type EvaluatePortfolioOutput = z.infer<typeof EvaluatePortfolioOutputSchema>;

export async function evaluatePortfolio(
  input: EvaluatePortfolioInput
): Promise<EvaluatePortfolioOutput> {
  return evaluatePortfolioFlow(input);
}

const prompt = ai.definePrompt({
  name: 'evaluatePortfolioPrompt',
  input: { schema: EvaluatePortfolioInputSchema },
  output: { schema: EvaluatePortfolioOutputSchema },
  prompt: `You are an expert career coach and hiring manager for a top tech company. Your task is to evaluate a software developer's portfolio based on the provided data.

  Provide an overall score out of 100. A score of 85 or higher is excellent and job-ready.
  Provide a summary of the portfolio's strengths.
  Provide a list of 3-5 concrete, actionable suggestions for improvement. Focus on clarity, impact, and what a recruiter wants to see.

  Here is the portfolio data:

  Name: {{{portfolioData.name}}}
  Headline: {{{portfolioData.headline}}}

  About Me:
  "{{{portfolioData.aboutMe}}}"

  Skills:
  {{#each portfolioData.skills}}
  - {{{this}}}
  {{/each}}

  Experience:
  {{#each portfolioData.experience}}
  - Role: {{{role}}} at {{{company}}}. Description: {{{description}}}
  {{/each}}
  
  Projects:
  {{#each portfolioData.projects}}
  - Project: {{{title}}}. Description: {{{description}}}
  {{/each}}

  Analyze the data and provide your evaluation in the specified format.
  `,
});


const evaluatePortfolioFlow = ai.defineFlow(
  {
    name: 'evaluatePortfolioFlow',
    inputSchema: EvaluatePortfolioInputSchema,
    outputSchema: EvaluatePortfolioOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);

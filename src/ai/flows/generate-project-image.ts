'use server';
/**
 * @fileOverview Generates an image for a project based on its title and description.
 *
 * - generateProjectImage - A function that handles the image generation.
 * - GenerateProjectImageInput - The input type for the function.
 * - GenerateProjectImageOutput - The return type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GenerateProjectImageInputSchema = z.object({
  title: z.string().describe('The title of the project.'),
  description: z.string().describe('A short description of the project.'),
});
export type GenerateProjectImageInput = z.infer<typeof GenerateProjectImageInputSchema>;

const GenerateProjectImageOutputSchema = z.object({
  imageUrl: z
    .string()
    .describe(
      "The generated image as a data URI. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type GenerateProjectImageOutput = z.infer<
  typeof GenerateProjectImageOutputSchema
>;

export async function generateProjectImage(
  input: GenerateProjectImageInput
): Promise<GenerateProjectImageOutput> {
  return generateProjectImageFlow(input);
}

const generateProjectImageFlow = ai.defineFlow(
  {
    name: 'generateProjectImageFlow',
    inputSchema: GenerateProjectImageInputSchema,
    outputSchema: GenerateProjectImageOutputSchema,
  },
  async ({ title, description }) => {
    const { media } = await ai.generate({
      model: 'googleai/gemini-2.0-flash-preview-image-generation',
      prompt: `Generate a visually appealing and professional image that abstractly represents a software project.
      
      Project Title: ${title}
      Project Description: ${description}

      The image should be suitable for a developer's portfolio. Think abstract, clean, modern, and tech-oriented. Avoid text. Use a cool color palette.`,
      config: {
        responseModalities: ['TEXT', 'IMAGE'],
      },
    });

    if (!media || !media.url) {
      throw new Error('Image generation failed to produce an output.');
    }

    return { imageUrl: media.url };
  }
);

import { config } from 'dotenv';
config();

import '@/ai/flows/generate-project-description.ts';
import '@/ai/flows/suggest-skill-tags.ts';
import '@/ai/flows/generate-about-me.ts';
import '@/ai/flows/generate-experience-description.ts';
import '@/ai/flows/generate-project-image.ts';
import '@/ai/flows/generate-cover-letter.ts';
import '@/ai/flows/generate-testimonial.ts';

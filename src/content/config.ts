import { defineCollection, z } from 'astro:content';

const recommendationsCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    category: z.enum(['places', 'food']),
    type: z.string(),
    location: z.string(),
    neighborhood: z.string().optional(),
    season: z.string().optional(),
    description: z.string(),
    tags: z.array(z.string()).optional(),
    rating: z.number().min(1).max(5),
    visited: z.string(),
    price_range: z.string().optional(),
  }),
});

export const collections = {
  recommendations: recommendationsCollection,
};
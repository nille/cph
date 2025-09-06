import { defineCollection, z } from 'astro:content';

const recommendationsCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    subtitle: z.string(),
    category: z.enum(['places', 'events', 'tips']),
    type: z.string(),
    location: z.string(),
    address: z.string().optional(),
    coordinates: z.object({
      lat: z.number(),
      lng: z.number(),
    }).optional(),
    neighborhood: z.string().optional(),
    season: z.string().optional(),
    images: z.array(z.string()).optional(),
    tags: z.array(z.string()).optional(),
    rating: z.number().min(1).max(5),
    visited: z.string(),
    published: z.string(),
    updated: z.string(),
    price_range: z.string().optional(),
  }),
});

export const collections = {
  recommendations: recommendationsCollection,
};
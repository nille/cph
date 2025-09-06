import { defineCollection, z } from 'astro:content';

const placesCollection = defineCollection({
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
    published: z.string(),
    updated: z.string(),
    website: z.string().url().optional(),
    instagram: z.string().optional(),
  }),
});

export const collections = {
  places: placesCollection,
};
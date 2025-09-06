import { defineCollection, z } from 'astro:content';

const placesCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    subtitle: z.string(),
    type: z.string(),
    address: z.string(),
    coordinates: z.string().optional(),
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
import { defineCollection, z } from 'astro:content';

const chatCollection = defineCollection({
  type: 'data',
  schema: z.object({
    userId: z.string(),
    messages: z.array(z.object({
      role: z.enum(['user', 'assistant']),
      content: z.string()
    }))
  })
});

export const collections = {
  'chats': chatCollection
};

import { defineCollection, z } from "astro:content"

export const collections = {
  guides: defineCollection({
    schema: z.object({
      title: z.string(),
      description: z.string(),
    }),
  }),
}

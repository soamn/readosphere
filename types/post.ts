import { z } from "zod";

const PostSchema = z.object({
  id: z.number(),
  title: z.string(),
  metaTitle: z.string(),
  metaDescription: z.string(),
  metaTags: z.string(),
  slug: z.string(),
  content: z.string(),
  category: z.object({
    name: z.string(),
    id: z.number(),
    desciption: z.string(),
  }),
  thumbnail: z.string(),
  createdAt: z.string(),
  published: z.boolean(),
});

export type Post = z.infer<typeof PostSchema>;

import { z } from "zod";

const CategorySchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string(),
});

export type Category = z.infer<typeof CategorySchema>;

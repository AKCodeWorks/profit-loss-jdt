import { z } from "zod";

const createEpisodeSchema = z.object({
  title: z.string().min(1, "Episode must have a title!"),
  url: z.string().nullish(),
});

const updateEpisodeSchema = createEpisodeSchema.extend({
  id: z.string().min(1, "Episode ID must be provided!"),
});

type CreateEpisodeSchema = typeof createEpisodeSchema;
type UpdateEpisodeSchema = typeof updateEpisodeSchema;
export {
  createEpisodeSchema,
  updateEpisodeSchema,
  type CreateEpisodeSchema,
  type UpdateEpisodeSchema,
};

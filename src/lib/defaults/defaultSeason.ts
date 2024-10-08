import type { Season } from "$lib/interfaces/Season";
import { v4 } from "uuid";
export const defaultSeason: Season = {
  name: "Season 1",
  id: v4(),
  goal: 1000,
  episodes: [],
  items: [],
};

import type { Episode } from "$lib/interfaces/Episode";
import { v4 } from "uuid";

export const defaultEpisode: Episode = {
  id: v4(),
  name: "",
  items: [],
  seasonId: "",
  url: "",
  videoTitle: "",
};

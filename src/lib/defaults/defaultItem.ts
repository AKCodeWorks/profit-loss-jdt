import type { Item } from "$lib/interfaces/Item";
import { v4 } from "uuid";

export const defaultItem: Item = {
  id: v4(),
  name: "",
  episodeId: "",
  seasonId: "",
};

import type { Item } from "$lib/interfaces/Item";
import { v4 } from "uuid";

export const defaultItem: Item = {
  id: v4(),
  name: "",
  episodeId: "",
  seasonId: "",
  cost: 0,
  estimatedSellPrice: 0,
  actualSellPrice: 0,
  timeSpentHours: 0,
  timeSpentMinutes: 0,
};

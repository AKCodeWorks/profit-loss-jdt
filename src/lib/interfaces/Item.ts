import type { Episode } from "./Episode";
import type { Season } from "./Season";

export interface Item {
  id: string;
  name: string;
  episode: Episode;
  season: Season;
  cost: number;
  estimatedSellPrice: number;
  actualSellPrice: number;
  timeSpent: number;
}

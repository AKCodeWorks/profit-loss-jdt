import type { Episode } from "./Episode";
import type { Item } from "./Item";

export interface Season {
  name: string;
  id: string;
  goal: number;
  episodes: Episode[];
  items: Item[];
}

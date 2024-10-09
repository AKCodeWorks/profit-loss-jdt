import type { Item } from "./Item";

export interface Episode {
  id: string;
  name: string;
  url?: string;
  seasonId: string;
  items: Item[];
  videoTitle?: string;
}

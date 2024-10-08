import type { Season } from "./Season";
import type { Item } from "./Item";

export interface Episode {
  id: string;
  name: string;
  url?: string;
  season: Season[];
  items: Item[];
}

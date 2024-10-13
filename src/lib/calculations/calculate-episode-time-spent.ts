import type { Episode } from "$lib/interfaces";
import { safeParseFloat } from "./";

export function calculateEpisodeTimeSpent(episode: Episode) {
  if (!episode?.items?.length) return 0;
  let total = 0;

  episode.items.forEach((item) => {
    total += safeParseFloat(item.timeSpent);
  });

  return total;
}

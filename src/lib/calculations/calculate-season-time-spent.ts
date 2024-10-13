import type { Season } from "$lib/interfaces";
import { safeParseFloat, calculateEpisodeTimeSpent } from "./";

export function calculateSeasonTimeSpent(season: Season) {
  let total = 0;

  if (!season?.episodes?.length) return 0;

  season.episodes.forEach((episode) => {
    total += safeParseFloat(calculateEpisodeTimeSpent(episode));
  });

  return total;
}

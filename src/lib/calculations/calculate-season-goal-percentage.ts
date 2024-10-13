import type { Season } from "$lib/interfaces";
import { safeParseFloat, calculateEpisodeProfitLoss } from "./";

export function calculateSeasonGoalPercentage(season: Season) {
  if (!season.goal) return 0;
  let total = 0;

  season.episodes.forEach((episode) => {
    total += safeParseFloat(
      calculateEpisodeProfitLoss(episode, "en-GB", "GBP")
    );
  });

  let percentage = (total / season.goal) * 100;

  return percentage.toFixed(1);
}

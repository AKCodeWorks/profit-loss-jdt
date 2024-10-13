import type { Season } from "$lib/interfaces";
import { safeParseFloat, calculateEpisodeProfitPerHour } from "./";

export function calculateSeasonProfitPerHour(
  season: Season,
  locale: string = "en-GB",
  currency: string = "GBP"
) {
  if (!season?.episodes?.length) return 0;
  let total = 0;

  season.episodes.forEach((episode) => {
    total += safeParseFloat(calculateEpisodeProfitPerHour(episode));
  });

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
  }).format(total / season.episodes.length);
}

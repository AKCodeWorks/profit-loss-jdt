<script lang="ts">
  import type { Season } from "$lib/interfaces";
  import { cn } from "$lib/utils";
  import {
    safeParseFloat,
    calculateSeasonTimeSpent,
    calculateSeasonTotalProfitLoss,
    calculateSeasonProfitPerHour,
  } from "$lib/calculations";
  export let selectedSeason: string;
  export let seasons: Season[];
  export let storage: any;
</script>

<div class="text-right border rounded-md p-3 shadow-sm">
  {#if selectedSeason}
    {@const season = seasons.filter((s) => s.id === selectedSeason)[0]}
    {@const seasonProfitLoss = calculateSeasonTotalProfitLoss(
      season,
      storage.config?.locale || "en-GB",
      storage.config?.currency || "GBP"
    )}
    {@const seasonHoursSpent = calculateSeasonTimeSpent(season)}
    {@const seasonProfitPerHour = calculateSeasonProfitPerHour(season)}
    <h2 class="mb-1">{season.name} Stats</h2>
    <div class="flex gap-4 items-center leading-none justify-end">
      <div class="text-right">
        <h2 class={cn("text-right")}>
          {seasonHoursSpent}
        </h2>
        <small class="font-bold text-muted-foreground">Hours Spent</small>
      </div>
      <div class="text-right">
        <h2
          class={cn(
            " text-green-500",
            safeParseFloat(seasonProfitLoss) < 0 && "text-red-500"
          )}
        >
          {seasonProfitLoss}
        </h2>
        <small class="font-bold text-muted-foreground">Profit</small>
      </div>

      <div class="text-right">
        <h2
          class={cn(
            "text-right text-green-500",
            safeParseFloat(seasonProfitLoss) < 0 && "text-red-500"
          )}
        >
          {seasonProfitPerHour || "N/A"}
        </h2>
        <small class="font-bold text-muted-foreground text-right"
          >Profit/Hour</small
        >
      </div>
    </div>
  {/if}
</div>

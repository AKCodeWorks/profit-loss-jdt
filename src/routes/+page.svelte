<script lang="ts">
  import {
    calculateSeasonGoalPercentage,
    calculateSeasonTotalProfitLoss,
    safeParseFloat,
  } from "$lib/calculations";

  import LabeledSelect from "$lib/components/custom/elements/labeled-select.svelte";
  import { Progress } from "$lib/components/ui/progress";
  import { Button } from "$lib/components/ui/button";
  import { storage } from "$lib/helpers/storage/StorageManager";
  import { cn } from "$lib/utils";
  import { onMount } from "svelte";
  import SallysAwesomeSpreadsheet from "$lib/components/custom/dashboard/sallys-awesome-spreadsheet.svelte";
  import SeasonStats from "$lib/components/custom/dashboard/season-stats.svelte";
  import { stringToCurrency } from "$lib/helpers/converter/string-to-currency";

  let seasons = storage?.seasons?.data;
  let selectedSeason: string = "";
  let selectedEpisode: string = "";

  onMount(async () => {
    if (!storage?.ready) {
      await storage?.init();
    }
    seasons = storage?.seasons?.data;
    selectedSeason = storage?.config?.defaultSeason || "";
  });

  $: {
    // this looks dumb but basically it just changes the text on the input when its cleared
    if (!selectedSeason) {
      selectedEpisode = "";
    }
    if (selectedSeason) {
      selectedEpisode = "";
    }
  }
</script>

<div class="flex items-center justify-between">
  <div class="flex items-center gap-4 mb-2">
    {#if seasons.length > 0}
      <LabeledSelect
        class="w-48"
        isNullable
        clearText="All"
        placeholder="Select a Season"
        options={seasons}
        labelKey="name"
        label="Season"
        key="id"
        bind:value={selectedSeason}
      />
    {/if}
    {#if selectedSeason && seasons.filter((s) => s.id === selectedSeason)[0]?.episodes.length > 0}
      <LabeledSelect
        class="w-48"
        isNullable
        clearText="All"
        options={seasons.filter((s) => s.id === selectedSeason)[0]?.episodes}
        labelKey="name"
        label="Episode"
        key="id"
        bind:value={selectedEpisode}
      />
    {/if}
  </div>

  {#if selectedSeason}
    <SeasonStats bind:selectedSeason {storage} bind:seasons />
  {/if}
</div>

{#if selectedSeason}
  {@const season = seasons.filter((s) => s.id === selectedSeason)[0]}
  <Progress
    class="h-2 mt-4"
    max={season.goal}
    value={safeParseFloat(
      calculateSeasonTotalProfitLoss(
        season,
        storage.config?.locale || "en-GB",
        storage.config?.currency || "GBP"
      )
    )}
  />
  <div class="flex items-center gap-4 justify-between">
    <strong>{calculateSeasonGoalPercentage(season)}% complete</strong>
    <strong
      >Goal: {stringToCurrency(
        season.goal,
        storage.config?.locale,
        storage.config?.currency
      )}</strong
    >
  </div>
{/if}
{#if seasons.length <= 0}
  <div class="flex flex-col items-center justify-center h-48">
    <h2 class="text-2xl mb-4">
      Looks like you haven't created any seasons yet.
    </h2>
    <Button href="/seasons">Manage Seasons</Button>
  </div>
{:else}
  <SallysAwesomeSpreadsheet
    bind:seasons
    bind:selectedSeason
    bind:selectedEpisode
    {storage}
  />
{/if}

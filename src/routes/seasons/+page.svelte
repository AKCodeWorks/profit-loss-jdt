<script lang="ts">
  import CreateSeasonDialog from "$lib/components/custom/dialogs/create-season-dialog.svelte";
  import Button from "$lib/components/ui/button/button.svelte";
  import { defaultSeason } from "$lib/defaults/defaultSeason";
  import { storage } from "$lib/helpers/storage/StorageManager";
  import type { Season } from "$lib/interfaces/Season";
  import { onMount } from "svelte";
  let seasons: Season[] = storage?.seasons?.data;
  onMount(async () => {
    if (!storage?.ready) {
      console.log("not ready so going to init");
      await storage?.init();
      seasons = storage?.seasons?.data;
    }
  });

  $: if (storage.seasons) {
    seasons = storage.seasons.data;
  }
</script>

{#if storage.ready && seasons.length}
  {#each seasons as season}
    {season.name}
  {/each}
  <CreateSeasonDialog
    on:seasonCreated={() => (seasons = storage.seasons.data)}
  />
{:else}
  <div class="space-y-4">
    <p>Looks like you haven't created any seasons yet!</p>
    <CreateSeasonDialog
      on:seasonCreated={() => (seasons = storage.seasons.data)}
    />
  </div>
{/if}

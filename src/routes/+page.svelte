<script lang="ts">
  import Button from "$lib/components/ui/button/button.svelte";
  import { storage } from "$lib/helpers/storage/StorageManager";
</script>

<svelte:head>
  <title>Joey Does Tech</title>
</svelte:head>

<Button on:click={async () => console.log(storage?.config)}
  >Console Log Config</Button
>

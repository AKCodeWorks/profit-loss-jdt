<script lang="ts">
  import Navigation from "$lib/components/custom/layout/navigation.svelte";
  import "../app.css";
  import { storage } from "$lib/helpers/storage/StorageManager";
  import { onMount } from "svelte";
  import { Toaster } from "svelte-sonner";

  onMount(async () => {
    if (!storage?.ready) {
      await storage?.init();
    }
  });
</script>

<svelte:head>
  <title>Joey Does Tech</title>
</svelte:head>
<Toaster richColors />
<Navigation />

<slot />

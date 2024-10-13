<script lang="ts">
  import Navigation from "$lib/components/custom/layout/navigation.svelte";
  import "../app.css";
  import { storage } from "$lib/helpers/storage/StorageManager";
  import { onMount } from "svelte";
  import { Toaster } from "svelte-sonner";
  let zoomLevel = 1;
  onMount(async () => {
    if (!storage?.ready) {
      await storage?.init();
    }
    // since tauri doesnt natively support font zooming gotta do it manually
    window.addEventListener("keydown", (e) => {
      if (e.ctrlKey || e.metaKey) {
        if (e.key === "+" || e.key === "=") {
          zoomLevel += 0.1;
          document.body.style.zoom = zoomLevel.toString();
        }
        if (e.key === "-") {
          zoomLevel -= 0.1;
          document.body.style.zoom = zoomLevel.toString();
        }
      }
    });
    // do the same thing when the user scrolls
    window.addEventListener("wheel", (e) => {
      if (e.ctrlKey) {
        if (e.deltaY > 0) {
          zoomLevel -= 0.1;
          document.body.style.zoom = zoomLevel.toString();
        } else {
          zoomLevel += 0.1;
          document.body.style.zoom = zoomLevel.toString();
        }
      }
    });
  });
</script>

<svelte:head>
  <title>Joey Does Tech</title>
</svelte:head>
<Toaster position="top-left" richColors />
<Navigation />

<slot />

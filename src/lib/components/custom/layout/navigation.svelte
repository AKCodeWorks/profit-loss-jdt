<script lang="ts">
  import * as Tabs from "$lib/components/ui/tabs";
  import { goto } from "$app/navigation";

  async function handleNavigate(href: string) {
    await goto(href);
  }
</script>

<nav
  class="flex items-center justify-between border-b pb-2 border-primary/25 mt-4 mb-6"
>
  <div class="flex items-center gap-4">
    <img src="./favicon.png" alt="Joey Does Tech Logo" class="size-14" />
    <div class="leading-none">
      <h1 class="leading-none">Profit or Loss</h1>
      <small>Joey Does Tech</small>
    </div>
  </div>
  <Tabs.Root value="/">
    <Tabs.List>
      <Tabs.Trigger on:click={async () => await handleNavigate("/")} value="/"
        >Dashboard</Tabs.Trigger
      >
      <Tabs.Trigger
        on:click={async () => await handleNavigate("/seasons")}
        value="/seasons">Seasons</Tabs.Trigger
      >
      <Tabs.Trigger
        on:click={async () => await handleNavigate("/config")}
        value="/config">Settings</Tabs.Trigger
      >
    </Tabs.List>
  </Tabs.Root>
</nav>

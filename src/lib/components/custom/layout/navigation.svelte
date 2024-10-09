<script lang="ts">
  import * as DropdownMenu from "$lib/components/ui/dropdown-menu";
  import Icon from "@iconify/svelte";
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
  <DropdownMenu.Root>
    <DropdownMenu.Trigger class=""
      ><Icon
        class="text-primary leading-none size-8 active:scale-95"
        icon="mdi:menu"
      /></DropdownMenu.Trigger
    >
    <DropdownMenu.Content>
      <DropdownMenu.Group>
        <DropdownMenu.Label>Navigation Menu</DropdownMenu.Label>
        <DropdownMenu.Separator />
        <DropdownMenu.Item href="/">Dashboard</DropdownMenu.Item>
        <DropdownMenu.Item href="/config">Global Settings</DropdownMenu.Item>
        <DropdownMenu.Item href="/seasons">Seasons</DropdownMenu.Item>
      </DropdownMenu.Group>
    </DropdownMenu.Content>
  </DropdownMenu.Root>
</nav>

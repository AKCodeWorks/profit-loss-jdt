<script lang="ts">
  import * as DropdownMenu from "$lib/components/ui/dropdown-menu";
  import Icon from "@iconify/svelte";
</script>

<nav
  class="flex items-center justify-between border-b pb-2 border-primary/25 mt-4 mb-6"
>
  <div class="flex items-center gap-4">
    <img src="./favicon.png" alt="Joey Does Tech Logo" class="size-14" />
    <h1>Profit or Loss!</h1>
  </div>
  <DropdownMenu.Root>
    <DropdownMenu.Trigger class=""
      ><Icon
        class="text-primary leading-none size-6 hover:animate-spin-slow"
        icon="mdi:settings"
      /></DropdownMenu.Trigger
    >
    <DropdownMenu.Content>
      <DropdownMenu.Group>
        <DropdownMenu.Label>Configuration</DropdownMenu.Label>
        <DropdownMenu.Separator />
        <DropdownMenu.Item href="/">Dashboard</DropdownMenu.Item>
        <DropdownMenu.Item href="/config">Global Settings</DropdownMenu.Item>
        <DropdownMenu.Item href="/seasons">Seasons</DropdownMenu.Item>
      </DropdownMenu.Group>
    </DropdownMenu.Content>
  </DropdownMenu.Root>
</nav>

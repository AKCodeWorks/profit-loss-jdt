<script lang="ts">
  import { Checkbox } from "$lib/components/ui/checkbox";
  import { Label } from "$lib/components/ui/label";

  export let checked = false;
  export let id: string;
  export let label: string = "";
  export let ariaLabel: string = id;
</script>

<div class="flex items-center space-x-2">
  <Checkbox bind:checked on:click {id} aria-labelledby={ariaLabel} />
  <Label
    id="terms-label"
    for="terms"
    class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
  >
    {label}
  </Label>
</div>

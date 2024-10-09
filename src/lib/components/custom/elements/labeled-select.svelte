<script lang="ts">
  import * as Select from "$lib/components/ui/select";
  import { Label } from "$lib/components/ui/label";
  import { createEventDispatcher, onMount } from "svelte";
  import { cn } from "$lib/utils";

  const dispatch = createEventDispatcher();
  function handleChange(event: any) {
    if (!event && !isNullable) return;
    dispatch("selectedChange", event);
    value = event;
  }

  export let options: Array<{ [key: string]: any }>;
  export let key: string;
  export let labelKey: string;
  export let label: string = "";
  export let description: string = "";
  export let placeholder: string = "";
  export let isNullable: boolean = false;
  export let value: any = null;
  export let id: string = "";
  export let error: string[] | undefined = undefined;
  export let clearText: string = "Please select an option...";
  let className: string = "";

  onMount(() => {
    if (value) {
      const selected = options?.find((o) => o[key] === value);
      if (!selected) return;
      placeholder = selected[labelKey];
    }
  });

  $: if (!value) {
    placeholder = "";
  }

  export { className as class };
</script>

<div class={cn("flex w-full flex-col gap-1.5", className)}>
  {#if label}
    <Label class="font-bold" for={id}>{label}</Label>
  {/if}
  <Select.Root onSelectedChange={(e) => handleChange(e?.value)}>
    <Select.Trigger>
      <Select.Value {placeholder} />
    </Select.Trigger>
    <Select.Content>
      {#if isNullable}
        <Select.Item value="">{clearText}</Select.Item>
      {/if}
      {#each options as option}
        <Select.Item class="h-fit min-h-5" value={option[key]}
          >{option[labelKey]}
        </Select.Item>
      {/each}
    </Select.Content>
  </Select.Root>
  {#if description}
    <p class="text-muted-foreground text-sm">{description}</p>
  {/if}
  {#if error}
    <small class="text-red-500">{error.join(", ")}</small>
  {/if}
</div>

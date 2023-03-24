<script lang="ts">
  import { currentBoardComponents } from "$lib/database";
  import { onMount } from "svelte";
  import TextComponent from "./TextComponent.svelte";
  import ImageComponent from "./ImageComponent.svelte";
  import NoteComponent from "./NoteComponent.svelte";
  import MarkdownComponent from "./MarkdownComponent.svelte";

  export let index;

  let component;
  currentBoardComponents.subscribe((components) => {
    if (components.length > index) {
      component = components[index];
    } else {
      component = null;
    }
  });

  function loadComponent() {
    if ($currentBoardComponents.length > index) {
      component = $currentBoardComponents[index];
    } else {
      component = null;
    }
  }

  onMount(() => {
    loadComponent();
  });
</script>

{#if component}
  {#if component.component.type === "text"}
    <TextComponent index={index} />
  {:else if component.component.type === "note"}
    <NoteComponent index={index} />
  {:else if component.component.type === "markdown"}
    <MarkdownComponent index={index} />
  {:else if component.component.type === "image"}
    <ImageComponent index={index} />
  {/if}
{/if}
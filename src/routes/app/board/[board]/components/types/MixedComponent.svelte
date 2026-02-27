<script lang="ts">
  import { currentBoardComponents } from "$lib/database";
  import TextComponent from "./TextComponent.svelte";
  import ImageComponent from "./ImageComponent.svelte";
  import NoteComponent from "./NoteComponent.svelte";
  import MarkdownComponent from "./MarkdownComponent.svelte";
  import ContainerComponent from "./ContainerComponent.svelte";
  import CodeBlockComponent from "./CodeBlockComponent.svelte";
  import ToDoComponent from "./ToDoComponent.svelte";

  export let index;

  let component;
  currentBoardComponents.subscribe((components) => {
    if (components.length > index) {
      component = components[index];
    } else {
      component = null;
    }
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
  {:else if component.component.type === "todo"}
    <ToDoComponent index={index} />
  {:else if component.component.type === "code_block"}
    <CodeBlockComponent index={index} />
  {:else if component.component.type === "container"}
    <ContainerComponent index={index} />
  {/if}
{/if}
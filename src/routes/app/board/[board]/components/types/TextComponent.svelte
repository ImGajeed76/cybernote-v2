<script lang="ts">
  import { writable } from "svelte/store";
  import BaseComponent from "../BaseComponent.svelte";
  import { currentBoardComponents } from "$lib/database";
  import { onMount } from "svelte";

  export let index = 0;

  let component = $currentBoardComponents[index];
  currentBoardComponents.subscribe((components) => {
    component = components[index];
  });

  let position = writable({...component.component.pos});
  let size = writable({...component.component.size});
  let text = writable(component.component.text);

  let lastPosition = {...component.component.pos};
  let lastSize = {...component.component.size};

  let isEditing = false;

  function startEditing() {
    try {
      isEditing = true;
    } catch (_) {
      return;
    }
  }

  function stopEditing() {
    try {
      isEditing = false;
      update();
    } catch (_) {
      return;
    }
  }


  currentBoardComponents.subscribe((components) => {
    component = components[index];
    if (!component || !component.component) return;
    position.set({ ...component.component.pos });
    size.set({ ...component.component.size });
    if (!isEditing) text.set(component.component.text);
  });

  function update() {
    currentBoardComponents.update((components) => {
      components[index].component.pos = {...$position};
      components[index].component.size = {...$size};
      components[index].component.text = $text;
      return components;
    });
  }

  position.subscribe(() => {
    if (JSON.stringify(lastPosition) !== JSON.stringify($position)) {
      lastPosition = {...$position};
      update();
    }
  });

  size.subscribe(() => {
    if (JSON.stringify(lastSize) !== JSON.stringify($size)) {
      lastSize = {...$size};
      update();
    }
  });
</script>

<BaseComponent componentPosition={position} componentSize={size}>
  <div contenteditable="true" class="outline-0 w-full h-full" bind:innerHTML={$text} on:focus={startEditing} on:blur={stopEditing}></div>
</BaseComponent>
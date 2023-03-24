<script lang="ts">
  import { writable } from "svelte/store";
  import BaseComponent from "../BaseComponent.svelte";
  import { currentBoardComponents } from "$lib/database";

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
  let lastText = component.component.text;

  currentBoardComponents.subscribe((components) => {
    component = components[index];
    if (!component || !component.component) return;
    position.set({ ...component.component.pos });
    size.set({ ...component.component.size });
    text.set(component.component.text);
  });

  let lastChange = Date.now();

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

  text.subscribe(() => {
    if (lastText !== $text) {
      lastText = $text;
      lastChange = Date.now();
    }

    if (Date.now() - lastChange > 5000 && lastText !== $text) {
      update();
      lastChange = Date.now();
      lastText = $text;
    }
  });
</script>

<BaseComponent componentPosition={position} componentSize={size}>
  <div contenteditable="true" class="outline-0 w-full h-full" bind:innerHTML={$text}></div>
</BaseComponent>
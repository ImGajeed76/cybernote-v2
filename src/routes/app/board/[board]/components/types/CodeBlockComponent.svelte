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
  let code = writable(component.component.code);

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
    if (!isEditing) code.set(component.component.code);
  });

  function update() {
    currentBoardComponents.update((components) => {
      components[index].component.pos = {...$position};
      components[index].component.size = {...$size};
      components[index].component.code = $code;
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


<BaseComponent componentPosition={position} componentSize={size} index={index}>
  <p class="text-2xl">Coming soon</p>
</BaseComponent>
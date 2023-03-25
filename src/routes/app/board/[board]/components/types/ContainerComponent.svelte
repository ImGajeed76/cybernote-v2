<script>
  import BaseComponent from "../BaseComponent.svelte";
  import { writable } from "svelte/store";
  import { currentBoardComponents } from "$lib/database";
  import NoteComponent from "./NoteComponent.svelte";
  import MixedComponent from "./MixedComponent.svelte";

  export let index = 0;

  let component = $currentBoardComponents[index];
  currentBoardComponents.subscribe((components) => {
    component = components[index];
  });

  let position = writable({ ...component.component.pos });
  let size = writable({ ...component.component.size });

  let lastPosition = { ...component.component.pos };
  let lastSize = { ...component.component.size };

  function update() {
    currentBoardComponents.update((components) => {
      components[index].component.pos = { ...$position };
      components[index].component.size = { ...$size };
      return components;
    });
  }

  position.subscribe(() => {
    if (JSON.stringify(lastPosition) !== JSON.stringify($position)) {
      lastPosition = { ...$position };
      update();
    }
  });

  size.subscribe(() => {
    if (JSON.stringify(lastSize) !== JSON.stringify($size)) {
      lastSize = { ...$size };
      update();
    }
  });
</script>

<BaseComponent componentPosition={position} componentSize={size} index={index}>
  <div class="w-full h-full bg-neutral rounded">
    ( Not implemented yet )
  </div>
</BaseComponent>
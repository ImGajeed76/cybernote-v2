<script>
  import { currentBoardComponents, getImage } from "$lib/database";
  import { writable } from "svelte/store";
  import BaseComponent from "../BaseComponent.svelte";
  import { onMount } from "svelte";

  export let index = 0;

  let image = writable("");
  let component = $currentBoardComponents[index];
  currentBoardComponents.subscribe((components) => {
    component = components[index];
    if (!component || !component.component) return;
    getImage(component.component.path).then((resolve) => {
      image.set(resolve);
    });
  });

  let position = writable({ ...component.component.pos });
  let size = writable({ ...component.component.size });

  let lastPosition = {...component.component.pos};
  let lastSize = {...component.component.size};

  currentBoardComponents.subscribe((components) => {
    component = components[index];
    if (!component || !component.component) return;
    position.set({ ...component.component.pos });
    size.set({ ...component.component.size });
  });

  function update() {
    currentBoardComponents.update((components) => {
      components[index].component.pos = { ...$position };
      components[index].component.size = { ...$size };
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

  onMount(() => {
    setTimeout(async () => {
      position.set({ ...component.component.pos });
      size.set({ ...component.component.size });
      image.set(await getImage(component.component.path));
    }, 100);
  });
</script>

<BaseComponent componentPosition={position} componentSize={size}>
  <img src={$image} class="w-full h-full" alt={component.component.name}
       style="width: 100%; height: 100%; object-fit: cover">
</BaseComponent>
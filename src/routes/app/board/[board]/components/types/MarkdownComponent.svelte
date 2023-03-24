<script>
  import BaseComponent from "../BaseComponent.svelte";
  import { writable } from "svelte/store";
  import { currentBoardComponents } from "$lib/database";
  import MarkdownInput from "../MarkdownInput.svelte";

  export let index = 0;

  let component = $currentBoardComponents[index];
  currentBoardComponents.subscribe((components) => {
    component = components[index];
    if (position) position.set({...component.component.pos});
    if (size) size.set({...component.component.size});
  });

  let position = writable({...component.component.pos});
  let size = writable({...component.component.size});
  let markdown = writable(component.component.markdown);

  let lastChange = Date.now();

  function update() {
    currentBoardComponents.update((components) => {
      components[index].component.pos = {...$position};
      components[index].component.size = {...$size};
      components[index].component.markdown = $markdown;
      return components;
    });
  }

  position.subscribe(() => {
    update();
  });

  size.subscribe(() => {
    update();
  });

  markdown.subscribe(() => {
    if (Date.now() - lastChange > 1000) {
      update();
      lastChange = Date.now();
    }
  });
</script>

<BaseComponent>
  <MarkdownInput/>
</BaseComponent>
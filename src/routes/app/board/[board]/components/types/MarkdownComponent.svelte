<script>
  import BaseComponent from "../BaseComponent.svelte";
  import { writable } from "svelte/store";
  import { currentBoardComponents } from "$lib/database";
  import MarkdownInput from "../MarkdownInput.svelte";

  export let index = 0;

  let component = $currentBoardComponents[index];
  currentBoardComponents.subscribe((components) => {
    component = components[index];
  });

  let position = writable({...component.component.pos});
  let size = writable({...component.component.size});
  let markdown = writable(component.component.markdown);

  let lastPosition = {...component.component.pos};
  let lastSize = {...component.component.size};
  let lastMarkdown = component.component.text;

  currentBoardComponents.subscribe((components) => {
    component = components[index];
    if (!component || !component.component) return;
    position.set({ ...component.component.pos });
    size.set({ ...component.component.size });
    markdown.set(component.component.text);
  });

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

  markdown.subscribe(() => {
    if (lastMarkdown !== $markdown) {
      lastMarkdown = $markdown;
      lastChange = Date.now();
    }

    if (Date.now() - lastChange > 5000 && lastMarkdown !== $markdown) {
      update();
      lastChange = Date.now();
      lastMarkdown = $markdown;
    }
  });
</script>

<BaseComponent>
  <MarkdownInput/>
</BaseComponent>
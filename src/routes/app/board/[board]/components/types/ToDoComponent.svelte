<script lang="ts">
  import { writable } from "svelte/store";
  import BaseComponent from "../BaseComponent.svelte";
  import { currentBoardComponents } from "$lib/database";

  export let index = 0;

  let component = $currentBoardComponents[index];
  currentBoardComponents.subscribe((components) => {
    component = components[index];
  });

  let position = writable({ ...component.component.pos });
  let size = writable({ ...component.component.size });
  let todos = writable([...component.component.todos]);
  let title = writable(component.component.title);

  let lastPosition = { ...component.component.pos };
  let lastSize = { ...component.component.size };

  let isEditing = false;

  currentBoardComponents.subscribe((components) => {
    component = components[index];
    if (!component || !component.component) return;
    position.set({ ...component.component.pos });
    size.set({ ...component.component.size });
    if (!isEditing) todos.set([...component.component.todos]);
    if (!isEditing) title.set(component.component.title);
  });

  function update() {
    currentBoardComponents.update((components) => {
      components[index].component.pos = { ...$position };
      components[index].component.size = { ...$size };
      components[index].component.todos = [...$todos];
      components[index].component.title = $title;
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

  function addTodo() {
    todos.update((t) => [...t, { title: "", description: "", finished: false }]);
    update();
  }
</script>

<style>
    .scrollable::-webkit-scrollbar {
        width: 8px;
        background-color: transparent; /* Make the background transparent */
    }

    .scrollable::-webkit-scrollbar-track {
        background-color: transparent;
        border-radius: 10px;
    }

    .scrollable::-webkit-scrollbar-thumb {
        background-color: #4B4B4B;
        border-radius: 10px;
    }
</style>

<BaseComponent componentPosition={position} componentSize={size} index={index}>
  <div class="p-4 bg-neutral shadow rounded h-full relative" style="overflow: hidden">
    <input
      class="text-2xl font-semibold mb-3 input input-sm bg-neutral"
      bind:value={$title}
      on:focus={startEditing}
      on:blur={stopEditing}
    >
    <div class="max-h-full overflow-auto pr-2 scrollable">
      <div class="space-y-2 pl-3">
        {#each $todos as todo, i}
          <div class="flex items-center space-x-2">
            <input
              type="checkbox"
              class="checkbox checkbox-primary"
              bind:checked={todo.finished}
              on:focus={startEditing}
              on:blur={stopEditing}
            >
            <input
              class="input input-sm"
              type="text"
              placeholder="Title"
              bind:value={todo.title}
              on:focus={startEditing}
              on:blur={stopEditing}
            />
            <input
              class="input input-sm"
              type="text"
              placeholder="Description"
              bind:value={todo.description}
              on:focus={startEditing}
              on:blur={stopEditing}
            />
            <button
              class="hover:bg-base-100 border-0 p-1 rounded duration-300"
              on:click={() => {
              todos.update((t) => t.filter((_, idx) => idx !== i));
              update();
            }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
                <path
                  d="M16 1.75V3h5.25a.75.75 0 0 1 0 1.5H2.75a.75.75 0 0 1 0-1.5H8V1.75C8 .784 8.784 0 9.75 0h4.5C15.216 0 16 .784 16 1.75Zm-6.5 0V3h5V1.75a.25.25 0 0 0-.25-.25h-4.5a.25.25 0 0 0-.25.25ZM4.997 6.178a.75.75 0 1 0-1.493.144L4.916 20.92a1.75 1.75 0 0 0 1.742 1.58h10.684a1.75 1.75 0 0 0 1.742-1.581l1.413-14.597a.75.75 0 0 0-1.494-.144l-1.412 14.596a.25.25 0 0 1-.249.226H6.658a.25.25 0 0 1-.249-.226L4.997 6.178Z"
                  fill="#E57373"
                ></path>
                <path
                  d="M9.206 7.501a.75.75 0 0 1 .793.705l.5 8.5A.75.75 0 1 1 9 16.794l-.5-8.5a.75.75 0 0 1 .705-.793Zm6.293.793A.75.75 0 1 0 14 8.206l-.5 8.5a.75.75 0 0 0 1.498.088l.5-8.5Z"
                  fill="#E57373"
                ></path>
              </svg>
            </button>
          </div>
        {/each}
      </div>
      <button class="btn btn-sm btn-primary mt-3 absolute bottom-4 ml-3" on:click={addTodo}>
        Add Todo
      </button>
    </div>
  </div>
</BaseComponent>
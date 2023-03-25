<script>
  import { currentDBUser, uploadFile } from "$lib/database";
  import { page } from "$app/stores";
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";
  import { writable } from "svelte/store";

  let currentBoard = writable(null);

  currentDBUser.update((user) => {
    if (user) {
      const boardUUID = $page.params.board;
      currentBoard.set(user.boards.find((board) => board.uuid === boardUUID));
    }
  });

  let currentSetting = "";
  let settings = [];

  let saveModal;

  function updateSettings() {
    currentSetting = $page.params.setting;
    settings = [{
      title: "General",
      path: "general"
    }];
  }

  function updateBoard() {
    if ($currentDBUser) {
      const boardUUID = $page.params.board;
      currentBoard.set($currentDBUser.boards.find((board) => board.uuid === boardUUID));
    }
  }

  onMount(() => {
    updateSettings();

    setTimeout(() => {
      updateBoard();
    }, 100);

    if (!settings.find((setting) => setting.path === currentSetting)) {
      openSetting("general");
    }
  });

  async function openSetting(path) {
    const currentPath = window.location.pathname;
    const newPath = currentPath.replace(currentSetting, path);
    await goto(newPath);
    updateSettings();
    updateBoard();
  }

  function saveCurrentBoard() {
    currentDBUser.update((user) => {
      if (!user) return user;
      if (!user.boards) return user;
      const boardIndex = user.boards.findIndex((board) => board.uuid === $currentBoard.uuid);
      user.boards[boardIndex] = $currentBoard;
      return user;
    });

    saveModal.click();
  }

  let imageFileInput;

  async function saveGeneralCustomizationSettings() {
    const imageFile = imageFileInput.files[0];
    const newName = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    const { data, error } = await uploadFile(imageFile, "files", newName);
    if (error) return console.log(error);
    $currentBoard.background = data.path;
    saveCurrentBoard();
  }

  let confirmTitle = "";
  let deleteError = "";
  async function deleteBoard() {
    if (!$currentBoard) return;
    if (confirmTitle !== $currentBoard.title) return deleteError = "wrong title";
    deleteError = "";

    currentDBUser.update((user) => {
      if (!user) {
        deleteError = "an error occurred";
        return user;
      }
      if (!user.boards) {
        deleteError = "an error occurred";
        return user;
      }
      const boardIndex = user.boards.findIndex((board) => board.uuid === $currentBoard.uuid);
      user.boards.splice(boardIndex, 1);
      return user;
    });

    if (deleteError) return;
    await goto("/app");
  }
</script>

<style>
    .scrollable {
        overflow-y: auto;
        height: calc(100% - 4rem); /* Adjust the height to occupy the remaining space */
        padding-right: 4px; /* Add padding to the right of the scrollbar */
    }

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


<div class="grid grid-cols-6 h-screen pt-16">
  <div class="bg-neutral w-full" style="overflow: hidden">
    <div class="border border-base-100 h-16 flex items-center pl-5">
      <p class="text-2xl">Settings</p>
    </div>
    <div class="border border-base-100 h-full pt-5">
      <div class="w-full">
        {#each settings as setting}
          <div class="p-1">
            <button on:click={() => {openSetting(setting.path)}}
                    class="hover:text-white w-full rounded duration-300 {setting.path === currentSetting ? 'bg-base-100 text-white' : 'text-white/50'}">{setting.title}</button>
          </div>
        {/each}
      </div>
    </div>
  </div>

  {#if $currentBoard}
    <div class="bg-neutral w-full col-span-5" style="overflow: hidden">
      <div class="border border-base-100 h-16 flex items-center pl-5">
        <h1 class="text-2xl">{settings.find((setting) => setting.path === currentSetting)?.title}
          - {$currentBoard.title}</h1>
      </div>

      <div class="p-2 border border-base-100 h-full">
        <div class="scrollable">
          {#if currentSetting === "general"}
            <div class="w-full grid grid-cols-6 pt-10">
              <div class="col-start-2 col-span-4">
                <p class="text-2xl mb-5">Board</p>
                <div class="card w-full bg-base-100 shadow-xl">
                  <div class="card-body">
                    <div class="grid grid-cols-2">
                      <div>
                        <p>General Setting</p>
                      </div>

                      <div>
                        <div class="form-control">
                          <p class="mb-1">Board Title:</p>
                          <input class="input bg-neutral/50" bind:value={$currentBoard.title} placeholder="title">
                        </div>

                        <div class="form-control mt-5">
                          <p class="mb-1">Board Description:</p>
                          <input class="input bg-neutral/50" bind:value={$currentBoard.description} placeholder="description">
                        </div>
                      </div>
                    </div>

                    <div class="divider"></div>

                    <div class="card-actions justify-end">
                      <button class="btn btn-primary btn-sm w-24" on:click={saveCurrentBoard}>Save</button>
                    </div>
                  </div>
                </div>
              </div>

              <div class="col-start-2 col-span-4 mt-10">
                <p class="text-2xl mb-5">Customization</p>
                <div class="card w-full bg-base-100 shadow-xl">
                  <div class="card-body">
                    <div class="grid grid-cols-2">
                      <div>
                        <p>Configuration</p>
                      </div>

                      <div>
                        <div class="form-control">
                          <p class="mb-1">Board Preview:</p>
                          <input type="file" class="file-input file-input-ghost bg-neutral/50" bind:this={imageFileInput}>
                        </div>
                      </div>
                    </div>

                    <div class="divider"></div>

                    <div class="card-actions justify-end">
                      <button class="btn btn-primary btn-sm w-24" on:click={saveGeneralCustomizationSettings}>Save</button>
                    </div>
                  </div>
                </div>

                <div class="col-start-2 col-span-4 mt-10">
                  <p class="text-2xl mb-5">Delete Board</p>
                  <div class="card w-full bg-base-100 shadow-xl">
                    <div class="card-body">
                      <label for="delete-modal" class="btn btn-error btn-outline">Delete</label>
                    </div>
                  </div>
                </div>

                <div class="mt-10"></div>
              </div>
            </div>
          {/if}
        </div>
      </div>
    </div>
  {:else}
    <div class="w-full col-span-5 grid items-center">
      <div class="w-full flex flex-col">
        <button class="btn btn-ghost loading"></button>
        <button class="hover:underline w-fit m-auto" on:click={() => {window.location.reload()}}>refresh page</button>
      </div>
    </div>
  {/if}
</div>

<label for="save-modal" class="fixed" bind:this={saveModal}></label>
<input type="checkbox" id="save-modal" class="modal-toggle" />
<div class="modal">
  <div class="modal-box">
    <h3 class="font-bold text-lg">Congrats!</h3>
    <p>You have updated you board settings!</p>
    <div class="modal-action">
      <label for="save-modal" class="btn">Ok</label>
    </div>
  </div>
</div>

<input type="checkbox" id="delete-modal" class="modal-toggle" />
<div class="modal">
  <div class="modal-box">
    <h3 class="font-bold text-lg">Board Deletion</h3>
    <p class="text-error">To delete your board please enter the name of you board: <span class="badge badge-error">{$currentBoard?.title}</span></p>
    <div class="form-control mt-2">
      <input class="input input-error" placeholder="board title" bind:value={confirmTitle}>
    </div>
    <div class="modal-action justify-between items-center">
      <label for="delete-modal" class="btn">Cancel</label>
      <p class="text-error">{deleteError}</p>
      <button class="btn btn-error btn-outline" on:click={deleteBoard}>Delete</button>
    </div>
  </div>
</div>
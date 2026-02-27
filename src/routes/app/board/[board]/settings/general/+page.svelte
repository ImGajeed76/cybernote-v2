<script>
  import { writable } from "svelte/store";
  import { currentDBUser, uploadFile } from "$lib/database";
  import { page } from "$app/stores";
  import { goto } from "$app/navigation";

  let currentBoard = writable(null);
  currentDBUser.subscribe((user) => {
    const board = $page.params.board;
    if (user && user.boards) {
      currentBoard.set(user.boards.find((b) => b.uuid === board));
    }
  });

  let imageUpload;
  let loading = "";

  async function saveBoard() {
    if (imageUpload && imageUpload.files[0]) {
      loading = "loading";
      const newName = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      const { data, error } = await uploadFile(imageUpload.files[0], "files", newName);
      if (error) return console.log(error);
      $currentBoard.background = data.path;
      imageUpload.value = "";
    } else {
      loading = "loading";
      currentDBUser.update((user) => {
        if (user.boards.length === 0) return user;
        if (!$currentBoard) return user;
        const index = user.boards.findIndex((b) => b.uuid === $currentBoard.uuid);
        user.boards[index] = { ...$currentBoard };
        return user;
      });
      loading = "";
    }
  }

  currentBoard.subscribe((board) => {
    if (!board) return;
    const checkedBoard = JSON.stringify(board);

    setTimeout(() => {
      if (!board) return;
      if (JSON.stringify(board) !== checkedBoard) return;
      saveBoard();
    }, 2000);
  });

  function gotoSetting(setting) {
    goto(`/app/board/${$currentBoard.uuid}/settings/${setting}`);
  }


  let confirmName = "";
  let deleteError = "";

  function deleteBoard() {
    if (confirmName !== $currentBoard.title) {
      deleteError = "Board name does not match";
      return;
    }

    currentDBUser.update((user) => {
      user.boards = user.boards.filter((b) => b.uuid !== $currentBoard.uuid);
      return user;
    });

    goto("/app");
  }
</script>

<style>
    .bg-image {
        background-image: url('/images/background.jpg');
        background-size: cover;
        background-position: center;
        background-attachment: fixed;
    }
</style>



{#if $currentBoard}
  <div class="h-screen bg-image" style="overflow: hidden">
    <div class="backdrop-blur-md h-full pt-16">
      <div class="p-10 w-full h-full">
        <div class="w-full breadcrumbs">
          <ul class="text-xl">
            <li><a href="/app">Boards</a></li>
            <li><a href="/app/board/{$currentBoard.uuid}">{$currentBoard.title}</a></li>
            <li>Settings</li>
            <li>General</li>
          </ul>
        </div>

        <div class="p-10 pt-5 h-full">
          <div class="flex flex-row bg-neutral rounded-box w-full max-w-6xl m-auto h-full" style="overflow: hidden">
            <div class="p-5 h-full relative">
              <ul class="w-56 menu rounded">
                <li class="bordered"><p>General</p></li>
              </ul>

              <ul class="w-56 menu text-error absolute bottom-5">
                <li>
                  <label for="delete-modal" class="focus:bg-error focus:text-white rounded">Delete</label>
                </li>
              </ul>
            </div>
            <div class="w-full h-full bg-base-100 p-10">
              <div class="card w-full bg-neutral/50 shadow-xl">
                <div class="card-body">
                  <p class="card-title mb-2">General</p>

                  <div class="grid grid-cols-2 items-center">
                    <p class="text-lg">Board Name: </p>
                    <input class="input" placeholder="name" bind:value={$currentBoard.title}>
                  </div>

                  <div class="grid grid-cols-2 items-center">
                    <p class="text-lg">Board Description: </p>
                    <input class="input" placeholder="description" bind:value={$currentBoard.description}>
                  </div>

                  <div class="grid grid-cols-2 items-center">
                    <p class="text-lg">Board Preview: </p>
                    <input type="file" class="file-input file-input-ghost bg-base-100" bind:this={imageUpload}>
                  </div>

                  <div class="card-actions justify-end mt-2">
                    <button class="btn btn-primary btn-sm {loading}" on:click={saveBoard}>Save</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>


  <input type="checkbox" id="delete-modal" class="modal-toggle" />
  <div class="modal">
    <div class="modal-box">
      <p class="text-xl font-bold">Confirm the deletion of '<a class="font-bold text-error">{$currentBoard.title}</a>'</p>
      <p class="py-4">This will permanently delete the <a class="font-bold">{$currentBoard.title}</a> board and all of its data. </p>
      <p>Type <a class="font-bold">{$currentBoard.title}</a> to confirm:</p>
      <input class="input bg-neutral input-sm w-full mt-2" placeholder="board name" bind:value={confirmName}>
      <div class="modal-action justify-between items-center">
        <label for="delete-modal" class="btn">Close</label>
        <p class="text-error">{deleteError}</p>
        <button class="btn btn-error" on:click={deleteBoard}>Delete</button>
      </div>
    </div>
  </div>
{/if}
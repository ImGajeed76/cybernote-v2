<script lang="ts">
  import BoardPreview from "./BoardPreview.svelte";
  import { onMount } from "svelte";
  import { supabaseClient } from "$lib/database";

  let loading = true;
  let loggedIn = false;

  onMount(async () => {
    const { data, error } = await supabaseClient.auth.getSession();

    if (error) {
      console.log(error);
      loggedIn = false;
    } else loggedIn = !!data.session;

    loading = false;
  });
</script>

<style>
    .bg-image {
        background-image: url('/images/background.jpg');
        background-size: cover;
        background-position: center;
        background-attachment: fixed;
    }
</style>

<div class="min-h-screen bg-image">
  <div class="bg-opacity-80 backdrop-blur-md bg-neutral min-h-screen pt-14 pb-5">
    {#if !loading}
      {#if loggedIn}
        <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 p-10">
          <BoardPreview />
          <BoardPreview />
          <BoardPreview />
          <BoardPreview />
        </div>
        <div class="divider">
          <div class="divider-content">
            <button class="btn btn-primary">Create new board</button>
          </div>
        </div>
      {:else}
        <div class="h-[90vh] grid items-center">
          <p class="text-center text-2xl italic">Please <a href="/sign-in" class="underline">login</a></p>
        </div>
      {/if}
    {:else}
      <div class="h-[90vh] grid items-center">
        <div class="flex flex-col w-full">
          <button class="btn btn-ghost loading m-auto p-auto"></button>
          <p class="text-center">Loading...</p>
        </div>
      </div>
    {/if}
  </div>
</div>
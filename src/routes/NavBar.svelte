<script>
  import { onMount } from "svelte";
  import { supabaseClient } from "$lib/database";
  import { page } from "$app/stores";

  let user;
  let activeTab = 0;

  page.subscribe((page) => {
    if (page.url.pathname === "/") {
      activeTab = 0;
    } else if (page.url.pathname.startsWith("/app")) {
      activeTab = 1;
    }
  });

  async function updateUser() {
    const { data: sessionData, error: sessionError } = await supabaseClient.auth.getSession();

    if (sessionError) {
      console.log(sessionError);
      user = null;
    } else if (sessionData && sessionData.session) {
      user = sessionData.session.user;
    } else {
      user = null;
    }
  }

  onMount(async () => {
    if ($page.url.pathname === "/") {
      activeTab = 0;
    } else if ($page.url.pathname.startsWith("/app")) {
      activeTab = 1;
    }

    await updateUser();
  });

  async function logout() {
    const { error } = await supabaseClient.auth.signOut();
    if (error) {
      console.log(error);
    } else {
      await updateUser();
      window.location.reload();
    }
  }
</script>

<div class="navbar bg-neutral fixed h-16 shadow-2xl" style="z-index: 1">
  <div class="flex-1">
    <a class="btn btn-ghost normal-case text-xl" href="/">CyberNote</a>
    <div class="absolute w-[99vw] flex invisible md:visible">
      <div class="tabs m-auto">
        <a href="/" class="tab tab-bordered {activeTab === 0 ? 'tab-active' : ''} duration-500 outline-none">Home</a>
        <a href="/app" class="tab tab-bordered {activeTab === 1 ? 'tab-active' : ''} duration-500 outline-none">App</a>
      </div>
    </div>
  </div>
  <div class="flex-none gap-2">
    {#if user}
      <div class="dropdown dropdown-end">
        <label tabindex="0" class="btn btn-ghost btn-circle avatar">
          <div class="w-12 rounded-full">
            <img src={user.user_metadata.avatar_url || "https://source.unsplash.com/random/?cyberpunk,city"} />
          </div>
        </label>
        <ul tabindex="0"
            class="mt-3 p-2 shadow-2xl menu menu-compact dropdown-content bg-base-100 rounded-box w-52">
          <li>
            <a href="/" class="md:hidden">Home</a>
            <a href="/app" class="md:hidden">App</a>
            <button class="text-error" on:click={logout}>Logout</button>
          </li>
        </ul>
      </div>
    {:else}
      <a href="/sign-in" class="btn btn-ghost" style="z-index: 99">Sign In</a>
      <a href="/sign-up" class="btn btn-primary" style="z-index: 99">Sign Up</a>
    {/if}
  </div>
</div>
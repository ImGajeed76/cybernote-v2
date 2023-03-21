<script lang="ts">
  import { supabaseClient } from "$lib/database";
  import { goto } from "$app/navigation";

  let email = "";
  let password = "";

  let supabaseError = {
    status: "none",
    message: ""
  };

  let loading = "";

  const handleEmailSignIn = async () => {
    loading = "loading";
    const { error } = await supabaseClient.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      console.log(error);
      supabaseError = {
        status: "error",
        message: error.message
      };
      loading = "";
    } else {
      loading = "";
      await goto("/")
    }
  };

  const handleGithubSignIn = async () => {
    const { error } = await supabaseClient.auth.signInWithOAuth({
      provider: "github"
    });

    if (error) {
      console.log(error);
      supabaseError = {
        status: "error",
        message: error.message
      };
    }
  };
</script>

<style>
    @media (min-width: 768px) {
        .bg-image {
            background-image: url('/images/background.jpg');
            background-size: cover;
            background-position: center;
        }
    }
</style>

<div class="min-h-screen bg-image flex items-center justify-center">
  <div class="w-full max-w-md p-8 bg-base-100 bg-opacity-90 backdrop-blur-md rounded-xl md:shadow-md">
    <div class="mb-8">
      <h1 class="text-4xl font-bold text-primary">Welcome back</h1>
      <p>Sign in to your account</p>
    </div>

    <button
      type="button"
      class="w-full btn"
      on:click="{handleGithubSignIn}"
    >
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="20" height="20">
        <path
          d="M8 0c4.42 0 8 3.58 8 8a8.013 8.013 0 0 1-5.45 7.59c-.4.08-.55-.17-.55-.38 0-.27.01-1.13.01-2.2 0-.75-.25-1.23-.54-1.48 1.78-.2 3.65-.88 3.65-3.95 0-.88-.31-1.59-.82-2.15.08-.2.36-1.02-.08-2.12 0 0-.67-.22-2.2.82-.64-.18-1.32-.27-2-.27-.68 0-1.36.09-2 .27-1.53-1.03-2.2-.82-2.2-.82-.44 1.1-.16 1.92-.08 2.12-.51.56-.82 1.28-.82 2.15 0 3.06 1.86 3.75 3.64 3.95-.23.2-.44.55-.51 1.07-.46.21-1.61.55-2.33-.66-.15-.24-.6-.83-1.23-.82-.67.01-.27.38.01.53.34.19.73.9.82 1.13.16.45.68 1.31 2.69.94 0 .67.01 1.3.01 1.49 0 .21-.15.45-.55.38A7.995 7.995 0 0 1 0 8c0-4.42 3.58-8 8-8Z"
          style="fill: white"
        ></path>
      </svg>
      <p class="ml-2">Continue with GitHub</p>
    </button>

    <div class="divider">or</div>

    <form>
      <div class="mb-4 form-control">
        <label class="block text-xl font-medium">Email</label>
        <input
          type="email"
          class="input mt-1 bg-neutral"
          bind:value="{email}"
        />
      </div>

      <div class="mb-6 form-control">
        <div class="flex justify-between items-center">
          <label class="block text-xl font-medium">Password</label>
          <a class="text-white/40 hover:underline" href="/forgot-password">Forgot password?</a>
        </div>
        <input
          type="password"
          class="input mt-1 bg-neutral"
          bind:value="{password}"
        />
      </div>

      <input
        type="submit"
        class="w-full mb-3 btn btn-primary font-bold {loading}"
        on:click="{handleEmailSignIn}"
        value="Sign In"
      >
    </form>

    {#if supabaseError.status === "error"}
      <p class="text-center text-error">{supabaseError.message}</p>
    {/if}

    <p class="text-center text-white/40 mt-2">Don't have an account? <a class="underline text-white" href="/sign-up">Sign
      Up Now</a></p>
  </div>
</div>

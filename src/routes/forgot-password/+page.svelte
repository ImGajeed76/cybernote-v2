<script lang="ts">
  import { supabaseClient } from "../../lib/database";

  let email = '';
  let errorMessage = '';
  let message = '';

  const sendResetLink = () => {
    const {error} = supabaseClient.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`
    });

    if (error) {
      errorMessage = error.message;
      message = '';
    }
    else {
      errorMessage = '';
      message = 'Check your email for a link to reset your password!';

      email = '';
    }
  }
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
  <div class="w-fit max-w-lg p-8 bg-base-100 bg-opacity-90 backdrop-blur-md rounded-xl md:shadow-md">
    <div class="mb-6">
      <h1 class="text-4xl font-bold text-primary">Forgot your password?</h1>
      <p>No problem, we got you!</p>
    </div>

    <form class="w-full flex">
      <div class="w-full">
        <input
          type="email"
          class="input bg-neutral w-full"
          bind:value="{email}"
          placeholder="Enter your email"
        />
      </div>
      <div class="ml-2">
        <input on:click={sendResetLink} type="submit" value="send" class="btn btn-primary">
      </div>
    </form>

    <p class="text-error mt-4 text-center">{errorMessage}</p>
    <p class="text-success mt-4 text-center">{message}</p>
  </div>
</div>
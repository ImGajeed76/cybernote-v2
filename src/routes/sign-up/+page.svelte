<script lang="ts">
  import { supabaseClient } from "$lib/database";
  import { goto } from "$app/navigation";
  import { onMount } from "svelte";

  let email = "";
  let password = "";

  let loading = "";

  let strength = {
    status: "none",
    score: 0,
    currentScore: 0,
    color: "progress-error",
    inputColor: "text-white"
  };

  let emailStatus = {
    status: "none",
    color: "text-white"
  };

  let supabaseError = {
    status: "none",
    message: ""
  };

  const handleEmailSignUp = async () => {
    loading = "loading";
    if (strength.status === "ok" && emailStatus.status === "ok") {
      const { error } = await supabaseClient.auth.signUp({
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
        setTimeout(() => {
          setTimeout(() => {
            loading = "";
            goto("/sign-in")
          }, 1000);
        })
      }
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

  const isEmailValid = () => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };

  const getPasswordStrength = () => {
    if (password.length < 8) {
      return { status: "to_short", score: 0 };
    }

    const hasLowercase = /[a-z]/.test(password);
    const hasUppercase = /[A-Z]/.test(password);
    const hasDigit = /\d/.test(password);
    const hasSpecialChar = /[^a-zA-Z0-9]/.test(password);

    const strengthConditions = [hasLowercase, hasUppercase, hasDigit, hasSpecialChar];
    const strengthScore = strengthConditions.filter(Boolean).length;

    return { status: "ok", score: strengthScore };
  };

  const getStrengthColor = (score) => {
    switch (score) {
      case 0:
        return "progress-error";
      case 1:
        return "progress-warning";
      case 2:
        return "progress-warning";
      case 3:
        return "progress-success";
      case 4:
        return "progress-success";
      default:
        return "progress-error";
    }
  };

  const updateEmail = () => {
    if (email.length > 0) {
      emailStatus = isEmailValid() ? { status: "ok", color: "text-success" } : { status: "error", color: "text-error" };
    } else {
      emailStatus = { status: "none", color: "text-success" };
    }
  };

  const updatePassword = () => {
    if (password.length > 0) {
      let passwordStrength = getPasswordStrength();
      let inputColor = passwordStrength.status === "to_short" ? "text-error" : "text-success";

      strength.status = passwordStrength.status;
      strength.score = passwordStrength.score;
      strength.color = getStrengthColor(passwordStrength.score);
      strength.inputColor = inputColor;

      if (strength.score === 0) strength.score = 0.2;
    } else {
      strength = { status: "none", score: 0, color: "progress-error", inputColor: "text-white", currentScore: 0 };
    }

    updateProgress(strength.score * 10);
  };

  const updateProgress = (targetValue, duration = 200) => {
    const startTime = performance.now();
    const startValue = strength.currentScore;

    const animate = (currentTime) => {
      const elapsedTime = currentTime - startTime;
      const progress = Math.min(elapsedTime / duration, 1);

      strength.currentScore = startValue + (targetValue - startValue) * progress;

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  };

  onMount(async () => {
    const { data } = await supabaseClient.auth.getSession();

    if (data.session) {
      await goto("/app");
    }
  })
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
      <h1 class="text-4xl font-bold text-primary">Get started</h1>
      <p>Create a new account</p>
    </div>


    <form>
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

      <div class="mb-4 form-control">
        <label for="email" class="block text-xl font-medium">Email</label>
        <input
          id="email"
          type="email"
          class="input mt-1 bg-neutral {emailStatus.color}"
          bind:value="{email}"
          on:focusout="{updateEmail}"
        />
      </div>

      <div class="mb-6 form-control">
        <label for="password" class="block text-xl font-medium">Password</label>
        <input
          id="password"
          type="password"
          class="input mt-1 bg-neutral {strength.inputColor}"
          bind:value="{password}"
          on:input="{updatePassword}"
        />
        <progress class="progress mt-3 {strength.color} duration-500" value={strength.currentScore} max="40"></progress>
      </div>

      <input
        type="submit"
        class="w-full mb-3 btn btn-primary font-bold {loading}"
        on:click="{handleEmailSignUp}"
        value="Sign Up"
      >
    </form>

    {#if supabaseError.status === "error"}
      <p class="text-center text-error">{supabaseError.message}</p>
    {/if}

    <p class="text-center text-white/40 mt-2">Already have an account? <a class="underline text-white" href="/sign-in">Sign
      In Now</a></p>
  </div>
</div>

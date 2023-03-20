<script lang="ts">
  import { supabaseClient } from "../../lib/database";
  import { goto } from "$app/navigation";

  let password = "";
  let passwordConfirm = "";

  let strength = {
    status: "none",
    score: 0,
    currentScore: 0,
    color: "progress-error",
    inputColor: "text-white"
  };

  let confirmColor = "text-white";

  let message = {
    message: "",
    color: "text-white"
  }

  const resetPassword = () => {
    if (password !== passwordConfirm) return;
    if (strength.status !== "ok") return;

    const { error } = supabaseClient.auth.updateUser({ password: password });

    if (error) {
      console.log(error);
      message.message = error.message;
      message.color = "text-error";
    } else {
      message.message = "Password updated!";
      message.color = "text-success";

      setTimeout(() => {
        goto("/")
      }, 1000);
    }
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

    if (password !== passwordConfirm) {
      confirmColor = "text-error";
    } else {
      confirmColor = "text-success";
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

    <form>
      <div class="mb-3 form-control">
        <label class="block text-xl font-medium">New Password</label>
        <input
          type="password"
          class="input mt-1 bg-neutral {strength.inputColor}"
          bind:value="{password}"
          on:input="{updatePassword}"
        />
      </div>

      <div class="mb-6 form-control">
        <label class="block text-xl font-medium">Confirm</label>
        <input
          type="password"
          class="input mt-1 bg-neutral {confirmColor}"
          bind:value="{passwordConfirm}"
          on:input="{updatePassword}"
        />

        <progress class="progress mt-3 {strength.color} duration-500" value={strength.currentScore} max="40"></progress>
      </div>


      <div class="form-control">
        <input on:click={resetPassword} type="submit" value="send" class="btn btn-primary">
      </div>
    </form>

    <p class="{message.color} mt-3 text-center">{message.message}</p>
  </div>
</div>
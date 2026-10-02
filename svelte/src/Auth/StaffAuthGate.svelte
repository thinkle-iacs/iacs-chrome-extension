<script lang="ts">
  import { onMount } from "svelte";

  export let enabled = false;

  type AuthStatus = "loading" | "signed-out" | "authorized" | "denied" | "error";

  type FirebaseUser = {
    email: string | null;
    emailVerified: boolean;
    providerData: Array<{ providerId: string | null }>;
  };

  type FirebaseGoogleProvider = {
    setCustomParameters(parameters: Record<string, string>): void;
  };

  type FirebaseAuth = {
    onAuthStateChanged(callback: (user: FirebaseUser | null) => void): () => void;
    signInWithRedirect(provider: FirebaseGoogleProvider): Promise<unknown>;
    signOut(): Promise<void>;
  };

  type FirebaseNamespace = {
    apps: unknown[];
    initializeApp(config: Record<string, string>): unknown;
    auth: {
      (): FirebaseAuth;
      GoogleAuthProvider: new () => FirebaseGoogleProvider;
    };
  };

  let auth: FirebaseAuth | undefined;
  let provider: FirebaseGoogleProvider | undefined;
  let status: AuthStatus = enabled ? "loading" : "authorized";
  let signingIn = false;
  let errorMessage = "";
  let userEmail = "";
  let rejectedEmail = "";

  function isStaffUser(user: FirebaseUser): boolean {
    const email = (user.email || "").toLowerCase();
    const [localPart, domain, ...extraParts] = email.split("@");
    const usedGoogle = user.providerData.some(
      (identity) => identity.providerId === "google.com"
    );

    return (
      user.emailVerified &&
      usedGoogle &&
      extraParts.length === 0 &&
      domain === "innovationcharter.org" &&
      Boolean(localPart) &&
      !localPart.includes(".")
    );
  }

  function loadFirebaseScript(id: string, src: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const existing = document.getElementById(id) as HTMLScriptElement | null;
      if (existing) {
        if (existing.dataset.loaded === "true") resolve();
        else existing.addEventListener("load", () => resolve(), { once: true });
        return;
      }

      const script = document.createElement("script");
      script.id = id;
      script.src = src;
      script.onload = () => {
        script.dataset.loaded = "true";
        resolve();
      };
      script.onerror = () => reject(new Error(`Could not load ${src}`));
      document.head.appendChild(script);
    });
  }

  async function initializeStaffAuth() {
    try {
      await loadFirebaseScript(
        "firebase-app-sdk",
        "https://www.gstatic.com/firebasejs/12.18.0/firebase-app-compat.js"
      );
      await loadFirebaseScript(
        "firebase-auth-sdk",
        "https://www.gstatic.com/firebasejs/12.18.0/firebase-auth-compat.js"
      );

      const response = await fetch("/__/firebase/init.json");
      if (!response.ok) {
        throw new Error(`Firebase configuration returned ${response.status}`);
      }

      const firebaseConfig = await response.json();
      const firstPartyAuthHosts = [
        "iacs-staff-start-auth.web.app",
        "staff.innovationcharter.org",
      ];
      if (firstPartyAuthHosts.includes(window.location.hostname)) {
        firebaseConfig.authDomain = window.location.hostname;
      }

      const firebase = (
        window as unknown as Window & { firebase: FirebaseNamespace }
      ).firebase;
      if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
      }
      auth = firebase.auth();
      provider = new firebase.auth.GoogleAuthProvider();
      provider.setCustomParameters({
        hd: "innovationcharter.org",
        prompt: "select_account",
      });

      return auth.onAuthStateChanged(async (user) => {
        if (!user) {
          userEmail = "";
          status = rejectedEmail ? "denied" : "signed-out";
          return;
        }

        if (isStaffUser(user)) {
          rejectedEmail = "";
          userEmail = user.email || "";
          status = "authorized";
          return;
        }

        rejectedEmail = user.email || "this account";
        await auth?.signOut();
        status = "denied";
      });
    } catch (error) {
      console.error("Could not initialize staff authentication", error);
      errorMessage = "The staff sign-in service could not be reached. Please try again.";
      status = "error";
      return undefined;
    }
  }

  async function logIn() {
    if (!auth || !provider || signingIn) return;

    signingIn = true;
    rejectedEmail = "";
    errorMessage = "";
    try {
      await auth.signInWithRedirect(provider);
    } catch (error) {
      const code = (error as { code?: string }).code;
      if (code !== "auth/popup-closed-by-user") {
        console.error("Staff sign-in failed", error);
        errorMessage = "Sign-in did not complete. Please try again.";
      }
    } finally {
      signingIn = false;
    }
  }

  async function logOut() {
    if (!auth) return;
    rejectedEmail = "";
    await auth.signOut();
  }

  onMount(() => {
    if (!enabled) return;

    let unsubscribe: (() => void) | undefined;
    let disposed = false;
    initializeStaffAuth().then((cleanup) => {
      if (disposed) cleanup?.();
      else unsubscribe = cleanup;
    });

    return () => {
      disposed = true;
      unsubscribe?.();
    };
  });
</script>

{#if !enabled}
  <slot />
{:else if status === "authorized"}
  <slot />
  <button class="account" on:click={logOut} title="Sign out of the staff start page">
    Sign out{userEmail ? ` (${userEmail})` : ""}
  </button>
{:else}
  <main class="auth-shell" aria-live="polite">
    <section class="auth-card">
      <img src="./icons/IACS_logo.png" alt="Innovation Academy Charter School" />
      <h1>Staff Start Page</h1>

      {#if status === "loading"}
        <p>Checking staff access…</p>
      {:else}
        {#if status === "denied"}
          <p class="error">
            {rejectedEmail} is not recognized as an IACS staff account.
          </p>
        {:else if errorMessage}
          <p class="error">{errorMessage}</p>
        {:else}
          <p>Sign in with your IACS staff Google account to continue.</p>
        {/if}

        <button class="google-button" on:click={logIn} disabled={!auth || signingIn}>
          {signingIn ? "Signing in…" : status === "denied" ? "Try another account" : "Sign in with Google"}
        </button>
      {/if}

      <p class="help">
        Staff accounts use an <strong>@innovationcharter.org</strong> address.
      </p>
    </section>
  </main>
{/if}

<style>
  .auth-shell {
    align-items: center;
    background: linear-gradient(145deg, #071b42, #0033a0);
    box-sizing: border-box;
    display: flex;
    justify-content: center;
    min-height: 100vh;
    padding: 24px;
  }

  .auth-card {
    background: #fff;
    border-radius: 14px;
    box-shadow: 0 18px 48px #0005;
    color: #17213a;
    max-width: 430px;
    padding: 36px;
    text-align: center;
    width: 100%;
  }

  .auth-card img {
    height: auto;
    max-width: 230px;
    width: 70%;
  }

  .auth-card h1 {
    color: #0033a0;
    font-size: 2rem;
    margin: 24px 0 12px;
  }

  .auth-card p {
    line-height: 1.5;
  }

  .google-button {
    background: #0033a0;
    border: 0;
    border-radius: 6px;
    color: #fff;
    cursor: pointer;
    font: inherit;
    font-weight: 600;
    margin: 16px 0;
    padding: 12px 20px;
  }

  .google-button:hover:not(:disabled) {
    background: #002775;
  }

  .google-button:disabled {
    cursor: wait;
    opacity: 0.65;
  }

  .error {
    color: #9d1234;
  }

  .help {
    color: #586174;
    font-size: 0.86rem;
    margin-bottom: 0;
  }

  .account {
    background: #fff;
    border: 1px solid #aaa;
    border-radius: 4px;
    bottom: 8px;
    color: #333;
    cursor: pointer;
    font-size: 11px;
    opacity: 0.72;
    padding: 5px 8px;
    position: fixed;
    right: 8px;
    z-index: 10000;
  }

  .account:hover {
    opacity: 1;
  }
</style>

import { createClient } from "@supabase/supabase-js";
import { env } from "$env/dynamic/public";
import { readable, writable } from "svelte/store";
import type { Session } from "@supabase/supabase-js";

export const clientId = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

export const supabaseClient = createClient(env.PUBLIC_SUPABASE_URL, env.PUBLIC_SUPABASE_ANON_KEY,
  {
    db: {
      schema: "public"
    }
  });

export const currentSession = readable(null as Session | null, (set) => {
  supabaseClient.auth.getSession().then((response) => {
    if (response.error) {
      console.error(response.error);
    } else {
      set(response.data.session);
    }
  });

  supabaseClient.auth.onAuthStateChange(async (event, session) => {
    set(session);
  });
});

let session: null | Session = null;
currentSession.subscribe((value) => session = value);

export function uploadFile(file: File, path = "/", name?: string) {
  if (!session) return Promise.reject("Not logged in");

  const fullPath = path.startsWith(<string>session?.user.id) ? path : `${session?.user.id}/${path}`;

  return supabaseClient.storage.from("files").upload(`${fullPath}/${name || file.name}`, file, {
    cacheControl: "3600",
    upsert: false
  });
}

export function deleteFile(paths: string[]) {
  if (!session) return Promise.reject("Not logged in");

  paths = paths.map((path) => {
    if (!path.startsWith(<string>session?.user.id)) return `${session?.user.id}/${path}`;
    return path;
  });

  return supabaseClient.storage.from("files").remove(paths);
}

export function downloadFile(path: string) {
  if (!session) return Promise.reject("Not logged in");

  const fullPath = path.startsWith(<string>session?.user.id) ? path : `${session?.user.id}/${path}`;

  return supabaseClient.storage.from("files").download(`${fullPath}`);
}


const images = new Map<string, string>();

export function getImage(path: string) {
  if (!session) return Promise.reject("Not logged in");
  if (images.has(path)) return Promise.resolve(images.get(path));

  return new Promise((resolve) => {
    if (!path) return resolve("");

    downloadFile(path).then((response) => {
      if (response.error) {
        console.error(response.error);
      } else if (response.data) {
        const reader = new FileReader();
        reader.onload = () => {
          images.set(path, reader.result as string);
          resolve(reader.result);
        };
        reader.readAsDataURL(response.data);
      }
    });
  });
}


const updateBoardComponentsDebounced = debounce(updateBoardComponents, 1000);
const updateDBUserDebounced = debounce(updateDBUser, 1000);

export const currentDBUser = writable(null as any);
let lastDBUser = {};
export const currentBoard = writable(null as string | null);
let lastBoard = "";
export const currentBoardComponents = writable([] as any[]);
let lastBoardComponentsString = "";

function updateDBUser() {
  if (!session) return;

  supabaseClient
    .from("Users")
    .select("*")
    .eq("email", session.user.email)
    .single()
    .then((response) => {
      if (response.error) {
        if (!session) return;

        supabaseClient
          .from("Users")
          .insert({
            email: session.user.email
          })
          .select("*")
          .single()
          .then((response) => {
            if (response.error) {
              console.error(response.error);
            } else if (response.data) {
              currentDBUser.set(response.data);
            }
          });
      } else if (response.data) {
        currentDBUser.set(response.data);
      }
    });
}

currentSession.subscribe(() => {
  updateDBUser();
});

currentDBUser.subscribe((user) => {
  if (!user) return;
  if (JSON.stringify(user) === JSON.stringify(lastDBUser)) return;
  lastDBUser = JSON.parse(JSON.stringify(user));

  supabaseClient
    .from("Users")
    .upsert(user)
    .then((response) => {
      if (response.error) {
        console.error(response.error);
      }
    });
});

function updateBoardComponents(board: string | null) {
  if (!session) return;
  if (!board) return;

  supabaseClient
    .from("Components")
    .select("*")
    .eq("email", session.user.email)
    .eq("boardUUID", board)
    .then((response) => {
      if (response.error) {
        console.error(response.error);
      } else if (response.data) {
        if (response.data.length > 0 && response.data[0].clientId === clientId) return;
        const sorted = response.data.sort((a, b) => a.componentUUID.localeCompare(b.componentUUID));
        currentBoardComponents.set(sorted);
      }
    });
}

currentBoard.subscribe((board) => {
  if (board === lastBoard) return;
  if (board === null || board === "") currentBoardComponents.set([]);
  updateBoardComponents(board);
  lastBoard = board || "";
});

function updateLocalBoardComponents(components: any[]) {
  components.forEach((component) => {
    component.clientId = clientId;
  });

  supabaseClient
    .from("Components")
    .upsert(components)
    .then((response) => {
      if (response.error) {
        console.error(response.error);
      }
    });
}

currentBoardComponents.subscribe(async (components) => {
  if (!session) return;
  if (!components) return;

  if (JSON.stringify(components) === lastBoardComponentsString) return;
  updateLocalBoardComponents(components);
  lastBoardComponentsString = JSON.stringify(components);
});

supabaseClient
  .channel("Users")
  .on("postgres_changes", { event: "*", schema: "public" }, payload => {
    updateDBUserDebounced();
  })
  .subscribe();

supabaseClient
  .channel("Components")
  .on("postgres_changes", { event: "*", schema: "public" }, payload => {
    if (lastBoard !== "") updateBoardComponentsDebounced(lastBoard);
  })
  .subscribe();

function debounce(func: any, wait: number) {
  let timeout: any;
  return (...args: any) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      func.apply(this, args);
    }, wait);
  };
}

export function deleteDBComponent(componentUUID: string) {
  if (!session) return Promise.reject("Not logged in");

  const component = JSON.parse(lastBoardComponentsString).find((c: any) => c.componentUUID === componentUUID);
  if (component.type === "image") {
    deleteFile(component.path);
  }


  return supabaseClient
    .from("Components")
    .delete()
    .eq("email", session.user.email)
    .eq("componentUUID", componentUUID)
    .then((response) => {
      if (response.error) {
        console.error(response.error);
      } else {
        updateBoardComponents(lastBoard);
      }
    });
}


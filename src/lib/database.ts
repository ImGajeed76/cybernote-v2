import { createClient } from "@supabase/supabase-js";
import { env } from "$env/dynamic/public";
import { readable, writable } from "svelte/store";
import type { Session } from "@supabase/supabase-js";

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

export const currentDBUser = writable(null as any);
let lastDBUser = {};
export const currentBoard = writable(null as string | null);
export const currentBoardComponents = writable([] as any[]);

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
  lastDBUser = {...user};

  supabaseClient
    .from("Users")
    .upsert(user)
    .then((response) => {
      if (response.error) {
        console.error(response.error);
      }
    });
});

currentBoard.subscribe((board) => {
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
        currentBoardComponents.set(response.data);
      }
    });
});

currentBoardComponents.subscribe((components) => {
  if (!session) return;
  if (!components) return;

  supabaseClient
    .from("Components")
    .upsert(components)
    .then((response) => {
      if (response.error) {
        console.error(response.error);
      }
    });
});

supabaseClient
  .channel("any")
  .on("postgres_changes", { event: "*", schema: "public" }, payload => {
    updateDBUser();
  })
  .subscribe();

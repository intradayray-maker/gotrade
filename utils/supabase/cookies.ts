import { cookies } from "next/headers";

type CookieStore = Awaited<ReturnType<typeof cookies>>;

type CookieRecord = {
  name: string;
  value: string;
};

type CookieSetRecord = CookieRecord & {
  options?: Record<string, unknown>;
};

function parseCookieHeader(raw: string): CookieRecord[] {
  if (!raw) {
    return [];
  }

  return raw
    .split(";")
    .map((entry) => entry.trim())
    .filter(Boolean)
    .map((entry) => {
      const separatorIndex = entry.indexOf("=");
      const name =
        separatorIndex >= 0 ? entry.slice(0, separatorIndex) : entry;
      const value =
        separatorIndex >= 0 ? entry.slice(separatorIndex + 1) : "";

      return { name, value };
    });
}

export function readAllCookies(cookieStore: CookieStore): CookieRecord[] {
  try {
    const store = cookieStore as CookieStore & {
      getAll?: () => Array<{ name: string; value: string }>;
    };

    if (typeof store.getAll === "function") {
      return store.getAll().map(({ name, value }) => ({ name, value }));
    }
  } catch {
    // Fall through to raw header parsing below.
  }

  return parseCookieHeader(cookieStore.toString());
}

export function writeAllCookies(
  cookieStore: CookieStore,
  cookiesToSet: CookieSetRecord[]
) {
  const store = cookieStore as CookieStore & {
    set?: (...args: unknown[]) => unknown;
  };

  if (typeof store.set !== "function") {
    return;
  }

  for (const { name, value, options } of cookiesToSet) {
    try {
      if (options) {
        store.set(name, value, options);
      } else {
        store.set(name, value);
      }
      continue;
    } catch {
      // Some runtimes prefer the object form instead of positional args.
    }

    try {
      store.set({ name, value, ...(options ?? {}) });
    } catch {
      // Server components can read cookies even when writes are unavailable.
    }
  }
}

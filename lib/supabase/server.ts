import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

function createMockSupabaseClient() {
  const queryHandler: ProxyHandler<any> = {
    get(target, prop) {
      if (prop === "then") {
        return (resolve: any) => resolve({ data: [], error: null, count: 0 });
      }
      if (typeof prop === "string") {
        return (...args: any[]) => new Proxy({}, queryHandler);
      }
      return undefined;
    },
  };

  return {
    from: (_table: string) => new Proxy({}, queryHandler),
    auth: {
      getUser: async () => ({ data: { user: null }, error: null }),
      signInWithPassword: async () => ({
        data: { user: null, session: null },
        error: new Error("No database configured"),
      }),
      signOut: async () => ({ error: null }),
      signInWithOAuth: async () => ({ data: { url: "/student" }, error: null }),
    },
    rpc: async () => ({ data: null, error: null }),
  } as any;
}

export async function createClient() {
  const cookieStore = await cookies();
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    return createMockSupabaseClient();
  }

  return createServerClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // The `setAll` method was called from a Server Component.
          }
        },
      },
    }
  );
}


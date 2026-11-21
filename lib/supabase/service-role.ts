import { createClient as createSupabaseClient } from "@supabase/supabase-js";

function createMockServiceRoleClient() {
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
      admin: {
        getUserById: async () => ({ data: { user: null }, error: null }),
        deleteUser: async () => ({ data: null, error: null }),
      },
      getUser: async () => ({ data: { user: null }, error: null }),
      signOut: async () => ({ error: null }),
    },
    rpc: async () => ({ data: null, error: null }),
  } as any;
}

/**
 * Service-role client for background webhooks and system tasks only.
 * Bypasses Row Level Security (RLS) — do NOT use in client components or untrusted server contexts.
 */
export function createServiceRoleClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    return createMockServiceRoleClient();
  }

  return createSupabaseClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}


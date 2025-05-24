
// Mock Supabase client for static data
// This file replaces the real Supabase client with a mock implementation

export const supabase = {
  auth: {
    signInWithPassword: async () => ({ data: { user: null, session: null }, error: { message: "Mock Supabase: Auth disabled" } }),
    signOut: async () => ({ error: null }),
    getSession: async () => ({ data: { session: null }, error: null }),
    signUp: async () => ({ data: { user: null, session: null }, error: { message: "Mock Supabase: Auth disabled" } }),
    resend: async () => ({ error: null }),
    resetPasswordForEmail: async () => ({ error: null }),
    updateUser: async () => ({ error: null }),
    // Added methods
    getUser: async () => ({ data: { user: null }, error: null }),
    setSession: async () => ({ error: null }),
    onAuthStateChange: (callback) => {
      // Return an unsubscribe function
      return { 
        data: { subscription: { unsubscribe: () => {} } },
        error: null
      };
    },
    // Add OAuth method
    signInWithOAuth: async () => ({ data: { url: "#" }, error: null }),
  },
  from: () => ({
    select: () => ({
      eq: () => ({
        single: async () => ({ data: null, error: null })
      }),
      order: () => ({
        range: async () => ({ data: [], error: null })
      })
    }),
    insert: async () => ({ data: null, error: null }),
    update: async () => ({ data: null, error: null }),
    delete: async () => ({ data: null, error: null }),
  }),
  storage: {
    from: () => ({
      upload: async () => ({ data: null, error: null }),
      getPublicUrl: () => ({ data: { publicUrl: '' } }),
    })
  },
  functions: {
    invoke: async () => ({ data: null, error: null })
  }
};

// Both default and named export
export default supabase;

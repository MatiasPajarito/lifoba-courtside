import { createClient } from '@supabase/supabase-js';

// Usamos estrictamente las variables de entorno inyectadas por Vite o Vercel
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Faltan las credenciales de Supabase en las variables de entorno (.env).");
}

// Protección SSR para que Node.js no colapse al abrir la página
let wsTransport = undefined;
if (typeof window === 'undefined') {
  try {
    // eslint-disable-next-line no-eval
    wsTransport = eval('require')('ws');
  } catch {
    // noop
  }
}

export const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '', {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
  realtime: {
    transport: wsTransport,
  },
});

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-key';

// Temporary fallback for development
const isDevelopment = !supabaseUrl.includes('supabase.co') || supabaseUrl.includes('placeholder');

export const supabase = isDevelopment 
  ? null 
  : createClient(supabaseUrl, supabaseAnonKey);
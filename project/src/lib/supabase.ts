import { createClient } from '@supabase/supabase-js';
import { getSessionId } from './session';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  global: {
    headers: {
      'x-session-id': getSessionId(),
    },
  },
});

export const STORAGE_BUCKET = 'lovely-sex-day';

export const uploadImage = async (file: File, path: string): Promise<string> => {
  const fileExt = file.name.split('.').pop();
  const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
  const filePath = `${path}/${fileName}`;

  const { error } = await supabase.storage
    .from(STORAGE_BUCKET)
    .upload(filePath, file);

  if (error) {
    throw error;
  }

  const { data } = supabase.storage
    .from(STORAGE_BUCKET)
    .getPublicUrl(filePath);

  return data.publicUrl;
};

export const deleteImage = async (url: string): Promise<void> => {
  const path = url.split(`${STORAGE_BUCKET}/`)[1];
  if (!path) return;

  const { error } = await supabase.storage
    .from(STORAGE_BUCKET)
    .remove([path]);

  if (error) {
    throw error;
  }
};

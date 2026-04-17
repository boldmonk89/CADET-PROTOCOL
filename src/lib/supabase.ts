import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://pmaqjvpsxlhojhcplkee.supabase.co';
const supabaseAnonKey = 'sb_publishable_KUZ5QvbAE3pu-RK5wke3jA_6tEPFjYw';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

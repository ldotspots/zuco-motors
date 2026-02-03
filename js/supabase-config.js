// Supabase Configuration
// Replace these with your actual Supabase project credentials
const SUPABASE_URL = 'https://rvdwwffkothzwnmanbwx.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_R5eNGXAtPOX658b7LFKb6A_FIEimtEV';

// Initialize Supabase client
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

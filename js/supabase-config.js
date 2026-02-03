// Supabase Configuration
const SUPABASE_URL = 'https://rvdwwffkothzwnmanbwx.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ2ZHd3ZmZrb3RoendubWFuYnd4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAwOTA4NTEsImV4cCI6MjA4NTY2Njg1MX0.XAfGF1t4IrFv5KwM7o_vP_sIxbgGTt3WOAI-E7mnHDg';

// Initialize Supabase client (using supabaseClient to avoid conflict with CDN global)
const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

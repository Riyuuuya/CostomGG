import { createClient } from '@supabase/supabase-js';

// SupabaseプロジェクトのURLとAPIキー
const supabaseUrl = 'https://iujlirjxqyfjmmhgdmrm.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml1amxpcmp4cXlmam1taGdkbXJtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzE3NTMwMzgsImV4cCI6MjA0NzMyOTAzOH0.mpnsbNKWC3eHsPnrwBJTEmofXruF2du6qrXE-bnefRU';

export const supabase = createClient(supabaseUrl, supabaseKey);

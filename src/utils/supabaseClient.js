// src/utils/supabaseClient.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://dnxidjqyrcxsxaoqkkif.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRueGlkanF5cmN4c3hhb3Fra2lmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIxMzEyMzcsImV4cCI6MjA1NzcwNzIzN30.Yrbvuw6j_Wq_PRPqPu495iqR_C0jVbUDQxLTU5Jtn5k";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
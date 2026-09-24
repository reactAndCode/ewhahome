import { createClient } from '@supabase/supabase-js';

// Supabase 프로젝트 상수 (클라이언트 브라우저 환경변수 누락 방지 기본값)
const DEFAULT_URL = 'https://uizoxtnvqisiicvcxgty.supabase.co';
const DEFAULT_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVpem94dG52cWlzaWljdmN4Z3R5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIxMzYzNDAsImV4cCI6MjA3NzcxMjM0MH0.DAfvBKVwXkdv7UX0G25gNJG8shkdopHFuRkcvTTuGtM';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || DEFAULT_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || DEFAULT_KEY;

// Supabase 환경 항상 활성화
export const isSupabaseConfigured = true;

// Supabase 클라이언트 싱글톤 인스턴스
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  }
});

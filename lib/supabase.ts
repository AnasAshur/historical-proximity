import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Lazy singleton — only throws at runtime if env vars are missing,
// not at build time when Next.js collects route metadata.
let _supabase: SupabaseClient | null = null;

function getSupabase(): SupabaseClient {
  if (_supabase) return _supabase;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) {
    throw new Error(
      'Supabase env vars are not set. Copy .env.local.example → .env.local and fill in your project URL and anon key.'
    );
  }
  _supabase = createClient(url, key);
  return _supabase;
}

// ─── Types ────────────────────────────────────────────────────────────────────

export interface DbGameResult {
  id?: string;
  user_session_id: string;
  game_date: string;
  scores: number[];
  final_score: number;
  completed_at?: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

export async function saveGameResult(result: DbGameResult) {
  try {
    const sb = getSupabase();
    const { data, error } = await sb
      .from('game_results')
      .upsert(result, { onConflict: 'user_session_id,game_date' })
      .select()
      .single();
    if (error) console.error('saveGameResult:', error);
    return { data, error };
  } catch (e) {
    console.warn('Supabase not configured:', e);
    return { data: null, error: e };
  }
}

export async function hasPlayedToday(sessionId: string, date: string): Promise<boolean> {
  try {
    const sb = getSupabase();
    const { data } = await sb
      .from('game_results')
      .select('id')
      .eq('user_session_id', sessionId)
      .eq('game_date', date)
      .maybeSingle();
    return data !== null;
  } catch {
    return false;
  }
}

export async function getPercentile(sessionId: string, date: string): Promise<number> {
  try {
    const sb = getSupabase();
    const { data: allScores } = await sb
      .from('game_results')
      .select('final_score')
      .eq('game_date', date);

    if (!allScores || allScores.length === 0) return 100;

    const { data: myResult } = await sb
      .from('game_results')
      .select('final_score')
      .eq('user_session_id', sessionId)
      .eq('game_date', date)
      .maybeSingle();

    if (!myResult) return 50;
    const myScore = myResult.final_score;
    const worse = allScores.filter((r) => r.final_score < myScore).length;
    return Math.round((worse / allScores.length) * 100);
  } catch {
    return 50;
  }
}

export async function getStreak(sessionId: string): Promise<number> {
  try {
    const sb = getSupabase();
    const { data } = await sb
      .from('game_results')
      .select('game_date')
      .eq('user_session_id', sessionId)
      .order('game_date', { ascending: false });

    if (!data || data.length === 0) return 0;

    const dates = data.map((r: { game_date: string }) => r.game_date).sort().reverse();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    let streak = 0;

    for (let i = 0; i < dates.length; i++) {
      const expected = new Date(today);
      expected.setDate(today.getDate() - i);
      const expectedStr = expected.toISOString().split('T')[0];
      if (dates[i] === expectedStr) {
        streak++;
      } else {
        break;
      }
    }
    return streak;
  } catch {
    return 0;
  }
}

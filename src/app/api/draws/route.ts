import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { executeDraw, calculatePrizePool } from '@/lib/draw-engine';

// GET - Fetch draws
export async function GET() {
  try {
    const supabase = await createClient();
    const { data: draws, error } = await supabase
      .from('draws')
      .select('*')
      .order('draw_date', { ascending: false });

    if (error) throw error;
    return NextResponse.json(draws);
  } catch (error) {
    console.error('Fetch draws error:', error);
    return NextResponse.json({ error: 'Failed to fetch draws' }, { status: 500 });
  }
}

// POST - Run a draw (admin only)
export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check admin
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profile?.role !== 'admin') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const { draw_type = 'random', simulate = false } = await request.json();
    const adminSupabase = createAdminClient();

    // Get active subscribers count
    const { count: activeSubscribers } = await adminSupabase
      .from('subscriptions')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'active');

    // Get last draw's rollover
    const { data: lastDraw } = await adminSupabase
      .from('draws')
      .select('jackpot_rollover')
      .order('draw_date', { ascending: false })
      .limit(1)
      .single();

    const rollover = lastDraw?.jackpot_rollover || 0;

    // Calculate prize pool
    const prizePool = calculatePrizePool(
      activeSubscribers || 50, // fallback for demo
      9.99,
      rollover
    );

    // Get all users' scores
    const { data: allScores } = await adminSupabase
      .from('scores')
      .select('*')
      .order('score_date', { ascending: false });

    // Group scores by user
    const userScoresMap = new Map<string, number[]>();
    allScores?.forEach((score) => {
      const existing = userScoresMap.get(score.user_id) || [];
      if (existing.length < 5) {
        existing.push(score.score_value);
        userScoresMap.set(score.user_id, existing);
      }
    });

    // Execute draw
    const drawResult = executeDraw(
      userScoresMap,
      draw_type,
      allScores || [],
      prizePool
    );

    // Save draw
    const drawStatus = simulate ? 'simulated' : 'published';
    const { data: newDraw, error: drawError } = await adminSupabase
      .from('draws')
      .insert({
        draw_date: new Date().toISOString().split('T')[0],
        draw_type,
        status: drawStatus,
        winning_numbers: drawResult.winningNumbers,
        prize_pool_5_match: prizePool.fiveMatchPool,
        prize_pool_4_match: prizePool.fourMatchPool,
        prize_pool_3_match: prizePool.threeMatchPool,
        jackpot_rollover: drawResult.jackpotRollover,
      })
      .select()
      .single();

    if (drawError) throw drawError;

    // Save draw results for users with matches
    if (!simulate) {
      const resultsToInsert = drawResult.results
        .filter((r) => r.matchCount >= 3)
        .map((r) => ({
          draw_id: newDraw.id,
          user_id: r.userId,
          matched_numbers: r.matchedNumbers,
          match_count: r.matchCount,
          prize_amount:
            r.matchType === '5_match'
              ? drawResult.prizes.fiveMatchPrize
              : r.matchType === '4_match'
              ? drawResult.prizes.fourMatchPrize
              : drawResult.prizes.threeMatchPrize,
        }));

      if (resultsToInsert.length > 0) {
        await adminSupabase.from('draw_results').insert(resultsToInsert);

        // Create winner records
        const winnersToInsert = resultsToInsert.map((r) => ({
          draw_result_id: newDraw.id, // Will be updated with actual draw_result id
          user_id: r.user_id,
          match_type:
            r.match_count >= 5
              ? '5_match'
              : r.match_count === 4
              ? '4_match'
              : '3_match',
          prize_amount: r.prize_amount,
          verification_status: 'pending',
        }));

        await adminSupabase.from('winners').insert(winnersToInsert);
      }
    }

    return NextResponse.json({
      draw: newDraw,
      results: drawResult,
      prizePool,
    });
  } catch (error) {
    console.error('Run draw error:', error);
    return NextResponse.json({ error: 'Failed to run draw' }, { status: 500 });
  }
}

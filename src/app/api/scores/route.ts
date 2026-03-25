import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// GET - Fetch user scores
export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: scores, error } = await supabase
      .from('scores')
      .select('*')
      .eq('user_id', user.id)
      .order('score_date', { ascending: false })
      .limit(5);

    if (error) throw error;

    return NextResponse.json(scores);
  } catch (error) {
    console.error('Fetch scores error:', error);
    return NextResponse.json({ error: 'Failed to fetch scores' }, { status: 500 });
  }
}

// POST - Add a new score (auto-removes oldest if > 5)
export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check subscription
    const { data: subscription } = await supabase
      .from('subscriptions')
      .select('status')
      .eq('user_id', user.id)
      .eq('status', 'active')
      .single();

    if (!subscription) {
      return NextResponse.json(
        { error: 'Active subscription required' },
        { status: 403 }
      );
    }

    const { score_value, score_date } = await request.json();

    // Validate score
    if (!score_value || score_value < 1 || score_value > 45) {
      return NextResponse.json(
        { error: 'Score must be between 1 and 45' },
        { status: 400 }
      );
    }

    if (!score_date) {
      return NextResponse.json(
        { error: 'Score date is required' },
        { status: 400 }
      );
    }

    // Get current scores count
    const { data: existingScores } = await supabase
      .from('scores')
      .select('id, score_date')
      .eq('user_id', user.id)
      .order('score_date', { ascending: true });

    // If 5 scores exist, remove the oldest
    if (existingScores && existingScores.length >= 5) {
      const oldestId = existingScores[0].id;
      await supabase.from('scores').delete().eq('id', oldestId);
    }

    // Insert new score
    const { data: newScore, error } = await supabase
      .from('scores')
      .insert({
        user_id: user.id,
        score_value,
        score_date,
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(newScore, { status: 201 });
  } catch (error) {
    console.error('Add score error:', error);
    return NextResponse.json({ error: 'Failed to add score' }, { status: 500 });
  }
}

// DELETE - Delete a score
export async function DELETE(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await request.json();

    const { error } = await supabase
      .from('scores')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete score error:', error);
    return NextResponse.json({ error: 'Failed to delete score' }, { status: 500 });
  }
}

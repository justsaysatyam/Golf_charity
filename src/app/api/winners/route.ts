import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';

// GET - Fetch winners
export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    // Admin gets all, user gets own
    const adminSupabase = createAdminClient();
    let query = adminSupabase.from('winners').select('*').order('created_at', { ascending: false });

    if (profile?.role !== 'admin') {
      query = query.eq('user_id', user.id);
    }

    const { data, error } = await query;
    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    console.error('Fetch winners error:', error);
    return NextResponse.json({ error: 'Failed to fetch winners' }, { status: 500 });
  }
}

// PUT - Update winner verification (admin only)
export async function PUT(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profile?.role !== 'admin') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const { id, verification_status } = await request.json();
    const adminSupabase = createAdminClient();

    const { data, error } = await adminSupabase
      .from('winners')
      .update({ verification_status })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json(data);
  } catch (error) {
    console.error('Update winner error:', error);
    return NextResponse.json({ error: 'Failed to update winner' }, { status: 500 });
  }
}

// POST - Upload winner proof
export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { winner_id, proof_url, notes } = await request.json();

    const { data, error } = await supabase
      .from('winner_proofs')
      .insert({
        winner_id,
        proof_url,
        notes,
      })
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('Upload proof error:', error);
    return NextResponse.json({ error: 'Failed to upload proof' }, { status: 500 });
  }
}

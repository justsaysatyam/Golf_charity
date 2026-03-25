import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';

// GET - Fetch charities
export async function GET() {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('charities')
      .select('*')
      .order('name');

    if (error) throw error;
    return NextResponse.json(data);
  } catch (error) {
    console.error('Fetch charities error:', error);
    return NextResponse.json({ error: 'Failed to fetch charities' }, { status: 500 });
  }
}

// POST - Create charity (admin only)
export async function POST(request: Request) {
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

    const body = await request.json();
    const adminSupabase = createAdminClient();

    const { data, error } = await adminSupabase
      .from('charities')
      .insert({
        name: body.name,
        description: body.description,
        image: body.image || null,
        website: body.website || null,
        featured: body.featured || false,
      })
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('Create charity error:', error);
    return NextResponse.json({ error: 'Failed to create charity' }, { status: 500 });
  }
}

// PUT - Update charity (admin only)
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

    const body = await request.json();
    const adminSupabase = createAdminClient();

    const { data, error } = await adminSupabase
      .from('charities')
      .update({
        name: body.name,
        description: body.description,
        image: body.image,
        website: body.website,
        featured: body.featured,
      })
      .eq('id', body.id)
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json(data);
  } catch (error) {
    console.error('Update charity error:', error);
    return NextResponse.json({ error: 'Failed to update charity' }, { status: 500 });
  }
}

// DELETE - Delete charity (admin only)
export async function DELETE(request: Request) {
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

    const { id } = await request.json();
    const adminSupabase = createAdminClient();

    const { error } = await adminSupabase.from('charities').delete().eq('id', id);

    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete charity error:', error);
    return NextResponse.json({ error: 'Failed to delete charity' }, { status: 500 });
  }
}

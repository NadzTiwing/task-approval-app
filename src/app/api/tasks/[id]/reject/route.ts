'use server'

import { createClient } from '@/lib/supabaseServer';
import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('tasks')
      .update({ status: 'rejected', updated_at: new Date().toISOString() })
      .eq('id', params.id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to reject task' }, { status: 500 });
  }
} 
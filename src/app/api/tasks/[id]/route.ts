'use server'

import { createClient } from '@/lib/supabaseServer';
import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import { UpdateTaskInput } from '@/lib/types';

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const supabase = await createClient();
    const body: UpdateTaskInput = await request.json();

    if (!params.id) {
      return NextResponse.json({ error: 'Task ID is required' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('tasks')
      .update({ ...body, updated_at: new Date().toISOString() })
      .eq('id', params.id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update task' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const supabase = await createClient();

    if (!params.id) {
      return NextResponse.json({ error: 'Task ID is required' }, { status: 400 });
    }

    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', params.id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete task' }, { status: 500 });
  }
} 
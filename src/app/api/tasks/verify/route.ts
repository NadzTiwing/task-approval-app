import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { token } = body;
    // Query the database to find the task with the matching token
    const { data: task, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('token', token)
      .single();

    if (error) {
      console.error('Error fetching task:', error);
      return NextResponse.json(
        { error: 'Failed to verify token' },
        { status: 500 }
      );
    }

    if (!task) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      task: {
        id: task.id,
        task: task.task,
        email: task.email,
        status: task.status,
        created_at: task.created_at
      }
    });
  } catch (error) {
    console.error('Error verifying token:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 
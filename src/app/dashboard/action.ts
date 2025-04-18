'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabaseServer'

const appUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api`

export const logout = async () => {
  const supabase = await createClient()
  
  const { error } = await supabase.auth.signOut()

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/', 'layout')
  redirect('/')
}

export const getTasks = async () => {
  try {
    const response = await fetch(`${appUrl}/tasks`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      // ensure the request is made from the server side
      cache: 'no-store'
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch tasks');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return [];
  }
}

export const sendEmail = async ({ to, token, task }: { to: string, token: string, task: string }) => {
  try {
    const emailResponse = await fetch(`${appUrl}/email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to,
        token,
        task
      })
    });
    const emailData = await emailResponse.json();
    return emailData;
  } catch (error) {
    return { error: 'Failed to send email' };
  }
};

export const updateTask = async (id: string, task: string) => {
  try {
    const response = await fetch(`${appUrl}/tasks/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',   
      },
      body: JSON.stringify({
        task
      })
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error updating task:', error);
    return { error: 'Failed to update task' };
  }
};

export const deleteTask = async (id: string) => {
  try {
    const response = await fetch(`${appUrl}/tasks/${id}`, {
      method: 'DELETE',
    });
    const data = await response.json();
    return data;
  } catch (error) {
    return { error: 'Failed to delete task' };
  }
};

export const createTask = async (task: string, email: string) => {
  try {
    const response = await fetch(`${appUrl}/tasks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        task,
        email
      })
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error creating task:', error);
    return { error: 'Failed to create task' };
  }
};



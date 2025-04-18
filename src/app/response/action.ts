'use server'

import { appUrl } from '@/lib/utils'
import { TaskAction } from '@/lib/types'

export const respondToTask = async (taskId: string, action: TaskAction) => {
  try {
    const response = await fetch(`${appUrl}/tasks/${taskId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ status: action === 'approve' ? 'approved' : 'rejected' })
    });

    if (!response.ok) {
      console.log(`Failed to ${action} task`);
      return { success: false, error: 'Failed to approve task' };
    }

    return { success: true };
  } catch (error) {
    console.error('Error approving task:', error);
    return { success: false, error: 'Failed to approve task' };
  }
};

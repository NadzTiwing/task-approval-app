interface TaskDetails {
  id: string;
  task: string;
  email: string;
  status: string;
  created_at: string;
}

export async function verifyToken(token: string): Promise<{
  success: boolean;
  task?: TaskDetails;
  error?: string;
}> {
  try {
    const response = await fetch('/api/tasks/verify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token }),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.error || 'Failed to verify token'
      };
    }

    return {
      success: true,
      task: data.task
    };
  } catch (error) {
    console.error('Error verifying token:', error);
    return {
      success: false,
      error: 'Failed to verify token'
    };
  }
} 
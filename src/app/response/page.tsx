'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Task } from '@/lib/types';
import { verifyToken } from '@/lib/token-utils';
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";

export default function RespondPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const [task, setTask] = useState<Task | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDisabled, setIsDisabled] = useState(false);

  useEffect(() => {
    const fetchTask = async () => {
      if (!token) {
        setError('No token provided');
        setIsLoading(false);
        return;
      }

      const result = await verifyToken(token);
      
      if (!result.success || !result.task) {
        setError(result.error || 'Failed to verify token');
        setIsLoading(false);
        return;
      }

      const { id, task, email, status, created_at } = result.task;
      setTask({
        id,
        task,
        email,
        status: status as 'pending' | 'approved' | 'rejected',
        created_at
      });
      setIsLoading(false);
    };

    fetchTask();
  }, [token]);

  const handleResponse = async (action: 'approve' | 'reject') => {
    if (!task) return;
    const status = action === 'approve' ? 'approved' : 'rejected';
    try {
      const response = await fetch(`/api/tasks/${task.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          status
        })
      });
      
      if (!response.ok) {
        throw new Error(`Failed to ${action} task`);
      }
      setIsDisabled(true);
      toast.success(`You have ${status} the task.`);
      
      // Close the window after 5 seconds
      setTimeout(() => {
        window.close();
      }, 5000);

    } catch (err) {
      setError(err instanceof Error ? err.message : `Failed to ${action} the task`);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-[400px]">
          <CardHeader>
            <CardTitle className="text-red-500">Error</CardTitle>
          </CardHeader>
          <CardContent>
            {error}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-slate-200">
      <Toaster position="top-center" />
      <Card className="w-[400px]">
        {task?.status === 'pending' ? (
          <>
          <CardHeader>
            <CardTitle>Task Review Request</CardTitle>
            <CardDescription>Please review the following task</CardDescription>
          </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium">Task Description:</h3>
                  <p className="mt-1">{task?.task}</p>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between gap-4">
              <Button
                variant="destructive"
                className="flex-1 cursor-pointer hover:bg-red-700"
                onClick={() => handleResponse('reject')}
                disabled={isDisabled}
              >
                Reject
              </Button>
              <Button
                variant="default"
                className="flex-1 cursor-pointer bg-emerald-500 hover:bg-emerald-700"
                onClick={() => handleResponse('approve')}
                disabled={isDisabled}
              >
                Approve
              </Button>
            </CardFooter>
          </>
        ) : (
          <CardContent>
            <p className="text-center w-full text-gray-500">
              This link has expired
            </p>
          </CardContent>
        )}
      </Card>
    </div>
  );
}

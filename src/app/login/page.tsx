"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { login } from "./action";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    setIsLoading(true);
    e.preventDefault();
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const response = await login(formData);
    if (response?.error) {
      toast.error(response.error);
      setIsLoading(false);
      return;
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-200">
      <Toaster position="top-center" className="bg-red-700"/>
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-md lg:mx-auto md:mx-3 mx-3">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <Label htmlFor="email">Email address</Label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                required
                className="mt-1"
              />
            </div>
          </div>

          <div>
            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? 'Verifying...' : 'Sign in'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
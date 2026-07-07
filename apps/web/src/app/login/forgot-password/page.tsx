'use client';

import { useActionState } from 'react';
import { forgotPassword, ForgotPasswordState } from '@/services/client/user';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { AlertCircleIcon } from 'lucide-react';

export default function ForgotPasswordPage() {
  const initialState: ForgotPasswordState = { message: '', errors: {}, values: {} };
  const [state, formAction, pending] = useActionState(forgotPassword, initialState);

  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">Forgot Password</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={formAction} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                defaultValue={state?.values?.email || ''}
              />
              {state?.errors?.email && (
                <p className="text-sm text-red-500">{state.errors.email[0]}</p>
              )}
            </div>

            {state?.message && !pending && (
              <Alert variant="default" className="border-none">
                <AlertCircleIcon />
                <AlertDescription>{state.message}</AlertDescription>
              </Alert>
            )}

            <Button type="submit" disabled={pending} className="w-full">
              {pending ? 'Sending...' : 'Send Reset Link'}
            </Button>
          </form>
          <div className="mt-4 text-center text-sm">
            <Link href="/login" className="text-blue-600 hover:underline">
              Back to login
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

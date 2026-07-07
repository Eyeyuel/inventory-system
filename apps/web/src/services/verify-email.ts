'use server';

import { redirect } from 'next/navigation';
import apiClient from '@/services/axiosInstance';
import { setTokens } from './client/tokens';

export async function verifyEmailAction(token: string) {
  if (!token) {
    redirect('/login?error=missing-token');
  }

  try {
    const { data } = await apiClient.post('/users/verify-email', { token });
    // data contains: { message, access_token, refresh_token }
    await setTokens(data.access_token, data.refresh_token);
  } catch (error: any) {
    // If verification fails, redirect to login with an error message
    const message = error?.response?.data?.message || 'Verification failed';
    redirect(`/login?error=${encodeURIComponent(message)}`);
  }

  // Success – redirect to dashboard
  redirect('/dashboard');
}

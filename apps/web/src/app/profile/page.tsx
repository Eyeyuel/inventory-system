'use client';

import { useEffect, useState } from 'react';
import apiClient from '@/services/axiosInstance';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

interface Profile {
  id: string;
  userName: string | null;
  firstName: string;
  lastName: string | null;
  image: string | null;
}

export default function Dashboard() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    apiClient
      .get('/profile')
      .then((res) => setProfile(res.data))
      .catch((err) => {
        setError(err.response?.data?.message || 'Failed to load profile. Please try again.');
      })
      .finally(() => setLoading(false));
  }, []);

  // Loading state
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center p-6">
        <Card className="w-full max-w-md">
          <CardHeader className="flex items-center gap-4">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-[150px]" />
              <Skeleton className="h-4 w-[100px]" />
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </CardContent>
        </Card>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center p-6">
        <Alert variant="destructive" className="max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  // Profile data
  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      <Card className="w-full max-w-md">
        <CardHeader className="flex flex-col items-center gap-4">
          <Avatar className="h-20 w-20">
            <AvatarImage src={profile?.image ?? undefined} alt={profile?.firstName} />
            <AvatarFallback>{profile?.firstName?.charAt(0)?.toUpperCase() || '?'}</AvatarFallback>
          </Avatar>
          <div className="text-center">
            <CardTitle className="text-2xl">
              {profile?.firstName} {profile?.lastName ?? ''}
            </CardTitle>
            <p className="text-sm text-muted-foreground">@{profile?.userName || 'username'}</p>
          </div>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">ID</span>
            <span className="font-mono">{profile?.id}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">First Name</span>
            <span>{profile?.firstName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Last Name</span>
            <span>{profile?.lastName || 'Not set'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Image</span>
            <span>{profile?.image ? 'Available' : 'No image'}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

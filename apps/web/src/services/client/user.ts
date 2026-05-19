'use server';
import { LoginResponseDto } from '@inventory-system/dto';
import { AxiosResponse } from 'axios';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import apiClient from '../axiosInstance';

export type LoginState = {
  errors: {
    // no "?" → always present
    email?: string[];
    password?: string[];
  };
  message: string; // also required
  values?: {
    email: string;
    password: string;
  };
};

const LoginFormSchema = z.object({
  email: z.email('Invalid email address.'),
  password: z.string().min(1, 'Please enter password.'),
});

export async function login(
  prevState: LoginState | undefined,
  formData: FormData,
): Promise<LoginState> {
  // 1. Validate
  const validatedFields = LoginFormSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: '',
      values: {
        email: (formData.get('email') as string) || '',
        password: (formData.get('password') as string) || '',
      },
    };
  }

  // 2. API call – only this part can fail from the backend
  let response: AxiosResponse<LoginResponseDto>;
  try {
    response = await apiClient.post<LoginResponseDto>('/users/login', {
      email: validatedFields.data.email,
      password: validatedFields.data.password,
    });
  } catch (error: any) {
    console.error('Login error:', error?.response?.data || error);

    const message = error?.response?.data?.message ?? 'An unexpected error occurred.';

    return {
      message,
      errors: {},
      values: {
        email: validatedFields.data.email, // keep email
        password: '',
      },
    };
  }

  // 3. Success – store tokens and redirect (NOT inside try/catch)
  const cookieStore = await cookies();
  cookieStore.set('access_token', response.data.access_token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24, // 1 day
  });
  cookieStore.set('refresh_token', response.data.refresh_token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });

  redirect('/dashboard'); // this will work as intended
}

// export async function login(prevState: State | undefined, formData: FormData): Promise<State> {
//   const validatedFields = LoginFormSchema.safeParse({
//     email: formData.get('email'),
//     password: formData.get('password'),
//   });

//   if (!validatedFields.success) {
//     return {
//       errors: validatedFields.error.flatten().fieldErrors,
//       message: 'Missing Fields. Failed to Signin.',
//       values: {
//         email: (formData.get('email') as string) || '',
//         password: (formData.get('password') as string) || '',
//       },
//     };
//   }

//   try {
//     const response = await apiClient.post<LoginResponseDto>('/users/login', {
//       email: validatedFields.data.email,
//       password: validatedFields.data.password,
//     });

//     // Log the response data (visible in your server console)
//     console.log('Login response:', response.data);

//     // Here you can also set cookies, etc., later
//     return {
//       message: 'Success',
//       errors: {},
//       values: undefined,
//     };
//   } catch (error: any) {
//     // Log the full error for debugging
//     // console.error('Login error:', error);

//     // Log the backend's response body and status
//     console.log('Backend response data:', error.response?.data);
//     console.log('Backend response status:', error.response?.status);

//     // Try to extract a useful message from the API error, if any
//     const message =
//       error?.response?.data?.message ?? 'An unexpected error occurred. Please try again.'; // common Axios error shape

//     return {
//       message,
//       errors: {},
//       values: {
//         email: validatedFields.data.email,
//         password: '', // don’t repopulate password after a failed login for security
//       },
//     };
//   }
// }

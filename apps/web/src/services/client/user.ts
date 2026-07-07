'use server';
import { LoginResponseDto, SignupResponseDto } from '@inventory-system/dto';
import axios, { AxiosResponse } from 'axios';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import apiClient from '../axiosInstance';
import { setTokens } from './tokens';

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

export type SignupState = {
  errors: {
    email?: string[];
    password?: string[];
    first_name?: string[];
    last_name?: string[];
  };
  message: string; // also required
  values?: {
    email: string;
    password: string;
    first_name: string;
    last_name: string;
  };
};

export type ForgotPasswordState = {
  errors?: { email?: string[] };
  message: string;
  values?: { email?: string };
};

export type ResetPasswordState = {
  errors?: { password?: string[] };
  message: string;
  values?: { password?: string };
};

const LoginFormSchema = z.object({
  email: z.email('Invalid email address.'),
  password: z.string().min(1, 'Please enter password.'),
});

const SignupFormSchema = z.object({
  email: z.email('Invalid email address.'),
  password: z.string().min(1, 'Please enter password.'),
  first_name: z.string().min(1, 'Please enter first name.'),
  last_name: z.string().min(1, 'Please enter last name.'),
});

const ForgotPasswordSchema = z.object({
  email: z.email('Please enter a valid email address.'),
});

const ResetPasswordSchema = z.object({
  password: z.string().min(8, 'Password must be at least 8 characters.'),
  token: z.string().min(1, 'Invalid reset token.'),
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
  setTokens(response.data.access_token, response.data.refresh_token);

  redirect('/dashboard'); // this will work as intended
}

export async function signup(
  prevState: SignupState | undefined,
  formData: FormData,
): Promise<SignupState> {
  // 1. Validate
  const validatedFields = SignupFormSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
    first_name: formData.get('first_name'),
    last_name: formData.get('last_name'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: '',
      values: {
        email: (formData.get('email') as string) || '',
        password: (formData.get('password') as string) || '',
        first_name: (formData.get('first_name') as string) || '',
        last_name: (formData.get('last_name') as string) || '',
      },
    };
  }

  // 2. API call – only this part can fail from the backend
  let response: AxiosResponse<SignupResponseDto>;
  try {
    response = await apiClient.post<SignupResponseDto>('/users/signup', {
      email: validatedFields.data.email,
      password: validatedFields.data.password,
      first_name: validatedFields.data.first_name,
      last_name: validatedFields.data.last_name,
    });
    // console.log(response.data.verification_token);
  } catch (error: any) {
    console.error('Signup error:', error?.response?.data || error);

    const message = error?.response?.data?.message ?? 'An unexpected error occurred.';

    return {
      message,
      errors: {},
      values: {
        email: validatedFields.data.email,
        password: '', // don't keep password for security
        first_name: validatedFields.data.first_name,
        last_name: validatedFields.data.last_name,
      },
    };
  }

  // // In signup() – success branch
  // if (response.data.verification_token) {
  //   redirect(`/verify-email?token=${response.data.verification_token}`);
  // }
  // If no token returned, maybe redirect to login with a message
  redirect(`signup/verify-email?token=${response.data.verification_token}`);
}

export async function logout() {
  const cookieStore = await cookies();

  cookieStore.delete('access_token');
  cookieStore.delete('refresh_token');

  redirect('/login');
}

export async function forgotPassword(
  prevState: ForgotPasswordState | undefined,
  formData: FormData,
): Promise<ForgotPasswordState> {
  const validatedFields = ForgotPasswordSchema.safeParse({
    email: formData.get('email'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: '',
      values: { email: (formData.get('email') as string) || '' },
    };
  }

  try {
    const result = await apiClient.post('/users/forgot-password', {
      email: validatedFields.data.email,
    });

    // for not log the rest password link with the token
    // console.log(result.data?.passwordResetToken);
    return {
      message:
        'Check your email for a link to reset your password. If it doesn’t appear within a few minutes, check your spam folder.',
      errors: {},
      values: {},
    };
  } catch (error: any) {
    console.error('Forgot password error:', error?.response?.data || error);
    const message = error?.response?.data?.message ?? 'An error occurred. Please try again.';
    return {
      message,
      errors: {},
      values: { email: validatedFields.data.email },
    };
  }
}

export async function resetPassword(
  prevState: ResetPasswordState | undefined,
  formData: FormData,
): Promise<ResetPasswordState> {
  const validatedFields = ResetPasswordSchema.safeParse({
    password: formData.get('password'),
    token: formData.get('token'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: '',
      values: { password: '' },
    };
  }

  try {
    const result = await apiClient.post('/users/reset-password', {
      token: validatedFields.data.token,
      newPassword: validatedFields.data.password,
    });

    await setTokens(result.data.access_token, result.data.refresh_token);
  } catch (error: any) {
    console.error('Reset password error:', error?.response?.data || error);
    const message =
      error?.response?.data?.message ?? 'Failed to reset password. The link may have expired.';
    return {
      message,
      errors: {},
      values: { password: '' },
    };
  }

  // Success – redirect to login with a success message
  redirect('/dashboard');
}

// export async function getProfile() {
//   try {
//     const response = await apiClient.get('/profile');
//     return response.data;
//   } catch (error) {
//     if (axios.isAxiosError(error)) {
//       console.error(error.response?.data);

//       throw new Error(error.response?.data?.message || 'Something went wrong');
//     }

//     throw error;
//   }
// }

// export async function getProfile() {
//   const cookieStore = await cookies();

//   const accessToken = cookieStore.get('access_token')?.value;

//   const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/profile`, {
//     headers: {
//       Authorization: `Bearer ${accessToken}`,
//     },
//   });

//   return response.data;
// }

'use client';
/* context provider wrapper */
import { AuthProvider } from '@/context/AuthContext';

export function Providers({ children }: { children: React.ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>;
}

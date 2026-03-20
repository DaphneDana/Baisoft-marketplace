import ProtectedRoute from '@/components/ProtectedRoute';
/* Users layout to protect all routes under /users */
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <ProtectedRoute>{children}</ProtectedRoute>;
}

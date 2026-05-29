import { Navigate, Outlet } from 'react-router-dom';
import { localStorageHelper } from '../helpers/localStorageHelper';

interface ProtectedRouteProps {
  children?: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const isAuth = localStorageHelper.isAuthenticated();

  if (!isAuth) {
    // If not authenticated, redirect to login
    return <Navigate to="/es31/login" replace />;
  }

  return children ? <>{children}</> : <Outlet />;
}

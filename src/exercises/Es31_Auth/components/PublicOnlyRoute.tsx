import { Navigate, Outlet } from 'react-router-dom';
import { localStorageHelper } from '../helpers/localStorageHelper';

interface PublicOnlyRouteProps {
  children?: React.ReactNode;
}

export default function PublicOnlyRoute({ children }: PublicOnlyRouteProps) {
  const isAuth = localStorageHelper.isAuthenticated();

  if (isAuth) {
    // If already logged in, redirect to the private page
    return <Navigate to="/es31/private" replace />;
  }

  return children ? <>{children}</> : <Outlet />;
}

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { localStorageHelper } from '../helpers/localStorageHelper';

interface ProtectedRouteProps {
  children?: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    if (!localStorageHelper.isAuthenticated()) {
      router.replace('/es31/login');
    } else {
      setAuthorized(true);
    }
  }, [router]);

  return authorized ? <>{children}</> : null;
}

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { localStorageHelper } from '../helpers/localStorageHelper';

interface PublicOnlyRouteProps {
  children?: React.ReactNode;
}

export default function PublicOnlyRoute({ children }: PublicOnlyRouteProps) {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    if (localStorageHelper.isAuthenticated()) {
      router.replace('/es31/private');
    } else {
      setAuthorized(true);
    }
  }, [router]);

  return authorized ? <>{children}</> : null;
}

'use client';

import { useContext } from 'react';
import PrivatePage from '../../../exercises/Es31_Auth/pages/PrivatePage';
import ProtectedRoute from '../../../exercises/Es31_Auth/components/ProtectedRoute';
import { AuthContext } from '../AuthContext';

export default function Page() {
  const { user } = useContext(AuthContext);

  return (
    <ProtectedRoute>
      <PrivatePage user={user} />
    </ProtectedRoute>
  );
}

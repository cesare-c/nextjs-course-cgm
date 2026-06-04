'use client';

import { useContext } from 'react';
import LoginPage from '../../../exercises/Es31_Auth/pages/LoginPage';
import PublicOnlyRoute from '../../../exercises/Es31_Auth/components/PublicOnlyRoute';
import { AuthContext } from '../AuthContext';

export default function Page() {
  const { login } = useContext(AuthContext);

  return (
    <PublicOnlyRoute>
      <LoginPage onLoginSuccess={login} />
    </PublicOnlyRoute>
  );
}

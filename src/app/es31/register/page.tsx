'use client';

import { useContext } from 'react';
import RegisterPage from '../../../exercises/Es31_Auth/pages/RegisterPage';
import PublicOnlyRoute from '../../../exercises/Es31_Auth/components/PublicOnlyRoute';
import { AuthContext } from '../AuthContext';

export default function Page() {
  const { login } = useContext(AuthContext);

  return (
    <PublicOnlyRoute>
      <RegisterPage onRegisterSuccess={login} />
    </PublicOnlyRoute>
  );
}

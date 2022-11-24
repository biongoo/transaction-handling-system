import { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from 'stores';

export const Logout = () => {
  const logOut = useAuthStore((store) => store.logOut);

  useEffect(() => {
    logOut();
  }, []);

  return <Navigate to="/" />;
};

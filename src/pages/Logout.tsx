import { Navigate } from 'react-router-dom';
import { useAuthStore } from 'stores';

export const Logout = () => {
  const logOut = useAuthStore((store) => store.logOut);

  logOut();

  return <Navigate to="/" />;
};

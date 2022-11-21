import { ErrorPage, LogIn, Main, SignUp } from 'pages';
import { AppLayout, AuthLayout } from 'partials';
import { createBrowserRouter, Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from 'stores';

type AuthProviderProps = {
  shouldBeLoggedIn: boolean;
  children: JSX.Element;
};

const AuthProvider = (props: AuthProviderProps) => {
  const location = useLocation();
  const token = useAuthStore((store) => store.token);

  if (props.shouldBeLoggedIn) {
    if (!token) {
      return <Navigate to="/auth/login" state={{ from: location }} replace />;
    }
  } else {
    if (token) {
      return <Navigate to="/" state={{ from: location }} replace />;
    }
  }

  return props.children;
};

export const router = createBrowserRouter([
  {
    path: '/',
    errorElement: <ErrorPage />,
    element: <AppLayout />,
    children: [
      {
        index: true,
        element: <Main />,
      },
    ],
  },
  {
    path: '/auth',
    element: (
      <AuthProvider shouldBeLoggedIn={false}>
        <AuthLayout />
      </AuthProvider>
    ),
    errorElement: <ErrorPage />,
    children: [
      {
        path: 'login',
        element: <LogIn />,
      },
      {
        path: 'signup',
        element: <SignUp />,
      },
    ],
  },
  {
    path: '*',
    element: <ErrorPage />,
  },
]);

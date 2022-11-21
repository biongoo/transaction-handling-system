import { ErrorPage, LogIn, Logout, Main, SignUp } from 'pages';
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
    element: <AuthLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: 'login',
        element: (
          <AuthProvider shouldBeLoggedIn={false}>
            <LogIn />
          </AuthProvider>
        ),
      },
      {
        path: 'signup',
        element: (
          <AuthProvider shouldBeLoggedIn={false}>
            <SignUp />
          </AuthProvider>
        ),
      },
      {
        path: 'logout',
        element: (
          <AuthProvider shouldBeLoggedIn={true}>
            <Logout />
          </AuthProvider>
        ),
      },
    ],
  },
  {
    path: '*',
    element: <ErrorPage />,
  },
]);

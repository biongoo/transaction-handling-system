import { UserRole } from 'enums';
import {
  ErrorPage,
  LogIn,
  Logout,
  Main,
  SignUp,
  Users,
  UsersAdd,
  UsersEdit,
} from 'pages';
import { AppLayout, AuthLayout } from 'partials';
import {
  createBrowserRouter,
  Navigate,
  Outlet,
  useLocation,
} from 'react-router-dom';
import { useAuthStore } from 'stores';

type AuthProviderProps = {
  children: JSX.Element;
  shouldBeLoggedIn: boolean;
  expectedRole?: UserRole;
};

const AuthProvider = (props: AuthProviderProps) => {
  const location = useLocation();
  const token = useAuthStore((store) => store.token);
  const role = useAuthStore((store) => store.user?.role);

  if (props.shouldBeLoggedIn) {
    if (!token) {
      return <Navigate to="/auth/login" state={{ from: location }} replace />;
    }
  } else {
    if (token) {
      return <Navigate to="/" state={{ from: location }} replace />;
    }
  }

  if (
    props.expectedRole &&
    ((props.expectedRole === UserRole.admin && role !== UserRole.admin) ||
      (props.expectedRole === UserRole.employee && role === UserRole.user))
  ) {
    return <Navigate to="/" state={{ from: location }} replace />;
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
      {
        path: 'users',
        element: (
          <AuthProvider shouldBeLoggedIn={true} expectedRole={UserRole.admin}>
            <Outlet />
          </AuthProvider>
        ),
        children: [
          {
            index: true,
            element: <Users />,
          },
          {
            path: 'add',
            element: <UsersAdd />,
          },
          {
            path: ':id/edit',
            element: <UsersEdit />,
          },
        ],
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

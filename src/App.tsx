
import React, { lazy, Suspense, useContext } from 'react';
import { RoutesPages } from './routes/RoutesPages';
import { useAuthStore } from './store/authStore';
import { ToastContainer } from 'react-toastify';
import { ThemeContext, type ThemeContextType } from './context/themeProvider';

export interface RouteConfig {
  path: string;
  component: React.LazyExoticComponent<() => React.JSX.Element>;
}

const routesPublics: RouteConfig[] = [
  {
    path: '/login',
    component: lazy(() => import('./pages/public/auth/login/Login')),
  },
  {
    path: '/register',
    component: lazy(() => import('./pages/public/auth/register/Register')),
  },
  {
    path: '/forgot-password',
    component: lazy(() => import('./pages/public/auth/forgot-password/ForgotPassword')),
  }
]

const routesPrivates: RouteConfig[] = [
  {
    path: '/dashboard',
    component: lazy(() => import('./pages/private/dashboard/Dashboard')),
  },
  {
    path: '/users',
    component: lazy(() => import('./pages/private/users/Users')),
  },
  {
    path: '/events',
    component: lazy(() => import('./pages/private/event/Events')),
  },
  {
    path: '/profile',
    component: lazy(() => import('./pages/private/profile/Profile')),
  },
  {
    path: '/customers',
    component: lazy(() => import('./pages/private/customers/Customers')),
  }
]

function App() {

  const user = useAuthStore((state) => state.user);

  const { theme } = useContext(ThemeContext) as ThemeContextType;

  const routes = user?.accessToken ? routesPrivates : routesPublics;
  const typeRoutes = user?.accessToken ? 'private' : 'public';
  const themes = (theme === 'system') ? 'dark' : theme;

  return (
    <Suspense fallback={<div>...Loading</div>}>
      <ToastContainer theme={`${themes}`} />
      <RoutesPages routes={routes} typeRoutes={typeRoutes} />
    </Suspense>
  )
}

export default App;

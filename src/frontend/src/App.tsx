import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider, createRouter, createRoute, createRootRoute } from '@tanstack/react-router';
import AppLayout from './components/layout/AppLayout';
import CafeSearchPage from './pages/CafeSearchPage';
import CafeDetailsPage from './pages/CafeDetailsPage';

const rootRoute = createRootRoute({
  component: AppLayout,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: CafeSearchPage,
});

const cafeDetailsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/cafes/$id',
  component: CafeDetailsPage,
});

const routeTree = rootRoute.addChildren([indexRoute, cafeDetailsRoute]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

function App() {
  return <RouterProvider router={router} />;
}

export default App;

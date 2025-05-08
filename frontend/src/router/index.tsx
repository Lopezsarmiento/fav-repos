import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
  Link,
  useNavigate,
  redirect,
  Navigate,
} from "react-router-dom";
import { LoginPage } from "../pages/LoginPage";
import { SignupPage } from "../pages/SignupPage";
import { RepositoriesPage } from "../pages/RepositoriesPage";
import { GitHubAuthCallbackPage } from "../pages/GitHubAuthCallbackPage";
import { useAuthStore } from "../store/auth.store";

const protectedLoader = () => {
  const isAuthenticated = useAuthStore.getState().isAuthenticated;

  if (!isAuthenticated) {
    return redirect("/login");
  }

  return null;
};

const RootLayout = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <nav className="p-4 bg-blue-600 dark:bg-blue-800 text-white shadow-md">
        <ul className="flex items-center space-x-6 container mx-auto">
          {isAuthenticated ? (
            <>
              <li>
                <Link to="/repositories" className="hover:underline">
                  Repositories
                </Link>
              </li>
              <li className="ml-auto">
                {user && (
                  <span className="mr-4">Welcome, {user.username}!</span>
                )}
                <button
                  onClick={handleLogout}
                  className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded text-sm font-medium transition-colors"
                >
                  Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li className="ml-auto">
                <Link to="/login" className="hover:underline">
                  Login
                </Link>
              </li>
              <li>
                <Link to="/signup" className="hover:underline">
                  Sign Up
                </Link>
              </li>
            </>
          )}
        </ul>
      </nav>
      <main className="p-4 container mx-auto">
        <Outlet />
      </main>
    </div>
  );
};

// Define the routes
const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <Navigate to="/repositories" replace />,
        loader: protectedLoader,
      },
      {
        path: "repositories",
        element: <RepositoriesPage />,
        loader: protectedLoader,
      },
      {
        path: "login",
        element: <LoginPage />,
      },
      {
        path: "signup",
        element: <SignupPage />,
      },
      {
        path: "auth/github/callback",
        element: <GitHubAuthCallbackPage />,
      },
    ],
  },
]);

export const AppRouter = () => {
  return <RouterProvider router={router} />;
};

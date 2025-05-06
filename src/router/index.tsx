// src/router/index.tsx
import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
  Link,
  useNavigate,
  redirect, // Import redirect
} from "react-router-dom";
import { LoginPage } from "../pages/LoginPage";
import { SignupPage } from "../pages/SignupPage";
import { useAuthStore } from "../store/auth.store";

// Placeholder Page Components
const RepositoriesPage = () => (
  <div className="p-4">Repositories Page Placeholder (Home - Protected)</div>
);
const FavoritesPage = () => (
  <div className="p-4">Favorites Page Placeholder (Protected)</div>
);
const ProfilePage = () => (
  <div className="p-4">Profile Page Placeholder (Protected)</div>
);

// --- Protected Route Loader ---
// This function runs BEFORE the component for the route renders.
// It checks the auth state directly from the store.
const protectedLoader = () => {
  const isAuthenticated = useAuthStore.getState().isAuthenticated; // Read state directly
  console.log("Protected Loader Check: isAuthenticated =", isAuthenticated); // For debugging

  if (!isAuthenticated) {
    // If not authenticated, redirect them to the login page
    console.log("Redirecting to /login");
    return redirect("/login");
  }
  // If authenticated, allow rendering the route component
  return null; // Or return data if the loader fetches any
};
// --- End Protected Route Loader ---

// Basic Layout with Navigation (RootLayout component remains the same as before)
const RootLayout = () => {
  // ... (Keep the existing RootLayout implementation with conditional nav) ...
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
          {/* Conditionally render Repositories link only if authenticated? Or always visible?
                  Let's keep it always visible for now, loader will protect the page */}
          <li>
            <Link to="/" className="hover:underline">
              Repositories
            </Link>
          </li>

          {isAuthenticated ? (
            <>
              <li>
                <Link to="/favorites" className="hover:underline">
                  Favorites
                </Link>
              </li>
              <li>
                <Link to="/profile" className="hover:underline">
                  Profile
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
      // --- Apply loader to protected routes ---
      {
        index: true, // Represents the '/' path relative to the parent
        element: <RepositoriesPage />,
        loader: protectedLoader, // Add loader here
      },
      {
        path: "favorites",
        element: <FavoritesPage />,
        loader: protectedLoader, // Add loader here
      },
      {
        path: "profile",
        element: <ProfilePage />,
        loader: protectedLoader, // Add loader here
      },
      // --- Public routes ---
      {
        path: "login",
        element: <LoginPage />,
        // No loader needed for public routes
      },
      {
        path: "signup",
        element: <SignupPage />,
        // No loader needed for public routes
      },
    ],
  },
]);

// Component to provide the router context
export const AppRouter = () => {
  return <RouterProvider router={router} />;
};

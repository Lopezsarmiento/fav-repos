// src/pages/GitHubAuthCallbackPage.tsx
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuthStore } from "../store/auth.store";

// These should ideally match or be sourced from the same place as in RepositoriesPage/LoginPage
// Or even better, use environment variables for these that are shared.
const GITHUB_CLIENT_ID = "Ov23liNVBP07iWV4iAtN"; // REPLACE with your Client ID
const GITHUB_REDIRECT_URI = "http://localhost:5173/auth/github/callback"; // Must match your GitHub app config

export const GitHubAuthCallbackPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const setGithubAccessToken = useAuthStore(
    (state) => state.setGithubAccessToken
  );
  const localAppLogin = useAuthStore((state) => state.login); // If needed for re-login logic
  const localUser = useAuthStore((state) => state.user);

  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const code = searchParams.get("code");
    const codeVerifier = localStorage.getItem("github_code_verifier");

    if (code && codeVerifier) {
      const exchangeToken = async () => {
        try {
          const response = await fetch(
            "https://github.com/login/oauth/access_token",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Accept: "application/json", // Important to get JSON response
              },
              body: JSON.stringify({
                client_id: GITHUB_CLIENT_ID,
                code: code,
                redirect_uri: GITHUB_REDIRECT_URI,
                grant_type: "authorization_code",
                code_verifier: codeVerifier,
              }),
            }
          );

          localStorage.removeItem("github_code_verifier"); // Clean up verifier

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(
              errorData.error_description ||
                "Failed to exchange token with GitHub."
            );
          }

          const data = await response.json();

          if (data.access_token) {
            setGithubAccessToken(data.access_token);

            // Optional: If local user session was lost but GitHub auth succeeded,
            // you might re-establish a placeholder local session or fetch GitHub user info
            // to create/update the local user profile.
            // For now, we assume the local user is still logged in.
            // if (!localUser && data.access_token) {
            //   // Potentially fetch github user profile here with the new token
            //   // and then call localAppLogin({ username: githubUsername });
            // }

            navigate("/repositories", { replace: true }); // Redirect to repositories page
          } else {
            throw new Error(
              data.error_description ||
                "Access token not found in GitHub response."
            );
          }
        } catch (err: unknown) {
          console.error("GitHub token exchange error:", err);
          setError(
            err instanceof Error
              ? err.message
              : "An error occurred during GitHub authentication."
          );
          localStorage.removeItem("github_code_verifier"); // Ensure cleanup on error
        } finally {
          setIsLoading(false);
        }
      };

      exchangeToken();
    } else {
      setError(
        "Authorization code or verifier not found. Please try logging in again."
      );
      setIsLoading(false);
      localStorage.removeItem("github_code_verifier"); // Ensure cleanup
    }
  }, [searchParams, navigate, setGithubAccessToken, localAppLogin, localUser]); // Added localUser

  if (isLoading) {
    return (
      <div className="container mx-auto p-6 text-center">
        Processing GitHub authentication...
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6 text-center">
        <h1 className="text-xl font-semibold text-red-600 dark:text-red-400 mb-4">
          Authentication Error
        </h1>
        <p className="text-neutral-700 dark:text-neutral-300 mb-6">{error}</p>
        <button
          onClick={() => navigate("/repositories")} // Or navigate('/login')
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Go to Repositories
        </button>
      </div>
    );
  }

  // Should ideally not reach here if navigation occurs
  return (
    <div className="container mx-auto p-6 text-center">Redirecting...</div>
  );
};

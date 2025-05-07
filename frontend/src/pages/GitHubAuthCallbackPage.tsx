// src/pages/GitHubAuthCallbackPage.tsx
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuthStore } from "../store/auth.store";

const GITHUB_EXCHANGE_TOKEN_URL = import.meta.env
  .VITE_GITHUB_EXCHANGE_TOKEN_URL;

export const GitHubAuthCallbackPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const setGithubAccessToken = useAuthStore(
    (state) => state.setGithubAccessToken
  );
  const localAppLogin = useAuthStore((state) => state.login);
  const localUser = useAuthStore((state) => state.user);

  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const code = searchParams.get("code");
    const codeVerifier = localStorage.getItem("github_code_verifier");

    if (code && codeVerifier) {
      const exchangeToken = async () => {
        try {
          const response = await fetch(GITHUB_EXCHANGE_TOKEN_URL, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
            body: JSON.stringify({
              code: code,
              code_verifier: codeVerifier,
            }),
          });

          localStorage.removeItem("github_code_verifier");

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(
              errorData.error_description ||
                "Failed to exchange token with GitHub."
            );
          }

          const data = await response.json();

          console.log("GitHub token exchange response:", data);

          if (data.access_token) {
            setGithubAccessToken(data.access_token);
            navigate("/repositories", { replace: true });
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
          localStorage.removeItem("github_code_verifier");
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
      localStorage.removeItem("github_code_verifier");
    }
  }, [searchParams, navigate, setGithubAccessToken, localAppLogin, localUser]);

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
          onClick={() => navigate("/repositories")}
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Go to Repositories
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 text-center">Redirecting...</div>
  );
};

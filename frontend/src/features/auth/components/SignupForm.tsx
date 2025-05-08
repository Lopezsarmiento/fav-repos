import React, { useState } from "react";
import clsx from "clsx";

interface SignupFormProps {
  onSubmit: (credentials: { username: string; password: string }) => void;
  isLoading?: boolean;
  errorMessage?: string | null;
}

export const SignupForm = ({
  onSubmit,
  isLoading = false,
  errorMessage = null,
}: SignupFormProps) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordsMatchError, setPasswordsMatchError] = useState<string | null>(
    null
  );

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setPasswordsMatchError(null);

    if (password !== confirmPassword) {
      setPasswordsMatchError("Passwords do not match.");
      return;
    }

    onSubmit({ username, password });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 p-8 border rounded-lg shadow-md bg-white dark:bg-gray-800 dark:border-gray-700 max-w-md mx-auto"
    >
      <h2 className="text-2xl font-semibold text-center text-gray-800 dark:text-white">
        Sign Up
      </h2>

      {(errorMessage || passwordsMatchError) && (
        <div
          className="bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-200 px-4 py-3 rounded relative"
          role="alert"
        >
          {errorMessage && <p>{errorMessage}</p>}
          {passwordsMatchError && <p>{passwordsMatchError}</p>}
        </div>
      )}

      <div>
        <label
          htmlFor="signup-username"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
        >
          Username
        </label>
        <input
          type="text"
          id="signup-username"
          name="username"
          required
          minLength={3}
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          disabled={isLoading}
          className={clsx(
            "mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm",
            "focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400",
            "sm:text-sm dark:bg-gray-700 dark:text-white",
            { "bg-gray-100 dark:bg-gray-700 cursor-not-allowed": isLoading }
          )}
          placeholder="Choose a username (min 3 chars)"
        />
      </div>

      <div>
        <label
          htmlFor="signup-password"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
        >
          Password
        </label>
        <input
          type="password"
          id="signup-password"
          name="password"
          required
          minLength={6}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={isLoading}
          className={clsx(
            "mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm",
            "focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400",
            "sm:text-sm dark:bg-gray-700 dark:text-white",
            { "bg-gray-100 dark:bg-gray-700 cursor-not-allowed": isLoading }
          )}
          placeholder="Create a password (min 6 chars)"
        />
      </div>

      <div>
        <label
          htmlFor="confirm-password"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
        >
          Confirm Password
        </label>
        <input
          type="password"
          id="confirm-password"
          name="confirmPassword"
          required
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          disabled={isLoading}
          className={clsx(
            "mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm",
            "focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400",
            "sm:text-sm dark:bg-gray-700 dark:text-white",
            { "bg-gray-100 dark:bg-gray-700 cursor-not-allowed": isLoading },
            passwordsMatchError ? "border-red-500" : ""
          )}
          placeholder="Confirm your password"
        />
      </div>

      <div>
        <button
          type="submit"
          disabled={isLoading}
          className={clsx(
            "w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white",
            "focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-800 focus:ring-blue-500",
            "transition duration-150 ease-in-out",
            isLoading
              ? "bg-blue-400 dark:bg-blue-700 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600"
          )}
        >
          {isLoading ? "Signing up..." : "Sign Up"}
        </button>
      </div>
    </form>
  );
};

// src/pages/SignupPage.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { SignupForm } from "../features/auth/components/SignupForm";
import { useAuthStore } from "../store/auth.store";

// --- Dummy Signup Logic ---
// In a real app, this would involve an API call to a backend.
// For this demo, we just save credentials directly to localStorage.
// NOTE: Storing raw passwords is very insecure. This also overwrites
// any previously "registered" user in this simple demo setup.
const registerUser = (username: string, password: string): boolean => {
  try {
    const credentials = { username, password };
    // WARNING: Storing raw password. Highly insecure. Demo only.
    localStorage.setItem("userCredentials", JSON.stringify(credentials));
    console.log(`Credentials saved for user: ${username}`); // For debugging
    return true; // Indicate success
  } catch (error) {
    console.error("Failed to save credentials to localStorage:", error);
    return false; // Indicate failure
  }
};
// --- End Dummy Signup Logic ---

export const SignupPage: React.FC = () => {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login); // Get login action for auto-login
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSignup = async (credentials: {
    username: string;
    password: string;
  }) => {
    setIsLoading(true);
    setErrorMessage(null);

    // Simulate potential API call delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Attempt to "register" the user (save to localStorage)
    const success = registerUser(credentials.username, credentials.password);

    if (success) {
      // Automatically log the user in after successful signup
      login({ username: credentials.username });
      console.log("Signup successful, auto-login complete, navigating...");
      // Redirect to the home/repositories page
      navigate("/", { replace: true }); // Use replace to avoid signup page in history
    } else {
      setErrorMessage("Signup failed. Please try again.");
      setIsLoading(false);
    }
    // No need to set isLoading to false on success, as we navigate away
  };

  return (
    <div className="mt-10">
      {" "}
      {/* Add some top margin */}
      <SignupForm
        onSubmit={handleSignup}
        isLoading={isLoading}
        errorMessage={errorMessage}
      />
      <p className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
        Already have an account?{" "}
        <a
          href="/login"
          className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
        >
          Login here
        </a>
      </p>
    </div>
  );
};

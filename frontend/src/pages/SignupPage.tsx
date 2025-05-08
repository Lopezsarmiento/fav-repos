import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { SignupForm } from "../features/auth/components/SignupForm";
import { useAuthStore } from "../store/auth.store";

const registerUser = (username: string, password: string): boolean => {
  try {
    const credentials = { username, password };
    localStorage.setItem("userCredentials", JSON.stringify(credentials));

    return true;
  } catch (error) {
    console.error("Failed to save credentials to localStorage:", error);
    return false;
  }
};

export const SignupPage = () => {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSignup = async (credentials: {
    username: string;
    password: string;
  }) => {
    setIsLoading(true);
    setErrorMessage(null);

    const success = registerUser(credentials.username, credentials.password);

    if (success) {
      login({ username: credentials.username });

      navigate("/", { replace: true });
    } else {
      setErrorMessage("Signup failed. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="mt-10">
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

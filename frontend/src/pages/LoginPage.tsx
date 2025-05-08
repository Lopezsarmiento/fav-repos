import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LoginForm } from "../features/auth/components/LoginForm";
import { useAuthStore } from "../store/auth.store";

const checkCredentials = (username: string, password: string): boolean => {
  try {
    const storedCredentialsRaw = localStorage.getItem("userCredentials");
    if (!storedCredentialsRaw) {
      console.warn("No user credentials found in localStorage.");
      return false;
    }
    const storedCredentials = JSON.parse(storedCredentialsRaw);

    const isValid =
      storedCredentials.username === username &&
      storedCredentials.password === password;
    if (!isValid) {
      console.log(`Login attempt failed for user: ${username}`);
    }
    return isValid;
  } catch (error) {
    console.error(
      "Error reading or parsing credentials from localStorage:",
      error
    );
    return false;
  }
};

export const LoginPage = () => {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleLogin = async (credentials: {
    username: string;
    password: string;
  }) => {
    setIsLoading(true);
    setErrorMessage(null);

    const isValid = checkCredentials(
      credentials.username,
      credentials.password
    );

    if (isValid) {
      login({ username: credentials.username });
      navigate("/", { replace: true });
    } else {
      setErrorMessage("Invalid username or password.");
      setIsLoading(false);
    }
  };

  return (
    <div className="mt-10">
      <LoginForm
        onSubmit={handleLogin}
        isLoading={isLoading}
        errorMessage={errorMessage}
      />
      <p className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
        Don't have an account?{" "}
        <a
          href="/signup"
          className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
        >
          Sign up here
        </a>
      </p>
    </div>
  );
};

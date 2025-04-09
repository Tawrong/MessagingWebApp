import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/useUser";
function LoginForm() {
  const [isLogin, setIsLogin] = useState(true); // Toggle between login and signup
  const navigate = useNavigate();
  const { setUser } = useUser();
  const apiUrl = import.meta.env.VITE_BACKEND_URL; // Use the environment variable for the backend URL
  const handleToggle = () => {
    setIsLogin(!isLogin);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    console.log("Backend URL:", apiUrl); // Log the backend URL for debugging
    const formData = new FormData(event.target as HTMLFormElement);
    const data = Object.fromEntries(formData.entries());

    try {
      if (isLogin) {
        // Handle login logic
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/auth/login`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: data.email,
              password: data.password,
            }),
          }
        );

        if (!response.ok) {
          const errorData = await response.json().catch(() => null);
          throw new Error(
            errorData?.message || "Login failed. Please check your credentials."
          );
        }

        const result = await response.json();
        console.log("Login successful:", result);

        // Set user data in context
        setUser(result.user);
        console.log("User data set in context:", result.user);
        // Navigate to the private chats page
        navigate("/PrivateChats");
      } else {
        // Handle signup logic
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/auth/register`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              id: data.id,
              username: data.username, // Include the username field
              name: data.name,
              email: data.email,
              password: data.password,
              avatar: data.avatar || undefined, // Optional avatar field
            }),
          }
        );

        if (!response.ok) {
          const errorData = await response.json().catch(() => null); // Handle non-JSON responses
          throw new Error(
            errorData?.message || "Signup failed. Please try again."
          );
        }

        const result = await response.json();
        console.log("Signup successful:", result);

        // Set user data in context
        setUser(result.user);

        // Automatically log in the user after signup
        navigate("/PrivateChats");
      }
    } catch (error) {
      console.error("Error:", error);
      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert("An unknown error occurred.");
      }
    }
    console.log("Form data submitted:", data); // Log the form data for debugging
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          {isLogin ? "Login" : "Sign Up"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                Name:
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}
          {!isLogin && (
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-700"
              >
                Username:
              </label>
              <input
                type="text"
                id="username"
                name="username"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email:
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password:
            </label>
            <input
              type="password"
              id="password"
              name="password"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          {!isLogin && (
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700"
              >
                Confirm Password:
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}
          <button
            type="submit"
            className="w-full py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {isLogin ? "Login" : "Sign Up"}
          </button>
        </form>
        <button
          onClick={handleToggle}
          className="w-full mt-4 text-sm text-blue-500 hover:underline"
        >
          {isLogin ? "Switch to Sign Up" : "Switch to Login"}
        </button>
      </div>
    </div>
  );
}

export default LoginForm;

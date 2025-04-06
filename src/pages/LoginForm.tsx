import { useState } from "react";
import { useNavigate } from "react-router-dom";

function LoginForm() {
  const [isLogin, setIsLogin] = useState(true); // Toggle between login and signup
  const navigate = useNavigate();

  const handleToggle = () => {
    setIsLogin(!isLogin);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (isLogin) {
      // Handle login logic
      console.log("Logging in...");
    } else {
      // Handle signup logic
      console.log("Signing up...");
    }
    navigate("/dashboard"); // Example navigation after submission
  };

  return (
    <div>
      <h2>{isLogin ? "Login" : "Sign Up"}</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">Email:</label>
          <input type="email" id="email" name="email" required />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input type="password" id="password" name="password" required />
        </div>
        {!isLogin && (
          <div>
            <label htmlFor="confirmPassword">Confirm Password:</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              required
            />
          </div>
        )}
        <button type="submit">{isLogin ? "Login" : "Sign Up"}</button>
      </form>
      <button onClick={handleToggle}>
        {isLogin ? "Switch to Sign Up" : "Switch to Login"}
      </button>
    </div>
  );
}

export default LoginForm;
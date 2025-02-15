import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { API_URL } from "../constants/apiEnum";
import Icon from "../assets/icons/music-player.png";
import { toast } from "react-toastify";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (e: any) => {
    e.preventDefault();

    const data = { email, password };

    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      if (response.ok) {
        localStorage.setItem("token", result.token);
        localStorage.setItem("userData", JSON.stringify(result.user));
        toast.success("Login successful!");
        setTimeout(() => {
          navigate("/", { replace: true });
        }, 500);
      } else {
        toast.error(result.message || "Login failed.");
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    }
  };

  return (
    <div className="bg-black h-screen flex flex-col items-center justify-center p-6">
      <div className="mb-6 text-center">
        <img src={Icon} alt="Music Player Logo" className="h-12 mx-auto mb-2" />
        <h1 className="text-3xl font-bold text-white">Music Player</h1>
      </div>
      <div className="w-full max-w-md p-8 bg-zinc-900 shadow-lg rounded-lg">
        <h2 className="text-2xl font-bold mb-6 text-white text-center">Login</h2>
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block mb-2 text-sm font-medium text-zinc-400"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-3 rounded-md bg-zinc-700 text-white"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="password"
              className="block mb-2 text-sm font-medium text-zinc-400"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full p-3 rounded-md bg-zinc-700 text-white"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded-md"
          >
            Login
          </button>
        </form>
        <div className="mt-4 text-center">
          <p className="text-base text-white">
            Don't have an account?{" "}
            <Link to="/signup" replace className="text-blue-500">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;

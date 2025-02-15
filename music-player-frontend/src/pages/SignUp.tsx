import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../constants/apiEnum";
import Icon from "../assets/icons/music-player.png";

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  const handleSignUp = async (e: any) => {
    e.preventDefault();

    if (password != confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    const data = { email, username, password };

    try {
      const response = await fetch(`${API_URL}/auth/signUp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      console.log("result", result);
      console.log("response", response);

      if (response.ok) {
        setMessage("SignUp Successful!");
        setTimeout(() => {
          navigate("/login");
        }, 500);
      } else {
        setMessage(result.message || "Signup failed.");
      }
    } catch (error) {
      setMessage("An error occurred. Please try again.");
    }
  };

  return (
    <div className="bg-black h-screen flex flex-col items-center justify-center p-6">
      <div className="mb-6 text-center">
        <img src={Icon} alt="Music Player Logo" className="h-12 mx-auto mb-2" />
        <h1 className="text-3xl font-bold text-white">Music Player</h1>
      </div>
      <div className="w-full max-w-md p-8 bg-zinc-900 shadow-lg rounded-lg">
        <h2 className="text-2xl font-bold mb-6 text-white text-center">Sign Up</h2>
        <form onSubmit={handleSignUp}>
          <div className="mb-4">
            <label
              htmlFor="username"
              className="block mb-1 text-sm font-medium text-zinc-400"
            >
              Username
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full p-3 rounded-md bg-zinc-700 text-white"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="username"
              className="block mb-1 text-sm font-medium text-zinc-400"
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
              htmlFor="username"
              className="block mb-1 text-sm font-medium text-zinc-400"
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
          <div className="mb-4">
            <label
              htmlFor="username"
              className="block mb-1 text-sm font-medium text-zinc-400"
            >
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full p-3 rounded-md bg-zinc-700 text-white"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded-md"
          >
            Sign Up
          </button>
        </form>
        {message && (
          <p className="mt-4 text-center text-sm text-zinc-300">{message}</p>
        )}
        <div className="mt-4 text-center">
          <p className="text-white">
            Already have an account?{" "}
            <button
              onClick={() => navigate("/login")}
              className="text-blue-500"
            >
              Login
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;

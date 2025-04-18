import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { API_URL } from "../constants/apiEnum";
import Icon from "../assets/icons/music-player.png";
import { toast } from "react-toastify";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../../firebase";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      console.log("User info:", user);
  
      // Get the Firebase ID token
      const idToken = await user.getIdToken();
  
      // Send this token to your backend for verification and login
      const response = await fetch(`${API_URL}/auth/login-google`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ idToken }), // Send ID token to backend
      });
  
      const data = await response.json();
  
      if (response.ok) {
        // Save the JWT token and user data to localStorage
        localStorage.setItem("token", data.token);
        localStorage.setItem("userData", JSON.stringify(data.user));
        toast.success("Google login successful!");
        
        // Redirect to home or wherever needed
        setTimeout(() => {
          navigate("/", { replace: true });
        }, 500);
      } else {
        toast.error(data.message || "Google login failed.");
      }
    } catch (error) {
      console.error("Google Sign-In Error", error);
      toast.error("An error occurred with Google login.");
    }
  };

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
        <h2 className="text-2xl font-bold mb-6 text-white text-center">
          Login
        </h2>
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
            <Link
              to="/signup"
              replace
              className="text-blue-500 hover:underline"
            >
              Sign Up
            </Link>
          </p>
        </div>

        <div className="my-6 flex items-center gap-4">
          <div className="flex-grow h-px bg-zinc-700" />
          <span className="text-zinc-400 text-sm">or</span>
          <div className="flex-grow h-px bg-zinc-700" />
        </div>

        <div>
          <button
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-3 border border-zinc-600 rounded-md py-2 hover:bg-zinc-800 transition-colors duration-300"
          >
            <img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              alt="Google logo"
              className="w-5 h-5"
            />
            <span className="text-white font-medium">Continue with Google</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;

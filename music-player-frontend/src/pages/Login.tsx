import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { API_URL } from "../constants/apiEnum";
import Icon from "../assets/icons/music-player.png";
import { toast } from "react-toastify";
import { FaEnvelope, FaLock, FaGoogle, FaApple } from "react-icons/fa";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

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
        setIsLoading(false);
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-900 to-black flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-zinc-800/30 backdrop-blur-md shadow-2xl rounded-2xl overflow-hidden border border-zinc-700/30">
        <div className="p-8">
          <div className="mb-8 text-center">
            <img src={Icon} alt="Harmony Music" className="h-16 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-white font-poppins">
              Welcome to <span className="text-blue-400">Harmony</span>
            </h1>
            <p className="text-zinc-400 mt-2">Sign in to continue</p>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label
                htmlFor="email"
                className="block mb-2 text-sm font-medium text-zinc-300"
              >
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-zinc-500">
                  <FaEnvelope />
                </div>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="Enter your email"
                  className="w-full pl-10 pr-4 py-3 bg-zinc-800/70 border border-zinc-700 focus:border-blue-400 focus:ring-1 focus:ring-blue-400 text-white rounded-lg outline-none transition duration-200"
                />
              </div>
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-2">
                <label
                  htmlFor="password"
                  className="text-sm font-medium text-zinc-300"
                >
                  Password
                </label>
                <Link
                  to="/forgot-password"
                  className="text-xs text-blue-400 hover:text-blue-300 transition-colors duration-200"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-zinc-500">
                  <FaLock />
                </div>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 bg-zinc-800/70 border border-zinc-700 focus:border-blue-400 focus:ring-1 focus:ring-blue-400 text-white rounded-lg outline-none transition duration-200"
                />
              </div>
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="remember"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 text-blue-500 border-zinc-600 rounded focus:ring-blue-400 focus:ring-opacity-25 bg-zinc-800"
              />
              <label
                htmlFor="remember"
                className="ml-2 text-sm text-zinc-400"
              >
                Remember me
              </label>
            </div>
            
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 px-4 text-white font-medium rounded-lg transition duration-200 relative overflow-hidden ${
                isLoading 
                  ? "bg-blue-600 cursor-not-allowed opacity-80" 
                  : "bg-blue-500 hover:bg-blue-600"
              }`}
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing in...
                </span>
              ) : (
                "Sign in"
              )}
            </button>
            
            <div className="relative flex items-center justify-center my-4">
              <div className="flex-grow border-t border-zinc-700"></div>
              <span className="flex-shrink mx-4 text-xs text-zinc-500">OR CONTINUE WITH</span>
              <div className="flex-grow border-t border-zinc-700"></div>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                className="flex items-center justify-center gap-2 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg border border-zinc-700 transition duration-200"
              >
                <FaGoogle className="text-red-500" />
                <span className="text-sm">Google</span>
              </button>
              <button
                type="button"
                className="flex items-center justify-center gap-2 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg border border-zinc-700 transition duration-200"
              >
                <FaApple className="text-white" />
                <span className="text-sm">Apple</span>
              </button>
            </div>
          </form>
          
          <div className="mt-8 text-center">
            <p className="text-sm text-zinc-400">
              Don't have an account?{" "}
              <Link
                to="/signup"
                replace
                className="text-blue-400 hover:text-blue-300 transition-colors duration-200 font-medium"
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

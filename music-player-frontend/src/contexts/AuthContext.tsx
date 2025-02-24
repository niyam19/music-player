// src/context/AuthContext.js
import { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

interface AuthContextType {
    isAuthenticated: boolean;
    setIsAuthenticated: (auth: boolean) => void;
    logout: () => void;
    fetchWithAuth: (url: string, options?: any) => any;
}
  

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem("token"));
  const navigate = useNavigate();

  // Function to logout user
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    setIsAuthenticated(false);
    navigate("/login");
  };

  // Centralized API fetch with method support
  const fetchWithAuth = async (url: any, { method = "GET", body = null, headers = {} } = {}) => {
    const token = localStorage.getItem("token");

    const response = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
        ...headers, // Allow additional headers
      },
      body: body ? JSON.stringify(body) : null, // Convert body to JSON if provided
    });

    if (response.status === 401) {
      logout(); // Auto logout on 401
      throw new Error("Unauthorized - Auto logged out");
    }

    return response;
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated, logout, fetchWithAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};

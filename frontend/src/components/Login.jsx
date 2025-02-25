import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("User"); // Default role: User
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "email") setEmail(value);
    if (name === "password") setPassword(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let endpoint = "";

    // Determine API endpoint based on role selection
    if (role === "User") {
      endpoint = "http://localhost:5000/api/auth/login";
    } else if (role === "Instructor") {
      endpoint = "http://localhost:5000/api/instructors/login";
    } else if (role === "Admin") {
      endpoint = "http://localhost:5000/api/admin/login";
    }

    try {
      const response = await axios.post(endpoint, { email, password });

      console.log("Login Success:", response.data);
      
      if (response.data.token) {
        // Store authentication data
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("userRole", role); // Important: this is checked in ProtectedRoute
        
        // Store user data based on role
        if (role === "User") {
          localStorage.setItem("user", JSON.stringify(response.data.user));
        } else if (role === "Instructor") {
          localStorage.setItem("instructor", JSON.stringify(response.data.instructor));
        } else if (role === "Admin") {
          localStorage.setItem("admin", JSON.stringify(response.data.admin));
        }
        
        // Show success message
        alert("Login successful!");
        
        // Redirect based on role
        if (role === "User") navigate("/home");
        else if (role === "Instructor") navigate("/instructor");
        else if (role === "Admin") navigate("/admin");
      }
    } catch (error) {
      console.error("Login Error:", error.response?.data || error.message);
      alert("Invalid email or password. Please try again.");
    }
  };

  return (
    <section className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold text-center text-gray-700 mb-6">Login</h2>

        {/* Role Selection */}
        <div className="mb-4 flex justify-center space-x-4">
          {["User", "Instructor", "Admin"].map((type) => (
            <button
              key={type}
              className={`px-4 py-2 rounded-lg ${
                role === type ? "bg-blue-600 text-white" : "bg-gray-200"
              }`}
              onClick={() => setRole(type)}
              type="button"
            >
              {type}
            </button>
          ))}
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-600 text-sm font-medium">Email</label>
            <input
              type="email"
              name="email"
              value={email}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-600 text-sm font-medium">Password</label>
            <input
              type="password"
              name="password"
              value={password}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition"
          >
            Login
          </button>
        </form>

        {/* Conditionally Render Sign Up Link */}
        {role !== "Admin" && (
          <p className="text-center text-gray-600 mt-4">
            Don't have an account?{" "}
            <a href="/signup" className="text-blue-600 hover:underline">
              Create a New Account
            </a>
          </p>
        )}
      </div>
    </section>
  );
}
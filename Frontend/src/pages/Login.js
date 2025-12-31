import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
function Login() {
  const [role, setRole] = useState("user");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    role === "admin" ? navigate("/admin") : navigate("/user");
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form
        onSubmit={handleLogin}
        className="w-full max-w-md bg-white p-10 rounded-2xl
        border border-gray-200 shadow-md">
        {/* Title */}
        <h2 className="text-4xl font-extrabold text-center text-orange-600">
          FireVision
        </h2>
        <p className="text-center text-gray-500 mt-2 mb-6">
          Login to continue
        </p>
        {/* Email */}
        <input
          type="email"
          placeholder="Email address"
          required
          className="w-full p-3 mb-4 rounded-lg
          border border-gray-300
          focus:outline-none focus:ring-2
          focus:ring-orange-600"/>

        {/* Password */}
        <input
          type="password"
          placeholder="Password"
          required
          className="w-full p-3 mb-6 rounded-lg
          border border-gray-300
          focus:outline-none focus:ring-2
          focus:ring-orange-600"/>

        {/* Button – SAME AS ADMIN DASHBOARD */}
        <button
          type="submit"
          className="w-full py-3 rounded-lg
          bg-orange-600 hover:bg-orange-700
          text-white font-semibold text-lg
          transition shadow-md">
          Login
        </button>

        {/* Footer */}
        <p className="text-sm text-center mt-6 text-gray-600">
          Don’t have an account?{" "}
          <Link
            to="/register"
            className="text-orange-600 font-semibold hover:underline">
            Register
          </Link>
        </p>
      </form>
    </div>
  );
}
export default Login;

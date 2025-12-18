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
    <div
      className="min-h-screen flex items-center justify-center relative overflow-hidden
                 bg-gradient-to-br from-[#0b0b0b] via-[#140b05] to-[#1a0c05]"
    >
      {/*  Background glow */}
      <div className="absolute -top-40 -left-40 w-[600px] h-[600px]
                      bg-orange-500/20 rounded-full blur-[160px]" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px]
                      bg-red-500/20 rounded-full blur-[160px]" />

      {/*  Login Card */}
      <form
        onSubmit={handleLogin}
        className="relative z-10 w-full max-w-md p-10 rounded-2xl
                   bg-[#0f0f0f]/80 backdrop-blur-xl
                   border border-orange-500/20
                   shadow-[0_0_40px_rgba(255,90,0,0.35)]"
      >
        {/* Logo */}
        <h2
          className="text-4xl font-extrabold text-center
                     bg-gradient-to-r from-orange-400 to-red-500
                     bg-clip-text text-transparent
                     drop-shadow-[0_0_18px_rgba(255,120,0,0.6)]"
        >
          FireVision
        </h2>

        <p className="text-center text-slate-400 mt-2 mb-8">
          Login to continue
        </p>

        {/* Email */}
        <input
          type="email"
          placeholder="Email address"
          required
          className="w-full p-3 mb-4 rounded-lg
                     bg-[#141414] text-slate-200
                     border border-orange-500/20
                     placeholder-slate-500
                     focus:outline-none focus:ring-2
                     focus:ring-orange-500/50"
        />

        {/* Password */}
        <input
          type="password"
          placeholder="Password"
          required
          className="w-full p-3 mb-4 rounded-lg
                     bg-[#141414] text-slate-200
                     border border-orange-500/20
                     placeholder-slate-500
                     focus:outline-none focus:ring-2
                     focus:ring-orange-500/50"
        />

        {/* Button */}
        <button
          type="submit"
          className="w-full py-3 rounded-lg
                     bg-gradient-to-r from-orange-500 to-red-500
                     text-white font-semibold text-lg
                     shadow-[0_0_25px_rgba(255,90,0,0.7)]
                     hover:scale-[1.03]
                     hover:shadow-[0_0_45px_rgba(255,90,0,0.9)]
                     transition-all duration-300"
        >
          Login
        </button>

        {/* Footer */}
        <p className="text-sm text-center mt-6 text-slate-400">
          Don’t have an account?{" "}
          <Link
            to="/register"
            className="text-orange-400 font-semibold hover:text-orange-300"
          >
            Register
          </Link>
        </p>
      </form>
    </div>
  );
}

export default Login;

import React, { useState } from "react";
import { Link } from "react-router-dom";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

 
  const handleRegister = async (e) => {
  e.preventDefault();
  setError("");
  setMessage("");

  try {
    const res = await fetch("http://localhost:5000/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        email,
        password
      })
    });

    const data = await res.json();

    if (!data.success) {
      setError(data.message);
      return;
    }

    setMessage(" User registered successfully");

    setName("");
    setEmail("");
    setPassword("");

  } catch (err) {
    setError(" Server error. Please try again.");
  }
};
  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden
      bg-gradient-to-br from-[#0b0b0b] via-[#140b05] to-[#1a0c05]"
    >
      {/* Background glow */}
      <div className="absolute -top-40 -left-40 w-[600px] h-[600px]
        bg-orange-500/20 rounded-full blur-[160px]" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px]
        bg-red-500/20 rounded-full blur-[160px]" />

      <form
        onSubmit={handleRegister}
        className="relative z-10 w-full max-w-md p-10 rounded-2xl
        bg-[#0f0f0f]/80 backdrop-blur-xl
        border border-orange-500/20
        shadow-[0_0_40px_rgba(255,90,0,0.35)]"
      >
        <h2 className="text-4xl font-extrabold text-center
          bg-gradient-to-r from-orange-400 to-red-500
          bg-clip-text text-transparent">
          Create Account
        </h2>

        <p className="text-center text-slate-400 mt-2 mb-6">
          Join FireVision today
        </p>

        {/* Messages */}
        {message && (
          <div className="mb-4 text-green-400 text-sm text-center">
            {message}
          </div>
        )}
        {error && (
          <div className="mb-4 text-red-400 text-sm text-center">
            {error}
          </div>
        )}

        <input
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full p-3 mb-4 rounded-lg
            bg-[#141414] text-slate-200
            border border-orange-500/20
            placeholder-slate-500
            focus:outline-none focus:ring-2
            focus:ring-orange-500/50"
        />

        <input
          type="email"
          placeholder="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full p-3 mb-4 rounded-lg
            bg-[#141414] text-slate-200
            border border-orange-500/20
            placeholder-slate-500
            focus:outline-none focus:ring-2
            focus:ring-orange-500/50"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full p-3 mb-6 rounded-lg
            bg-[#141414] text-slate-200
            border border-orange-500/20
            placeholder-slate-500
            focus:outline-none focus:ring-2
            focus:ring-orange-500/50"
        />

        <button
          type="submit"
          className="w-full py-3 rounded-lg
            bg-gradient-to-r from-orange-500 to-red-500
            text-white font-semibold text-lg
            shadow-[0_0_25px_rgba(255,90,0,0.7)]
            hover:scale-[1.03]
            transition-all duration-300"
        >
          Register
        </button>

        <p className="text-sm text-center mt-6 text-slate-400">
          Already have an account?{" "}
          <Link
            to="/"
            className="text-orange-400 font-semibold hover:text-orange-300"
          >
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}

export default Register;

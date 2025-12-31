import React, { useState } from "react";
import { Link } from "react-router-dom";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
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
          phone,
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
      setPhone("");
      setPassword("");

    } catch (err) {
      setError(" Server error. Please try again.");
    }
  };

  return (
  <div className="min-h-screen flex items-center justify-center bg-gray-100">
    <form
      onSubmit={handleRegister}
      className="w-full max-w-md bg-white p-8 rounded-lg shadow-md border border-gray-200">
      {/* Header */}
      <h2 className="text-4xl font-extrabold text-center text-orange-600">
        Create Account
      </h2>
      <p className="text-center text-gray-500 mt-2 mb-6">
        FireVision User Registration
      </p>

      {/* Messages */}
      {message && (
        <div className="mb-4 text-green-600 text-sm text-center">
          {message}
        </div>
      )}
      {error && (
        <div className="mb-4 text-red-600 text-sm text-center">
          {error}
        </div>
      )}

      {/* Inputs */}
      <input
        type="text"
        placeholder="Full Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
        className="w-full p-3 mb-4 rounded-lg border border-gray-300
        focus:outline-none focus:ring-2 focus:ring-orange-500"/>
      <input
        type="email"
        placeholder="Email Address"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        className="w-full p-3 mb-4 rounded-lg border border-gray-300
        focus:outline-none focus:ring-2 focus:ring-orange-500"/>
      <input
        type="tel"
        placeholder="Phone Number"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        pattern="[0-9]{10}"
        required
        className="w-full p-3 mb-4 rounded-lg border border-gray-300
        focus:outline-none focus:ring-2 focus:ring-orange-500"/>
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        className="w-full p-3 mb-6 rounded-lg border border-gray-300
        focus:outline-none focus:ring-2 focus:ring-orange-500"/>

      {/* Button – SAME AS DASHBOARD */}
      <button
        type="submit"
        className="w-full flex items-center justify-center gap-2
        bg-orange-600 hover:bg-orange-700
        text-white px-4 py-3 rounded-lg font-semibold
        transition shadow-md">
        Register
      </button>

      {/* Footer */}
      <p className="text-sm text-center mt-6 text-gray-600">
        Already have an account?{" "}
        <Link
          to="/"
          className="text-orange-600 font-semibold hover:underline">
          Login
        </Link>
      </p>
    </form>
  </div>
);
}
export default Register;

import React from "react";
import { useNavigate } from "react-router-dom";
function Navbar() {
  const navigate = useNavigate();
  return (
    <div
      className="
        relative h-16 flex items-center justify-between px-10
        bg-white
        border-b border-orange-300
        shadow-md
      "
    >
      {/* Title */}
      <span className="text-gray-500 font-medium tracking-wide text-sm">
        User Dashboard
      </span>

      {/* Logout Button */}
      <button
        onClick={() => navigate("/")}
        className="
          px-6 py-2 rounded-full
          bg-gradient-to-r from-orange-500 to-orange-600
          text-white font-semibold
          shadow-md
          hover:scale-105
          hover:shadow-lg
          transition-all duration-300
        "
      >
        Logout
      </button>
    </div>
  );
}
export default Navbar;

 import React from "react";
import { useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  return (
    <div className="
      relative h-16 flex items-center justify-between px-10
      bg-gradient-to-r from-[#0f0f0f] via-[#141414] to-[#1a0c05]
      backdrop-blur-md
      border-b border-orange-500/20
      shadow-[0_10px_30px_rgba(255,90,0,0.15)]
    ">

      {/*  Ambient fire glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute left-1/4 top-0 w-1/2 h-full
          bg-gradient-to-r from-transparent via-orange-500/10 to-transparent
          blur-2xl" />
      </div>

      {/* Title */}
      <span className="relative z-10 text-slate-300 tracking-wide text-sm">
        User Dashboard
      </span>

      {/* Logout Button */}
      <button
        onClick={() => navigate("/")}
        className="
          relative z-10 px-7 py-2 rounded-full
          bg-gradient-to-r from-orange-500 via-orange-600 to-red-600
          text-white font-semibold
          shadow-[0_0_35px_rgba(255,90,0,0.85)]
          hover:scale-105
          hover:shadow-[0_0_55px_rgba(255,90,0,1)]
          transition-all duration-300
        "
      >
        Logout
      </button>
    </div>
  );
}

export default Navbar;
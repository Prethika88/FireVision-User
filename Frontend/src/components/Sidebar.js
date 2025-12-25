import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const menu = [
    { text: "Fire Safety Chatbot", path: "/chatbot" },
    { text: "My Area Fire Risk Monitor", path: "/fire-risk" },
    { text: "Safe Route Finder", path: "/safe-route" },
      //  NEW FEATURES
  { text: "Community Fire Reports", path: "/community-reports" },
  { text: "Fire Incident Report", path: "/incident-report" },
  ];

  return (
    <aside
      className="
        w-64 min-h-screen relative
        bg-gradient-to-br from-[#0f0f0f] via-[#141414] to-[#1a0c05]
        border-r border-orange-500/20
      "
    >
      {/*  Vertical fire spine */}
      <div
        className="absolute inset-y-0 left-0 w-[3px]
        bg-gradient-to-b from-orange-400 via-red-500 to-orange-600
        shadow-[0_0_18px_rgba(255,90,0,0.7)]"
      />

      {/*  Ambient fire glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 -left-28 w-56 h-56
          bg-orange-500/15 blur-[120px]" />
        <div className="absolute bottom-40 -left-28 w-56 h-56
          bg-red-500/15 blur-[140px]" />
      </div>

      <div className="relative z-10 flex flex-col h-full">

        {/*  FireVision Title */}
        <div className="px-5 py-4 flex flex-col items-center">
          <h1
            className="text-xl font-semibold text-center
            bg-gradient-to-r from-orange-400 to-red-500
            bg-clip-text text-transparent"
          >
            FireVision
          </h1>

          <div className="mt-3 h-px w-16 bg-orange-500/30 rounded-full" />
        </div>

        {/*  Menu (TEXT ONLY – NO ICONS) */}
        <ul className="flex-1 px-4 py-6 space-y-3">
          {menu.map((item, i) => {
            const active = location.pathname === item.path;

            return (
              <li
                key={i}
                onClick={() => navigate(item.path)}
                className={`
                  px-4 py-3 rounded-lg
                  cursor-pointer transition-all duration-300
                  ${active
                    ? "bg-orange-500/15 border border-orange-500/40 shadow-[0_0_14px_rgba(255,90,0,0.4)]"
                    : "hover:bg-orange-500/10"}
                `}
              >
                <span
                  className={`
                    text-[15px] font-medium tracking-wide
                    ${active ? "text-orange-300" : "text-slate-300"}
                  `}
                >
                  {item.text}
                </span>
              </li>
            );
          })}
        </ul>

        {/*  Footer */}
        <div
          className="px-5 py-4 text-[11px] text-slate-400
          border-t border-orange-500/20"
        >
          © 2025 FireVision AI
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;

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
    bg-white
    border-r border-orange-300
  "
>
      <div className="relative z-10 flex flex-col h-full">

        {/*  FireVision Title */}
        <div className="px-5 py-4 flex flex-col items-center">
          <h1
        className="text-xl font-semibold text-center text-orange-500">
            FireVision
          </h1>
          <div className="mt-3 h-[2px] w-16 bg-orange-500 rounded-full" />
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
      ? "bg-orange-100 border border-orange-300"
      : "hover:bg-orange-50"}
  `}
>
  <span
    className={`
      text-[15px] tracking-wide
      ${active ? "text-orange-600 font-semibold" : "text-gray-800"}
    `}
  >
    {item.text}
  </span>
</li>
            );
          })}
        </ul>

        {/*  Footer */}
        <div className="px-5 py-4 text-[11px] text-gray-500 border-t border-orange-200">
  © 2025 FireVision AI
</div>
      </div>
    </aside>
  );
}

export default Sidebar;

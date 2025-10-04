// Sidebar.tsx
import React from "react";
import {
  HomeIcon,
  Squares2X2Icon,
  RectangleGroupIcon,
  ChartBarIcon,
  Cog6ToothIcon,
} from "@heroicons/react/24/outline";

type NavItem = {
  name: string;
  icon: React.ElementType;
  active?: boolean;
};

const navItems: NavItem[] = [
  { name: "Dashboard", icon: HomeIcon, active: true },
  { name: "Library", icon: Squares2X2Icon },
  { name: "Templates", icon: RectangleGroupIcon },
  { name: "Analytics", icon: ChartBarIcon },
  { name: "Settings", icon: Cog6ToothIcon },
];

export const Sidebar: React.FC = () => {
  return (
    <div className="sticky left-0 top-0 h-screen w-60 bg-white flex flex-col p-4">
      {/* App Header */}
      <div className="flex items-center space-x-2 mb-8">
        <div className="h-8 w-8 bg-purple-600 rounded flex items-center justify-center text-white font-bold">
          AI
        </div>
        <div>
          <h1 className="text-sm font-semibold">AutoClip Farm</h1>
          <p className="text-xs text-gray-500">AI Video Clip Generator</p>
        </div>
      </div>

      <div className="flex items-center text-sm text-gray-600 mb-6">
        <span className="h-2 w-2 bg-green-500 rounded-full mr-2"></span>
        Connected
      </div>

      <nav className="flex flex-col space-y-1">
        {navItems.map((item) => (
          <a
            key={item.name}
            href="#"
            className={`flex items-center px-3 py-2 rounded text-sm font-medium transition 
              ${
                item.active
                  ? "bg-purple-600 text-white"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
          >
            <item.icon className="h-5 w-5 mr-3" />
            {item.name}
          </a>
        ))}
      </nav>
    </div>
  );
};

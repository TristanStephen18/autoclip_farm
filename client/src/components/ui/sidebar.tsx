import React, { useState } from "react";
import {
  HomeIcon,
  Squares2X2Icon,
  RectangleGroupIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  Bars3Icon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { MdVideocam } from "react-icons/md";

type NavItem = {
  name: string;
  icon: React.ElementType;
};

const navItems: NavItem[] = [
  { name: "Dashboard", icon: HomeIcon },
  { name: "Library", icon: Squares2X2Icon },
  { name: "Templates", icon: RectangleGroupIcon },
  { name: "Analytics", icon: ChartBarIcon },
  { name: "Settings", icon: Cog6ToothIcon },
];

type SidebarProps = {
  activePage: string;
  onNavigate: (page: string) => void;
};

export const Sidebar: React.FC<SidebarProps> = ({ activePage, onNavigate }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile Top Bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 bg-white shadow-sm z-40 flex items-center justify-between p-4">
        <div className="flex items-center gap-2">
          <div className="bg-blue-500 p-2 rounded-lg">
            <MdVideocam className="text-white text-lg" />
          </div>
          <span className="text-sm font-semibold">AutoClip Farm</span>
        </div>
        <button onClick={() => setIsOpen(!isOpen)} className="text-gray-700">
          {isOpen ? <XMarkIcon className="w-6 h-6" /> : <Bars3Icon className="w-6 h-6" />}
        </button>
      </div>

      {/* Overlay (mobile only) */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed md:sticky left-0 top-0 h-screen bg-white flex flex-col p-4
          border-r border-gray-200 shadow-sm z-50
          transform transition-transform duration-300 ease-in-out
          w-56 sm:w-60
          ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
      >
        {/* Logo */}
        <div className="flex items-center space-x-2 mb-8 mt-2">
          <div className="bg-blue-500 p-2 rounded-lg shadow-sm inline-flex items-center justify-center">
            <MdVideocam className="text-white text-lg" />
          </div>
          <div>
            <h1 className="text-sm font-semibold">AutoClip Farm</h1>
            <p className="text-xs text-gray-500">AI Video Clip Generator</p>
          </div>
        </div>

        {/* Status */}
        <div className="flex items-center text-sm text-gray-600 mb-6">
          <span className="h-2 w-2 bg-green-500 rounded-full mr-2"></span>
          Connected
        </div>

        {/* Navigation */}
        <nav className="flex flex-col space-y-1">
          {navItems.map((item) => {
            const isActive = activePage === item.name;
            return (
              <button
                key={item.name}
                onClick={() => {
                  onNavigate(item.name);
                  setIsOpen(false); // Close sidebar on mobile
                }}
                className={`flex items-center w-full text-left px-3 py-2 rounded text-sm font-medium transition ${
                  isActive
                    ? "bg-purple-600 text-white"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <item.icon className="h-5 w-5 mr-3" />
                {item.name}
              </button>
            );
          })}
        </nav>
      </aside>
    </>
  );
};

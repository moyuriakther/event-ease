"use client";
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import {logoutUser} from "../store/actions/logoutUser"

export default function DashboardDrawer({ children }) {
    const [mounted, setMounted] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const router = useRouter();

    useEffect(() => {
        setMounted(true);
    }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  const handleLogOut = () => {
    logoutUser(router);
  };
  if (!mounted) return null;

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Mobile Sidebar Toggle Button */}
      <button
        onClick={toggleSidebar}
        className="absolute z-20 p-2 text-white bg-blue-500 rounded md:hidden top-4 left-4"
      >
        ☰
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-10 w-64 bg-white shadow-md transform transition-transform duration-300 md:relative md:translate-x-0 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="text-lg font-bold text-center border-b text-gray-700">Welcome to Dashboard</div>
        <nav className="flex flex-col mt-4 space-y-2">
          <Link href="/dashboard" className="px-4 py-2 text-gray-700 hover:bg-gray-200">
            Events
          </Link>
          <Link href="/dashboard/create-event" className="px-4 py-2 text-gray-700 hover:bg-gray-200">
            Create Event
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 md:ml-0">
        {/* Header */}
        <header className="flex items-center justify-between p-4 bg-white shadow md:ml-0">
          <h1 className="text-gray-700 text-xl font-semibold"></h1>
          <button href="/login" className="px-4 py-2 text-sm text-white bg-blue-500 rounded hover:bg-blue-600" onClick={handleLogOut}>
            Logout
          </button>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-auto p-4 md:p-6">{children}</main>
      </div>

      {/* Overlay for Sidebar on Mobile */}
      {isSidebarOpen && (
        <div
          onClick={toggleSidebar}
          className="fixed inset-0 z-10 bg-black bg-opacity-50 md:hidden"
        ></div>
      )}
    </div>
  );
}

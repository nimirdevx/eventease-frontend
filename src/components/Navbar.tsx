"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAuth } from "../context/AuthContext";
import { useNotifications } from "../context/NotificationContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const { notifications } = useNotifications();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  return (
    <nav className="bg-white shadow-lg border-b border-gray-100 sticky top-0 z-50">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-2xl">🎉</span>
            <span className="font-bold text-xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              EventEase
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link
              href="/events"
              className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
            >
              Events
            </Link>

            {user ? (
              <>
                <Link
                  href="/tickets"
                  className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
                >
                  My Tickets
                </Link>

                <Link
                  href="/notifications"
                  className="relative text-gray-700 hover:text-blue-600 transition-colors font-medium"
                >
                  <span>Notifications</span>
                  {unreadCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {unreadCount}
                    </span>
                  )}
                </Link>

                {user.role === "organizer" && (
                  <Link
                    href="/organizer/events"
                    className="text-gray-700 hover:text-purple-600 transition-colors font-medium"
                  >
                    Organizer
                  </Link>
                )}

                {user.role === "admin" && (
                  <Link
                    href="/admin/users"
                    className="text-gray-700 hover:text-green-600 transition-colors font-medium"
                  >
                    Admin
                  </Link>
                )}

                {/* User Menu */}
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-semibold">
                        {user.name?.charAt(0).toUpperCase() ||
                          user.email.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <span className="text-gray-700 font-medium">
                      {user.name || user.email.split("@")[0]}
                    </span>
                  </div>
                  <button
                    onClick={logout}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium transition-colors"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  href="/auth/login"
                  className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
                >
                  Sign In
                </Link>
                <Link
                  href="/auth/register"
                  className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-2 rounded-lg font-medium hover:shadow-md transition-all duration-200"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-gray-700 hover:text-blue-600 transition-colors"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-100 py-4">
            <div className="flex flex-col space-y-3">
              <Link
                href="/events"
                className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
              >
                Events
              </Link>

              {user ? (
                <>
                  <Link
                    href="/tickets"
                    className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
                  >
                    My Tickets
                  </Link>

                  <Link
                    href="/notifications"
                    className="flex items-center text-gray-700 hover:text-blue-600 transition-colors font-medium"
                  >
                    <span>Notifications</span>
                    {unreadCount > 0 && (
                      <span className="ml-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {unreadCount}
                      </span>
                    )}
                  </Link>

                  {user.role === "organizer" && (
                    <Link
                      href="/organizer/events"
                      className="text-gray-700 hover:text-purple-600 transition-colors font-medium"
                    >
                      Organizer Dashboard
                    </Link>
                  )}

                  {user.role === "admin" && (
                    <Link
                      href="/admin/users"
                      className="text-gray-700 hover:text-green-600 transition-colors font-medium"
                    >
                      Admin Dashboard
                    </Link>
                  )}

                  <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-semibold">
                          {user.name?.charAt(0).toUpperCase() ||
                            user.email.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <span className="text-gray-700 font-medium">
                        {user.name || user.email.split("@")[0]}
                      </span>
                    </div>
                    <button
                      onClick={logout}
                      className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium transition-colors"
                    >
                      Logout
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <Link
                    href="/auth/login"
                    className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/auth/register"
                    className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-2 rounded-lg font-medium text-center hover:shadow-md transition-all duration-200"
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

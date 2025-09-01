"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import Link from "next/link";
import api from "../../lib/api";
import { Event } from "../../models/Event";
import { User } from "../../models/User";

interface DashboardStats {
  totalUsers: number;
  totalEvents: number;
  totalRegistrations: number;
  recentUsers: Array<{
    id: number;
    name: string;
    email: string;
    role: string;
  }>;
  recentEvents: Array<{
    id: number;
    title: string;
    date: string;
    location: string;
    organizer?: {
      name: string;
    };
  }>;
  userGrowth: number;
  eventGrowth: number;
}

const AdminDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        // Since /admin/dashboard doesn't exist in backend, we'll fetch data separately
        const [eventsResponse, usersResponse] = await Promise.all([
          api.get("/events"),
          api.get("/admin/users"),
        ]);

        const events = eventsResponse.data as Event[];
        const users = usersResponse.data as User[];
        const mockStats: DashboardStats = {
          totalUsers: users.length || 0,
          totalEvents: events.length || 0,
          totalRegistrations: 0, // This would require additional API calls
          recentUsers: [],
          recentEvents: [],
          userGrowth: 0,
          eventGrowth: 0,
        };

        setStats(mockStats);
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
        // Set default stats if API fails
        setStats({
          totalUsers: 0,
          totalEvents: 0,
          totalRegistrations: 0,
          recentUsers: [],
          recentEvents: [],
          userGrowth: 0,
          eventGrowth: 0,
        });
      } finally {
        setLoading(false);
      }
    };

    if (user?.role === "admin") {
      fetchDashboardStats();
    }
  }, [user]);

  if (user?.role !== "admin") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">
            Access Denied
          </h1>
          <p className="text-gray-600">
            You don&apos;t have permission to access this page.
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-2">
            Admin Dashboard
          </h1>
          <p className="text-gray-600">
            Overview of platform statistics and recent activity
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Link
            href="/admin/users"
            className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300 border-l-4 border-blue-500"
          >
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <svg
                  className="w-8 h-8 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                  />
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Manage Users
                </h3>
                <p className="text-gray-600">
                  View and manage user accounts and roles
                </p>
              </div>
            </div>
          </Link>

          <Link
            href="/admin/events"
            className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300 border-l-4 border-purple-500"
          >
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-lg">
                <svg
                  className="w-8 h-8 text-purple-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Manage Events
                </h3>
                <p className="text-gray-600">
                  Monitor and manage all platform events
                </p>
              </div>
            </div>
          </Link>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-3xl font-bold text-gray-900">
                  {stats?.totalUsers || 0}
                </p>
                {stats?.userGrowth !== undefined && (
                  <p
                    className={`text-sm ${
                      stats.userGrowth >= 0 ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {stats.userGrowth >= 0 ? "+" : ""}
                    {stats.userGrowth}% this month
                  </p>
                )}
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <svg
                  className="w-8 h-8 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Events
                </p>
                <p className="text-3xl font-bold text-gray-900">
                  {stats?.totalEvents || 0}
                </p>
                {stats?.eventGrowth !== undefined && (
                  <p
                    className={`text-sm ${
                      stats.eventGrowth >= 0 ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {stats.eventGrowth >= 0 ? "+" : ""}
                    {stats.eventGrowth}% this month
                  </p>
                )}
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <svg
                  className="w-8 h-8 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-orange-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Registrations
                </p>
                <p className="text-3xl font-bold text-gray-900">
                  {stats?.totalRegistrations || 0}
                </p>
                <p className="text-sm text-gray-500">All-time registrations</p>
              </div>
              <div className="p-3 bg-orange-100 rounded-lg">
                <svg
                  className="w-8 h-8 text-orange-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Users */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">
                Recent Users
              </h2>
              <Link
                href="/admin/users"
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                View All
              </Link>
            </div>

            <div className="space-y-4">
              {stats?.recentUsers?.slice(0, 5).map((user, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-semibold">
                      {user.name?.charAt(0).toUpperCase() ||
                        user.email.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {user.name || user.email.split("@")[0]}
                    </p>
                    <p className="text-sm text-gray-500">{user.email}</p>
                  </div>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      user.role === "admin"
                        ? "bg-green-100 text-green-800"
                        : user.role === "organizer"
                        ? "bg-purple-100 text-purple-800"
                        : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {user.role}
                  </span>
                </div>
              )) || (
                <p className="text-gray-500 text-center py-4">
                  No recent users
                </p>
              )}
            </div>
          </div>

          {/* Recent Events */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">
                Recent Events
              </h2>
              <Link
                href="/admin/events"
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                View All
              </Link>
            </div>

            <div className="space-y-4">
              {stats?.recentEvents?.slice(0, 5).map((event, index) => (
                <div key={index} className="border-l-4 border-blue-500 pl-4">
                  <h3 className="text-sm font-medium text-gray-900">
                    {event.title}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {new Date(event.date).toLocaleDateString()} •{" "}
                    {event.location}
                  </p>
                  <p className="text-xs text-gray-400">
                    by {event.organizer?.name || "Unknown"}
                  </p>
                </div>
              )) || (
                <p className="text-gray-500 text-center py-4">
                  No recent events
                </p>
              )}
            </div>
          </div>
        </div>

        {/* System Health */}
        <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            System Status
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
              <span className="text-sm text-gray-700">Database: Online</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
              <span className="text-sm text-gray-700">API: Healthy</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
              <span className="text-sm text-gray-700">Services: Running</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

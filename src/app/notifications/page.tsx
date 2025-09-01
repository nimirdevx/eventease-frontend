"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import NotificationList from "../../components/NotificationList";
import { useNotifications } from "../../context/NotificationContext";
import { useAuth } from "../../context/AuthContext";
import api from "@/lib/api";

export default function NotificationsPage() {
  const { setNotifications } = useNotifications();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      if (!user) return;

      try {
        const res = await api.get<
          import("@/models/Notification").Notification[]
        >("/interactions/notifications");
        setNotifications(res.data);
      } catch (error) {
        console.error("Failed to fetch notifications:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [setNotifications, user]);

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center">
        <div className="text-center">
          <span className="text-6xl mb-4 block">🔔</span>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            Please sign in
          </h3>
          <p className="text-gray-600 mb-4">
            You need to be logged in to view notifications.
          </p>
          <Link
            href="/auth/login"
            className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Notifications
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Stay updated with the latest news about your events and activities.
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="mt-4 text-gray-600">Loading notifications...</p>
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6">
                <h2 className="text-xl font-bold text-white flex items-center">
                  <span className="mr-2">🔔</span>
                  Your Notifications
                </h2>
              </div>
              <div className="p-6">
                <NotificationList />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

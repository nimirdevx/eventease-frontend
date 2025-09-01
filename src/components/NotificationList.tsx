"use client";

import React from "react";
import { useNotifications } from "../context/NotificationContext";

const NotificationList = () => {
  const { notifications, markRead, markUnread } = useNotifications();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (notifications.length === 0) {
    return (
      <div className="text-center py-8">
        <span className="text-4xl mb-4 block">📭</span>
        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          No notifications
        </h3>
        <p className="text-gray-600">
          You&apos;re all caught up! New notifications will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={`p-4 rounded-lg border transition-all duration-200 ${
            notification.is_read
              ? "bg-gray-50 border-gray-200"
              : "bg-blue-50 border-blue-200 shadow-sm"
          }`}
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center mb-2">
                <span className="mr-2">
                  {notification.is_read ? "📖" : "📩"}
                </span>
                <span className="text-xs text-gray-500">
                  {formatDate(notification.created_at)}
                </span>
                {!notification.is_read && (
                  <span className="ml-2 w-2 h-2 bg-blue-500 rounded-full"></span>
                )}
              </div>
              <h4
                className={`font-medium mb-1 ${
                  notification.is_read ? "text-gray-700" : "text-gray-900"
                }`}
              >
                {notification.title}
              </h4>
              <p
                className={`${
                  notification.is_read ? "text-gray-600" : "text-gray-800"
                }`}
              >
                {notification.message}
              </p>
            </div>

            <button
              onClick={() =>
                notification.is_read
                  ? markUnread(notification.id)
                  : markRead(notification.id)
              }
              className={`ml-4 px-3 py-1 rounded text-xs font-medium transition-colors ${
                notification.is_read
                  ? "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  : "bg-blue-100 text-blue-700 hover:bg-blue-200"
              }`}
            >
              {notification.is_read ? "Mark Unread" : "Mark Read"}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};
export default NotificationList;

import React from "react";
import Link from "next/link";
import { useAuth } from "../context/AuthContext";

const Sidebar = () => {
  const { user } = useAuth();
  if (!user) return null;
  return (
    <aside className="w-64 h-full bg-gray-50 p-4 border-r flex flex-col gap-2">
      <Link href="/dashboard">Dashboard</Link>
      <Link href="/events">Browse Events</Link>
      <Link href="/tickets">My Tickets</Link>
      <Link href="/notifications">Notifications</Link>
      {user.role === "organizer" && (
        <Link href="/organizer/events">Manage Events</Link>
      )}
      {user.role === "admin" && <Link href="/admin/users">Manage Users</Link>}
    </aside>
  );
};
export default Sidebar;

"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { Event } from "../../../models/Event";

export default function OrganizerEventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push("/auth/login");
      return;
    }

    if (user.role !== "organizer" && user.role !== "admin") {
      router.push("/events");
      return;
    }

    const fetchEvents = async () => {
      try {
        const res = await api.get<Event[]>("/events/my");
        setEvents(res.data);
      } catch (error) {
        console.error("Failed to fetch events:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [user, router]);

  const handleDeleteEvent = async (eventId: number) => {
    if (!confirm("Are you sure you want to delete this event?")) return;

    try {
      await api.delete(`/events/${eventId}`);
      setEvents(events.filter((event) => event.id !== eventId));
    } catch (error) {
      console.error("Failed to delete event:", error);
    }
  };

  if (!user || (user.role !== "organizer" && user.role !== "admin")) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-white">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-12">
          <div>
            <h1 className="text-4xl font-bold text-gray-800 mb-4">My Events</h1>
            <p className="text-lg text-gray-600">
              Manage your events, track attendance, and create new experiences.
            </p>
          </div>
          <Link
            href="/organizer/events/create"
            className="mt-4 md:mt-0 inline-block bg-gradient-to-r from-purple-600 to-purple-700 text-white px-8 py-3 rounded-lg font-semibold hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
          >
            + Create New Event
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">📅</span>
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-800">
                  {events.length}
                </p>
                <p className="text-gray-600">Total Events</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">👥</span>
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-800">
                  {events.reduce(
                    (total, event) => total + (event.attendees?.length || 0),
                    0
                  )}
                </p>
                <p className="text-gray-600">Total Attendees</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">✅</span>
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-800">
                  {
                    events.filter((event) => new Date(event.date) > new Date())
                      .length
                  }
                </p>
                <p className="text-gray-600">Upcoming Events</p>
              </div>
            </div>
          </div>
        </div>

        {/* Events List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
            <p className="mt-4 text-gray-600">Loading your events...</p>
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-12">
            <span className="text-6xl mb-4 block">🎪</span>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              No events yet
            </h3>
            <p className="text-gray-600 mb-6">
              Start creating amazing events for your audience!
            </p>
            <Link
              href="/organizer/events/create"
              className="inline-block bg-gradient-to-r from-purple-600 to-purple-700 text-white px-8 py-3 rounded-lg font-semibold hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
            >
              Create Your First Event
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {events.map((event) => (
              <OrganizerEventCard
                key={event.id}
                event={event}
                onDelete={handleDeleteEvent}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function OrganizerEventCard({
  event,
  onDelete,
}: {
  event: Event;
  onDelete: (id: number) => void;
}) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const isUpcoming = new Date(event.date) > new Date();

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
      <div className="p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="flex-1">
            <div className="flex items-center mb-2">
              <h3 className="text-xl font-bold text-gray-800 mr-3">
                {event.title}
              </h3>
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  isUpcoming
                    ? "bg-green-100 text-green-800"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                {isUpcoming ? "Upcoming" : "Past"}
              </span>
            </div>

            <p className="text-gray-600 mb-3 line-clamp-2">
              {event.description || "No description available"}
            </p>

            <div className="flex flex-wrap gap-4 text-sm text-gray-500">
              <div className="flex items-center">
                <span className="mr-1">📅</span>
                <span>{formatDate(event.date)}</span>
              </div>
              {event.location && (
                <div className="flex items-center">
                  <span className="mr-1">📍</span>
                  <span>{event.location}</span>
                </div>
              )}
              <div className="flex items-center">
                <span className="mr-1">👥</span>
                <span>{event.attendees?.length || 0} attendees</span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-3 mt-4 md:mt-0">
            <Link
              href={`/organizer/events/${event.id}/attendees`}
              className="bg-blue-100 text-blue-700 px-4 py-2 rounded-lg font-medium hover:bg-blue-200 transition-colors"
            >
              View Attendees
            </Link>
            <Link
              href={`/organizer/events/${event.id}/edit`}
              className="bg-purple-100 text-purple-700 px-4 py-2 rounded-lg font-medium hover:bg-purple-200 transition-colors"
            >
              Edit
            </Link>
            <button
              onClick={() => onDelete(event.id)}
              className="bg-red-100 text-red-700 px-4 py-2 rounded-lg font-medium hover:bg-red-200 transition-colors"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

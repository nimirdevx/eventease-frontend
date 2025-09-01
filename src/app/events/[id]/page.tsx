"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import api from "@/lib/api";
import { Event } from "../../../models/Event";
import { useAuth } from "@/context/AuthContext";

export default function EventDetailsPage() {
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState(false);
  const [registered, setRegistered] = useState(false);
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await api.get<Event>(`/events/${params.id}`);
        setEvent(res.data);
        // Check if user is already registered
        if (
          user &&
          res.data.attendees?.some((attendee) => attendee.id === user.id)
        ) {
          setRegistered(true);
        }
      } catch (error) {
        console.error("Failed to fetch event:", error);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchEvent();
    }
  }, [params.id, user]);

  const handleRegister = async () => {
    if (!user) {
      router.push("/auth/login");
      return;
    }

    setRegistering(true);
    try {
      await api.post(`/events/${params.id}/register`);
      setRegistered(true);
      // Refresh event data
      const res = await api.get<Event>(`/events/${params.id}`);
      setEvent(res.data);
    } catch (error) {
      console.error("Failed to register for event:", error);
    } finally {
      setRegistering(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading event details...</p>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center">
        <div className="text-center">
          <span className="text-6xl mb-4 block">😕</span>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            Event not found
          </h3>
          <p className="text-gray-600 mb-4">
            The event you&apos;re looking for doesn&apos;t exist.
          </p>
          <Link
            href="/events"
            className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Events
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <div className="container mx-auto px-6 py-8">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Link
            href="/events"
            className="text-blue-600 hover:text-blue-700 transition-colors"
          >
            ← Back to Events
          </Link>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Event Header */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
            {/* Hero Section */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-700 p-8 text-white">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div className="mb-4 md:mb-0">
                  <h1 className="text-3xl md:text-4xl font-bold mb-2">
                    {event.title}
                  </h1>
                  <div className="flex items-center text-blue-100">
                    <span className="mr-2">👥</span>
                    <span>
                      {event.attendees?.length || 0} people registered
                    </span>
                  </div>
                </div>

                {/* Registration Button */}
                <div className="flex flex-col items-end">
                  {registered ? (
                    <div className="bg-green-500 text-white px-6 py-3 rounded-lg font-semibold">
                      ✅ You&apos;re registered!
                    </div>
                  ) : (
                    <button
                      onClick={handleRegister}
                      disabled={registering}
                      className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50"
                    >
                      {registering ? "Registering..." : "Register Now"}
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Event Details */}
            <div className="p-8">
              <div className="grid md:grid-cols-2 gap-8">
                {/* Left Column */}
                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-4">
                    Event Details
                  </h3>

                  <div className="space-y-4">
                    <div className="flex items-start">
                      <span className="text-2xl mr-3">📅</span>
                      <div>
                        <p className="font-semibold text-gray-800">
                          Date & Time
                        </p>
                        <p className="text-gray-600">
                          {formatDate(event.date)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <span className="text-2xl mr-3">📍</span>
                      <div>
                        <p className="font-semibold text-gray-800">Location</p>
                        <p className="text-gray-600">{event.location}</p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <span className="text-2xl mr-3">👨‍💼</span>
                      <div>
                        <p className="font-semibold text-gray-800">Organizer</p>
                        <p className="text-gray-600">Event Organizer</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column */}
                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-4">
                    Description
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {event.description}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Actions */}
          <div className="mt-8 text-center">
            {registered && (
              <Link
                href="/tickets"
                className="inline-block bg-gradient-to-r from-green-600 to-green-700 text-white px-8 py-3 rounded-lg font-semibold hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
              >
                View My Tickets
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

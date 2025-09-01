"use client";

import React from "react";
import Link from "next/link";
import { Event } from "../models/Event";

interface Props {
  event: Event;
}

const EventCard: React.FC<Props> = ({ event }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 overflow-hidden">
      {/* Event Header */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-4">
        <div className="flex items-center justify-between text-white">
          <span className="text-sm font-medium bg-white/20 px-3 py-1 rounded-full">
            Event
          </span>
          <span className="text-sm">
            {event.attendees?.length || 0} attending
          </span>
        </div>
      </div>

      {/* Event Content */}
      <div className="p-6">
        <h3 className="font-bold text-xl text-gray-800 mb-2 line-clamp-2">
          {event.title}
        </h3>

        <p className="text-gray-600 mb-4 line-clamp-3">{event.description}</p>

        {/* Event Details */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-gray-500">
            <span className="mr-2">📅</span>
            <span>{formatDate(event.date)}</span>
          </div>
          <div className="flex items-center text-sm text-gray-500">
            <span className="mr-2">📍</span>
            <span>{event.location}</span>
          </div>
        </div>

        {/* Action Button */}
        <Link
          href={`/events/${event.id}`}
          className="block w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold py-3 px-4 rounded-lg text-center hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
        >
          View Details & Register
        </Link>
      </div>
    </div>
  );
};
export default EventCard;

"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import api from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { Ticket } from "../../models/Ticket";
import { Event } from "../../models/Event";

interface TicketWithEvent extends Ticket {
  event?: Event;
}

export default function TicketsPage() {
  const [tickets, setTickets] = useState<TicketWithEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchTickets = async () => {
      if (!user) return;

      try {
        const res = await api.get<TicketWithEvent[]>("/tickets/my"); // correct endpoint is auth/me/tickets
        setTickets(res.data);
      } catch (error) {
        console.error("Failed to fetch tickets:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, [user]);

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-white flex items-center justify-center">
        <div className="text-center">
          <span className="text-6xl mb-4 block">🔒</span>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            Please sign in
          </h3>
          <p className="text-gray-600 mb-4">
            You need to be logged in to view your tickets.
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
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">My Tickets</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Here are all your event tickets. Show these QR codes at the event
            entrance.
          </p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
            <p className="mt-4 text-gray-600">Loading your tickets...</p>
          </div>
        ) : tickets.length === 0 ? (
          <div className="text-center py-12">
            <span className="text-6xl mb-4 block">🎫</span>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              No tickets yet
            </h3>
            <p className="text-gray-600 mb-6">
              You haven&apos;t registered for any events yet. Browse events to
              get started!
            </p>
            <Link
              href="/events"
              className="inline-block bg-gradient-to-r from-green-600 to-green-700 text-white px-8 py-3 rounded-lg font-semibold hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
            >
              Browse Events
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tickets.map((ticket) => (
              <TicketCard key={ticket.id} ticket={ticket} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function TicketCard({ ticket }: { ticket: TicketWithEvent }) {
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

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
      {/* Ticket Header */}
      <div className="bg-gradient-to-r from-green-500 to-blue-600 p-4">
        <div className="flex items-center justify-between text-white">
          <span className="text-sm font-medium bg-white/20 px-3 py-1 rounded-full">
            🎫 Ticket
          </span>
          <span className="text-sm">Valid Entry</span>
        </div>
      </div>

      {/* Ticket Content */}
      <div className="p-6">
        <h3 className="font-bold text-lg text-gray-800 mb-2">
          {ticket.event?.title || "Event"}
        </h3>

        {ticket.event && (
          <div className="space-y-2 mb-4">
            <div className="flex items-center text-sm text-gray-500">
              <span className="mr-2">📅</span>
              <span>{formatDate(ticket.event.date)}</span>
            </div>
            <div className="flex items-center text-sm text-gray-500">
              <span className="mr-2">📍</span>
              <span>{ticket.event.location}</span>
            </div>
          </div>
        )}

        {/* QR Code */}
        <div className="bg-gray-50 rounded-lg p-4 text-center mb-4">
          {ticket.qrCodeUrl ? (
            <img
              src={ticket.qrCodeUrl}
              alt="QR Code"
              className="w-32 h-32 mx-auto"
            />
          ) : (
            <div className="w-32 h-32 mx-auto bg-gray-200 rounded-lg flex items-center justify-center">
              <span className="text-gray-500 text-sm">QR Code</span>
            </div>
          )}
          <p className="text-xs text-gray-500 mt-2">
            Show this QR code at the event entrance
          </p>
        </div>

        {/* Ticket ID */}
        <div className="text-center">
          <p className="text-xs text-gray-400">Ticket ID: {ticket.id}</p>
        </div>
      </div>
    </div>
  );
}

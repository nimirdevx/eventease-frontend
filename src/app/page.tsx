"use client";

import React from "react";
import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <div className="container mx-auto px-6 py-16">
        <div className="text-center">
          <div className="mb-8">
            <span className="inline-block px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium mb-4">
              🎉 Welcome to the Future of Event Management
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent leading-tight">
            EventEase
          </h1>

          <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            Effortlessly manage, discover, and attend events. Connect
            organizers, attendees, and admins in one powerful platform designed
            for seamless event experiences.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <Link
              href="/auth/register"
              className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200 text-lg"
            >
              Get Started Free
            </Link>
            <Link
              href="/auth/login"
              className="w-full sm:w-auto px-8 py-4 border-2 border-blue-600 text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition-all duration-200 text-lg"
            >
              Sign In
            </Link>
            <Link
              href="/events"
              className="w-full sm:w-auto px-8 py-4 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition-all duration-200 text-lg"
            >
              Browse Events
            </Link>
          </div>
        </div>

        {/* Features Section */}
        <div className="grid md:grid-cols-3 gap-8 mt-20">
          <div className="text-center p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">📅</span>
            </div>
            <h3 className="text-xl font-bold mb-3 text-gray-800">
              Easy Event Creation
            </h3>
            <p className="text-gray-600">
              Create and manage events with our intuitive interface. Set dates,
              locations, and manage attendees effortlessly.
            </p>
          </div>

          <div className="text-center p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🎫</span>
            </div>
            <h3 className="text-xl font-bold mb-3 text-gray-800">
              Smart Ticketing
            </h3>
            <p className="text-gray-600">
              Generate QR code tickets automatically. Track attendance and
              manage registrations in real-time.
            </p>
          </div>

          <div className="text-center p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🔔</span>
            </div>
            <h3 className="text-xl font-bold mb-3 text-gray-800">
              Real-time Notifications
            </h3>
            <p className="text-gray-600">
              Stay updated with instant notifications about events,
              registrations, and important announcements.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

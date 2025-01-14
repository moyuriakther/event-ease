"use client";
import { useState, useEffect } from "react";
import {useGetEventsQuery, useRegisterEventMutation} from "../store/eventApi"

export default function ShowEvents() {
//   const [events, setEvents] = useState([]);
const {data: events, isLoading, isError} = useGetEventsQuery();
const [registerEvent, {isLoading: isRegLoading, isError: isRegError}] = useRegisterEventMutation()
console.log(isRegLoading, isRegError)

 if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg font-semibold text-gray-600">Loading events...</p>
      </div>
    );
  }
   if (isError) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg font-semibold text-red-600">
          Failed to load events. Please try again later.
        </p>
      </div>
    );
  }
 const handleRequestEvent = (eventId) => {
    registerEvent(eventId)
  };
  return (
    <div className="bg-gray-100">
      {/* Header */}
      <header className="p-4 bg-blue-500 text-white">
        <h1 className="text-xl font-bold text-center sm:text-2xl">
          EventEase Dashboard
        </h1>
      </header>

      {/* Main Content */}
      <main className="p-4 sm:p-6 lg:p-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800 text-center sm:text-left">
            Your Events
          </h2>
          <ul className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {events?.map((event) => (
              <li
                key={event._id}
                className="p-4 bg-white rounded shadow-md hover:shadow-lg transition-shadow"
              >
                <h3 className="text-lg font-bold text-gray-800">
                  {event.name}
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  📅 {event.date}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  📍 {event.location}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  👥 Max Attendees: {event.maxAttendees}
                </p>
                <button
                  onClick={() => handleRequestEvent(event._id)}
                  className="mt-4 px-4 py-2 bg-blue-500 text-white text-sm font-medium rounded hover:bg-blue-600 transition"
                >
                  Register for Event
                </button>
              </li>
            ))}
          </ul>
        </div>
      </main>
    </div>
  );
}

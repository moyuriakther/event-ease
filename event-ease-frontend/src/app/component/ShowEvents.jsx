"use client";
import { useState, useEffect } from "react";
import {useGetEventsQuery, useRegisterEventMutation} from "../store/eventApi"
import { toast } from "sonner";
import {useSocket} from "../../contexts/SocketContext";

export default function ShowEvents() {
const [mounted, setMounted] = useState(false);
 const socket = useSocket();
const {data: events, isLoading, isError, refetch} = useGetEventsQuery();
const [registerEvent, {isLoading: isRegLoading, isError: isRegError, isSuccess: isRegSuccess, data}] = useRegisterEventMutation()

 useEffect(() => {
    setMounted(true);
  }, []);
  
 useEffect(() => {
    if (socket && mounted) {
      socket.on("attendee_registered", (data) => {
        toast.info(`New attendee registered for an event!`);
        refetch();
      });

      socket.on("event_updated", (data) => {
        toast.info(`Event "${data.name}" has been updated`);
        refetch();
      });

      socket.on("event_full", (data) => {
        toast.warning(`Event "${data.name}" is now full!`);
        refetch();
      });

      socket.on("already_registered", (data) => {
        toast.error(`You are already registered for "${data.name}"`);
      });

      return () => {
        socket.off("attendee_registered");
        socket.off("event_updated");
        socket.off("event_full");
        socket.off("already_registered");
        
      };
    }
  }, [socket, refetch, mounted]);

  if (!mounted) return null;

 const handleRequestEvent = async(eventId) => {
    try {
      const response = await registerEvent(eventId).unwrap();
      if (response.error) {
        toast.error(response.error);
      }
    } catch (error) {
      console.error("Registration error:", error);
    }
  };
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

  return (
    <div className="bg-gray-100">
      {/* Header */}
      <header className="p-4 bg-blue-500 text-white">
        <h1 className="text-xl font-bold text-center sm:text-2xl">
          Welcome to Event Ease Dashboard
        </h1>
      </header>

      {/* Main Content */}
      <main className="p-4 sm:p-6 lg:p-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800 text-center sm:text-left">
             Events
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
                    disabled={event.maxAttendees === 0 || isRegLoading}
                 className={`mt-4 w-full px-4 py-2 rounded-md text-white transition-colors ${
                    event.maxAttendees === 0
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-blue-500 hover:bg-blue-600'
                  }`}
                >
                   {event?.maxAttendees === 0
                    ? 'Event Full'
                    : isRegLoading
                    ? 'Registering...'
                    : 'Register for Event'}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </main>
    </div>
  );
}

"use client";

import { useState } from "react";
import {useCreateEventMutation} from "../../../store/eventApi"
import { toast } from "sonner";
import { useSocket } from "../../../../contexts/SocketContext";
import { useRouter } from "next/navigation";

export default function EventForm() {
      const router = useRouter()
    const socket = useSocket();
    const [createEvent, {isLoading, isError, isSuccess, data}] = useCreateEventMutation()
  const [formData, setFormData] = useState({
    name: "",
    date: "",
    location: "",
    maxAttendees: 0,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "maxAttendees" ? parseInt(value) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // API call to create or register for an event
   try {
      const result = await createEvent(formData).unwrap();
      toast.success("Event Created Successfully");
      // Emit socket event for new event creation
      if (socket) {
        socket.emit("event_created", result);
      }
      // Reset form
      setFormData({
        name: "",
        date: "",
        location: "",
        maxAttendees: 0,
      });
       router.push('/dashboard');
    } catch (error) {
      toast.error("Failed to create event");
    }
  };
    if(isSuccess && data){
        toast.success("Event Created Successfully")
    }
  return (
    <div className="px-4 py-6 sm:px-6 lg:px-8 text-gray-700">
      <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Create an Event
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Event Name */}
          <div>
            <label
              htmlFor="eventName"
              className="block mb-2 text-sm font-medium text-gray-700"
            >
              Event Name
            </label>
            <input
              type="text"
              id="eventName"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Enter event name"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Date */}
          <div>
            <label
              htmlFor="date"
              className="block mb-2 text-sm font-medium text-gray-700"
            >
              Date
            </label>
            <input
              type="date"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Location */}
          <div>
            <label
              htmlFor="location"
              className="block mb-2 text-sm font-medium text-gray-700"
            >
              Location
            </label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              placeholder="Enter event location"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Max Attendees */}
          <div>
            <label
              htmlFor="maxAttendees"
              className="block mb-2 text-sm font-medium text-gray-700"
            >
              Max Attendees
            </label>
            <input
              type="number"
              id="maxAttendees"
              name="maxAttendees"
              value={formData.maxAttendees}
              onChange={handleInputChange}
              placeholder="Enter maximum attendees"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Submit Button */}
          <div className="text-right">
            <button
              type="submit"
              className="w-full sm:w-auto px-6 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

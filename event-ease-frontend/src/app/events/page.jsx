import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../contexts/AuthContext';
import io from 'socket.io-client';
import Layout from '../components/Layout';

export default function Events() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    fetchEvents();

    // Set up Socket.IO connection
    const socket = io();

    socket.on('newEvent', (newEvent) => {
      setEvents(prevEvents => [...prevEvents, newEvent]);
    });

    socket.on('newAttendee', ({ eventId, attendeeCount }) => {
      setEvents(prevEvents =>
        prevEvents.map(event =>
          event._id === eventId ? { ...event, attendees: new Array(attendeeCount).fill('') } : event
        )
      );
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await fetch('/api/events');
      if (!response.ok) {
        throw new Error('Failed to fetch events');
      }
      const data = await response.json();
      setEvents(data);
    } catch (err) {
      setError('Error fetching events');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (eventId) => {
    try {
      const response = await fetch(`/api/events/register/${eventId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error('Failed to register for event');
      }
      // The events will be updated via Socket.IO
    } catch (err) {
      setError('Error registering for event');
    }
  };

  if (loading) return <Layout><div>Loading...</div></Layout>;
  if (error) return <Layout><div>Error: {error}</div></Layout>;

  return (
    <Layout>
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Events</h1>
        {user && (
          <button
            onClick={() => router.push('/events/create')}
            className="mb-4 bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium"
          >
            Create Event
          </button>
        )}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => (
            <div key={event._id} className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">{event.name}</h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">{new Date(event.date).toLocaleDateString()}</p>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">{event.location}</p>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">
                  Attendees: {event.attendees.length} / {event.maxAttendees}
                </p>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">Created by: {event.createdBy.name}</p>
                {user && !event.attendees.includes(user.id) && event.attendees.length < event.maxAttendees && (
                  <button
                    onClick={() => handleRegister(event._id)}
                    className="mt-3 bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium"
                  >
                    Register
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}


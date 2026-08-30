import { useState, useEffect } from 'react';
import EventCard from '../ui/EventCard';

export function EventsWidget({ registerHandler }) {

    const [events, setEvents] = useState([]);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const resp = await fetch("/api/query/events");
                const data = await resp.json();
                const records = data.records;

                if (!resp.ok) {
                    throw new Error(
                        data.error || "Unable to retrieve events."
                    );
                }

                setEvents(records);
            } catch (error) {
                console.error("Error fetching events:", error);
            }
        };

        fetchEvents();
    }, []);

    return (
        <div>
            <h1 className="mt-12 text-2xl font-bold mb-4">Upcoming Events</h1>
            <div className="flex flex-wrap gap-6 mt-6">
                {events.map((event) => (
                    <EventCard
                        key={event.Id}
                        event={event}
                        registerHandler={registerHandler}
                    />
                ))}
            </div>
        </div>
    )
}

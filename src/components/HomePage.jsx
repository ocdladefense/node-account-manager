import { useState, useEffect } from 'react';
import { useOutletContext } from "react-router-dom";
import { getAccountContactsQuery } from './accounts/query';
import { getCookie } from '@ocdla/salesforce/CookieUtils';
import DateDisplay from './ui/DateDisplay';

export default function HomePage() {

    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    let { client } = useOutletContext();
    let [contacts, setContacts] = useState([]);
    let userId = getCookie("user_id");

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const resp = await fetch("/api/event-products");
                const data = await resp.json();

                if (!resp.ok) {
                    throw new Error(
                        data.error || "Unable to retrieve events."
                    );
                }

                setEvents(data.eventProducts);

            } catch (error) {
                console.error("Error fetching events:", error);
                setError(error);

            } finally {
                setLoading(false);
            }
        };

        fetchEvents();
    }, []);


    return (
        <div className="w-full">
            <div className="container mx-auto px-2 mt-[28px]">
                <h1 className="text-2xl font-bold mb-4">Welcome to OCDLA!</h1>

                <div className="space-y-2">
                    <p>Here's where we explain our purpose to you!</p>
                </div>

                <h1 className="mt-12 text-2xl font-bold mb-4">Upcoming Events</h1>


                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 mt-8">
                    {events.map((event) => (
                        <div key={event.id} className="card w-96 bg-base-100 card-md shadow-sm">
                            <div className="card-body">
                                <h2 className="card-title">
                                    {event.name}
                                </h2>

                                {event.date ? (
                                    <DateDisplay label="Event Date:" value={event.date} type="DateTime" />
                                ) : (
                                    <p>Date not available</p>
                                )}

                                {event.description && (
                                    <p>
                                        {event.description}
                                    </p>
                                )}

                                <div className="justify-end card-actions">
                                    <button
                                        className="btn btn-primary"
                                        type="button"
                                    >
                                        Register
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <h1 className="mt-8 text-2xl font-bold mb-4">Add to your membership</h1>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 mt-8">
                    <div className="card w-96 bg-base-100 card-md shadow-sm">
                        <div className="card-body">
                            <h2 className="card-title">Medium Card</h2>
                            <p>A card component has a figure, a body part, and inside body there are title and actions parts</p>
                            <div className="justify-end card-actions">
                                <button className="btn btn-primary">Subscribe</button>
                            </div>
                        </div>
                    </div>

                    <div className="card w-96 bg-base-100 card-md shadow-sm">
                        <div className="card-body">
                            <h2 className="card-title">Medium Card</h2>
                            <p>A card component has a figure, a body part, and inside body there are title and actions parts</p>
                            <div className="justify-end card-actions">
                                <button className="btn btn-primary">Subscribe</button>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )

    // Make this a welcoming home page for users of the app


}

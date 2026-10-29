
import { useState, useEffect } from "react";
import EventDropDownMenu from "./EventDropDownMenu.jsx";

export default function SelectEvent({ setData }) {
    const [events, setEvents] = useState([]);
    const [selectedEvent, setSelectedEvent] = useState("");


    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const resp = await fetch("/api/query/events");
                const data = await resp.json();

                if (!resp.ok) {
                    throw new Error(
                        data.error || "Unable to retrieve events."
                    );
                }

                setEvents(data.records);

            } catch (error) {
                console.error(
                    "Error fetching events:",
                    error
                );
            }
        };

        fetchEvents();
    }, []);




    return (

        <>
            <EventDropDownMenu
                label={selectedEvent ? selectedEvent.Name : "Register for Event"}
                entries={events}
                handler={(event) => {
                    setSelectedEvent(event); setData(prev => ({
                        ...prev, selectedEvent: event
                    }));
                }}
            />
        </>
    )
}


import { useState, useEffect } from "react";
import DropMenu from "../ui/form/DropMenu.jsx";

export default function SelectEvent({ products, setData, data }) {
    const [events, setEvents] = useState([]);
    const [selectedEvent, setSelectedEvent] = useState("");




    // This fetch is for populating the drop down menu for the registration modal.
    useEffect(() => {
        const fetchEvents = async () => {
            try
            {
                const resp = await fetch("/api/query/events");
                const data = await resp.json();

                if (!resp.ok)
                {
                    throw new Error(
                        data.error || "Unable to retrieve events."
                    );
                }

                setEvents(data.records);

            } catch (error)
            {
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
            <input name="theEvent" id="theEvent" type="hidden" value={selectedEvent} readOnly />
            <DropMenu
                label={selectedEvent ? selectedEvent.Name : "Register for Event"}
                entries={events}
                handler={(event) => { setSelectedEvent(event); setData({ selectedEvent: event }); }}
            />
        </>
    )
}

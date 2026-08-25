import DateDisplay from "./DateDisplay.jsx";

export default function EventCard({ event }) {

    const shortDescription = event.description
        ?.split(/(?<=[.!?])\s+/)
        .slice(0, 2)
        .join(" ");

    return (
        <div className="card bg-base-100 card-md shadow-sm w-96">
            <div className="card-body">

                <h2 className="card-title">
                    {event.name}
                </h2>

                {event.date && (
                    <DateDisplay
                        value={event.date}
                        type="Date"
                        textClassName="text-base"
                    />
                )}

                {shortDescription && (
                    <p>
                        {shortDescription}
                    </p>
                )}

                <div className="justify-end card-actions">
                    <button
                        type="button"
                        className="btn btn-primary"
                    >
                        Register
                    </button>
                </div>

            </div>
        </div>
    );
}

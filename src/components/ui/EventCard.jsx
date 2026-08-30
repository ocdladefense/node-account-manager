import DateDisplay from "./DateDisplay.jsx";
import Button from "./Button.jsx";

export default function EventCard({ event, registerHandler }) {

    const shortDescription = event.description
        ?.split(/(?<=[.!?])\s+/)
        .slice(0, 2)
        .join(" ");

    const handleRegister = () => {
        registerHandler({
            Id: event.id,
            Name: event.name
        });
    };

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
                    <p>{shortDescription}</p>
                )}

                <div className="justify-end card-actions">

                    <Button
                        label="Register"
                        buttonType="button"
                        action={handleRegister}
                    />

                </div>

            </div>

        </div>
    );
}

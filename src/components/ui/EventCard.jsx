import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DateDisplay from "./DateDisplay.jsx";
import Button from "./Button.jsx";
import { useToast } from "./notifications/ToastService.jsx";

export default function EventCard({ event }) {

    const navigate = useNavigate();
    const { CreateToast } = useToast();

    const [registering, setRegistering] = useState(false);

    const shortDescription = event.description
        ?.split(/(?<=[.!?])\s+/)
        .slice(0, 2)
        .join(" ");


    const handleRegister = async () => {

        try {
            setRegistering(true);

            const resp = await fetch("/orders", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    productId: event.id
                })
            });

            const result = await resp.json();

            if (!resp.ok) {
                console.error("Registration failed:", result);

                CreateToast(
                    <div className="bg-red-500 text-black px-6 py-4 text-lg font-semibold rounded-lg shadow-lg">
                        {result.error || "Registration could not be completed."}
                    </div>
                );

                return;
            }

            CreateToast(
                <div className="bg-green-500 text-black px-6 py-4 text-lg font-semibold rounded-lg shadow-lg">
                    Registration successful.
                </div>
            );

            navigate(`/invoice/${result.order.id}`);

        } catch (error) {

            console.error("Registration error:", error);

            CreateToast(
                <div className="bg-red-500 text-black px-6 py-4 text-lg font-semibold rounded-lg shadow-lg">
                    Unable to contact the server.
                </div>
            );

        } finally {
            setRegistering(false);
        }
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
                        label={registering ? "Registering..." : "Register"}
                        buttonType="button"
                        action={handleRegister}
                        disabled={registering}
                    />

                </div>

            </div>

        </div>
    );
}

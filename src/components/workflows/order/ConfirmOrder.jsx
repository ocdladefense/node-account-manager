export default function ConfirmOrder({ data }) {

    const eventName = data.selectedEvent?.Name;
    const attendeeCount = data.selectedContactIds?.length ?? 0;
    const total = data.total ?? 0;

    return (
        <div className="w-full text-left">

            <h2 className="text-2xl font-bold mb-6">
                Confirm Your Order
            </h2>

            <div className="space-y-4">

                <p><strong>Event:</strong> {eventName}</p>

                <p><strong>Number of Attendees:</strong> {attendeeCount}</p>

                <p><strong>Total Price:</strong> ${total}</p>

            </div>

        </div>
    );
}

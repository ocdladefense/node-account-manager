import DateDisplay from "./DateDisplay.jsx";
import Button from "./Button.jsx";

export default function EventCard({ event, registerHandler }) {

    const shortDescription = event.Description__c
        ?.split(/(?<=[.!?])\s+/)
        .slice(0, 2)
        .join(" ");


    return (
        <div className="card bg-base-100 card-md shadow-sm w-96">

            <div className="card-body">

                <h2 className="card-title">
                    {event.Name}
                </h2>

                {event.Start_Date__c && (
                    <DateDisplay
                        value={event.Start_Date__c}
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
                        action={() => registerHandler({ Id: event.Id, Name: event.Name }, "event")}
                    />

                </div>

            </div>

        </div>
    );
}

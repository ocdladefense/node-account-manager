import { SubscriptionsWidget } from './dashboard/SubscriptionsWidget';
import { EventsWidget } from './dashboard/EventsWidget';
import { StatusWidget } from './dashboard/StatusWidget';

export default function HomePage() {

    return (
        <div className="w-full">
            <div className="container mx-auto px-2 mt-7">
                <h1 className="text-2xl font-bold mb-4">Welcome to OCDLA!</h1>

                <StatusWidget></StatusWidget>

                <EventsWidget></EventsWidget>

                <SubscriptionsWidget></SubscriptionsWidget>
            </div>
        </div>
    )

}

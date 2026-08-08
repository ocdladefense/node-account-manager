export default function FormatAddress({ address }) {
    if (!address?.street) {
        return <>-</>;
    }

    const fullAddress = `${address.street}, ${address.city}, ${address.state} ${address.postalCode}`;

    const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fullAddress)}`;

    return (
        <a href={mapsUrl} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">
            {address.street}
            <br />
            {address.city}, {address.state} {address.postalCode}
        </a>
    );
}

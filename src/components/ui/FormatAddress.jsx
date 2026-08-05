export default function FormatAddress({ address }) {
    if (!address?.street) {
        return <>No Address</>;
    }

    return (
        <>
            {address.street}
            <br />
            {address.city}, {address.state} {address.postalCode}
        </>
    );
}

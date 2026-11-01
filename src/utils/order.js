


export function hashContactIds(arr) {
    // Join array with a separator to preserve string boundaries
    const combinedString = arr.join('|');
    let hash = 0;

    for (let i = 0; i < combinedString.length; i++)
    {
        const char = combinedString.charCodeAt(i);
        // Bitwise operations to generate the 32-bit integer hash
        hash = ((hash << 5) - hash) + char;
        hash |= 0; // Convert to a 32-bit integer
    }

    // Return an unsigned 32-bit integer string in base 36 (alphanumeric)
    return (hash >>> 0).toString(36).padStart(7, '0');
}




export function getOrderTotal(orderLines) {
    return Object.values(orderLines).reduce(
        (sum, item) => sum + item.UnitPrice,
        0
    );
}

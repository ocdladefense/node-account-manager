export function getOrderHistory(accountId) {
    return `SELECT FIELDS(ALL) FROM Order WHERE AccountId = '${accountId}' LIMIT 20`;
}

// OrderId is 
export function getOrderItems(orderId) {
    return `SELECT Id, Product2Id, Quantity, UnitPrice, ListPrice, Description FROM OrderItem WHERE OrderId = '${orderId}'`;
}

export function getOrderHistory(accountId) {
    return `SELECT FIELDS(ALL) FROM Order WHERE AccountId = '${accountId}' LIMIT 20`;
}

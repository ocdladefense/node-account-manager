// Accounts.jsx query for account information
export function getAccountsQuery() {
    return `SELECT Id, Name FROM Account WHERE NOT (Name LIKE '%Person%')`;
}


// Accounts.jsx query for account information
export function getAccountContactsQuery(accountId) {
    return `SELECT Id, Name FROM Account WHERE NOT (Name LIKE '%Person%')`;
}

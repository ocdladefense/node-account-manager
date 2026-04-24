// Accounts.jsx query for account information
export function getAccountsQuery() {
    // return `SELECT Id, Name FROM Account WHERE NOT (Name LIKE '%Person%')`;
    return `SELECT Id, Name FROM Account WHERE Name = 'Metro PD, Washington Co.'`;
}




// Accounts.jsx query for account information
export function getAccountContactsQuery(accountId) {
    return `SELECT Id, Name FROM Contact WHERE accountId  = '${accountId}'`;
}

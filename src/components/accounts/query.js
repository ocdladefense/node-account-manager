// Account.jsx uses query for getting information about the specific account by using it's unique Id.
export function getAccountQuery(accountId) {
    return `SELECT
        Id,
        Name,
        Description,
        AccountNumber,
        Site,
        Website,
        NumberOfEmployees,
        Industry,
        Phone,
        Fax,
        BillingAddress
    FROM Account WHERE Id = '${accountId}'`;
}

// Accounts.jsx uses query for getting a list of all accounts.
export function getAccountsQuery() {
    return `SELECT Id, Name FROM Account WHERE NOT (Name LIKE '%Person%')`;

    // TODO: Delete line below after finished testing accounts section
    // return `SELECT Id, Name FROM Account WHERE Name = 'Metro PD, Washington Co.'`;
}

// AccountsContacts.jsx uses query for getting the list of contacts of each account by using it's unique Id.
export function getAccountContactsQuery(accountId) {
    return `SELECT Id, Name FROM Contact WHERE AccountId = '${accountId}'`;
}

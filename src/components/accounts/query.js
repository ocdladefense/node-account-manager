// Account.jsx uses query for getting information about the specific account by using it's unique Id.
export function getAccountQuery(accountId) {

    const SQL_FIELD_SEPERATOR = ",";

    let fields = [
        "Id",
        "Name",
        "Description",
        "AccountNumber",
        "Site",
        "Website",
        "NumberOfEmployees",
        "Industry",
        "Phone",
        "Fax",
        "BillingAddress"
    ];

    let query = "SELECT " + fields.join(",") + " FROM Account";

    if (accountId) query += (" WHERE Id='" + accountId + "'");

    return query;
}

// Accounts.jsx uses query for getting a list of all accounts.
export function getAccountsQuery() {
    return `SELECT Id, Name FROM Account WHERE NOT (Name LIKE '%Person%')`;

    // TODO: Delete line below after finished testing accounts section
    // return `SELECT Id, Name FROM Account WHERE Name = 'Metro PD, Washington Co.'`;
}

// AccountsContacts.jsx uses query for getting the list of contacts of each account by using it's unique Id.
export function getAccountContactsQuery(accountId) {
    return `
        SELECT
            Id,
            Name,
            Email,
            Ocdla_Member_Status__c,
            Ocdla_Membership_Expiration_Date__c
        FROM Contact
        WHERE AccountId = '${accountId}'
    `;
}

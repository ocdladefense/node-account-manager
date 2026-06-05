export function getFileDataByContact(contactId) {
    return `
        SELECT Filename__c,
        FileSize__c,
        FileType__c,
        CreatedDate
        FROM FileData__c
        WHERE ContactId__c = '${contactId}'
    `;
}

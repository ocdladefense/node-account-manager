export function getFileDataByContact(contactId) {
    return ` SELECT Filename__c,
    FileSize__c,
    FileType__c
    FROM FileData__c
    WHERE ContactId__c = '${contactId}'
    `;
}
//SELECT Filename__c, FileSize__c, FileType__c FROM FileData__c WHERE ContactId__c = '003cY00000Zhq7HQAR'
export function getFileDataByAccount(accountId) {
    return `SELECT Filename__c, FileSize__c, FileType__c 
            FROM FileData__c WHERE AccountId__c = '${accountId}'`;
}





export function formatContactQuery(ids) {
    const idList = ids.map(id => `'${id}'`).join(",");
    return `SELECT Id, Name, Ocdla_Current_Member_Flag__c, Ocdla_Member_Status__c FROM Contact WHERE Id IN (${idList})`;
}


export function formatProductQuery(ids) {
    const idList = ids.map(id => `'${id}'`).join(",");
    return `SELECT Id, ClickpdxCatalog__StandardPrice__c, ClickpdxCatalog__MemberPrice__c, EarlyBirdPrice__c, OcdlaEligibleMemberStatuses__c, Event__r.Early_Bird_End_Date__c FROM Product2 WHERE Id IN (${idList})`;
}




// CODE IMPORT FROM UTILS FOLDER
export function formatTicketQuery(eventId) {
    return `SELECT Id, Name, Event__c, Event__r.Early_Bird_End_Date__c, ClickpdxCatalog__IsMembersOnly__c, OcdlaEligibleMemberStatuses__c, ClickpdxCatalog__StandardPrice__c, ClickpdxCatalog__MemberPrice__c, EarlyBirdPrice__c FROM Product2 WHERE Event__c = '${eventId}' AND IsActive = True AND IsAddOn__c = False`;
}

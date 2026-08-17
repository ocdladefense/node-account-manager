export function getInvoiceHistory(accountId) {
    return `SELECT 
        Id,
        OrderNumber,
        EffectiveDate,
        TotalAmount,
        Status,
        StatusCode,
        FormattedActivatedDate__c
    FROM Order 
    WHERE AccountId = '${accountId}'
    AND StatusCode = 'Draft'
    AND PostingEntity__c = 'Invoice'`;
}

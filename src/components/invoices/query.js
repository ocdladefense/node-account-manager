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
    AND PostingEntity__c = 'Invoice' ORDER BY EffectiveDate DESC LIMIT 100`;
}

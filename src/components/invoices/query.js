export function getInvoiceHistory(accountId) {
    return `SELECT 
        Id,
        OrderNumber,
        EffectiveDate,
        TotalAmount,
        Status,
        FormattedActivatedDate__c
    FROM Order 
    WHERE AccountId = '${accountId}'
    AND Status != 'Posted Payment'`;
}

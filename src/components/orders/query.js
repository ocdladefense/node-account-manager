export function getOrderHistory(accountId) {
    return `SELECT 
        Id,
        OrderNumber,
        EffectiveDate,
        TotalAmount,
        Status,
        FormattedActivatedDate__c
    FROM Order WHERE AccountId = '${accountId}'`;
}

// OrderId is 
export function getOrderItems(orderId) {
    return `SELECT 
        Id,
        OrderId,
        Order.OrderNumber,
        Product2.Name,
        Product2.Ocdla_Image__c,
        Product2.Ocdla_Item_Category__c,
        Product2.ProrationType__c,
        Product2.OcdlaMembershipStatusGrant__c,
        Quantity,
        UnitPrice,
        TotalPrice,
        Contact__r.Name
    FROM OrderItem WHERE OrderId = '${orderId}'`;
}

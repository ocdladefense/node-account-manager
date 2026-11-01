import SalesforceRestApi from "@ocdla/salesforce/SalesforceRestApi.js";

let client;

export async function getPrices(params, instanceUrl, accessToken) {


    let contactIds = params.map(param => param.contactId);
    let productIds = params.map(param => param.productId);

    client = new SalesforceRestApi(instanceUrl, accessToken);



    const resp = await client.query(
        formatContactQuery(contactIds)
    );

    let contacts;
    contacts = resp.records;
    // contact = resp.records?.[0];

    const productResponse = await client.query(
        formatProductQuery(productIds)
    );

    let products;
    products = productResponse.records;

    let prices = [];

    for (let duple of params) {

        let contactId = duple.contactId;
        let productId = duple.productId;

        let contact = contacts.find((contact) => contact.Id === contactId);
        let product = products.find((product) => product.Id === productId);

        let price = calculateProductPrice(contact, product);


        let fubar = {
            contactId,
            productId,
            price
        };

        prices.push(fubar);
    }
    console.log(prices);
    return prices;
}





function calculateProductPrice(contact, product) {

    const standardPrice = product.ClickpdxCatalog__StandardPrice__c;
    const memberPrice = product.ClickpdxCatalog__MemberPrice__c;
    const earlyBirdPrice = product.EarlyBirdPrice__c;

    const earlyBirdEndDate = product.Event__r?.Early_Bird_End_Date__c;

    // Yes, I totally let AI write this value for me lol
    const currentDate = new Date().toISOString().split("T")[0];

    // Special membership-status tickets use their own pricing.
    if (product.OcdlaEligibleMemberStatuses__c) {
        return standardPrice;
    }

    // Apply early-bird pricing if within the appropriate timeframe.
    if (
        earlyBirdEndDate &&
        currentDate <= earlyBirdEndDate &&
        earlyBirdPrice != null
    ) {
        return earlyBirdPrice;
    }

    // Apply member pricing when available.
    if (
        contact.Ocdla_Current_Member_Flag__c &&
        memberPrice != null
    ) {
        return memberPrice;
    }

    // Otherwise, use the standard price.
    return standardPrice;
}





export function getStandardPrice(product) {
    return product.ClickpdxCatalog__StandardPrice__c;
}


export function getMemberPrice(product) {

    let price;

    if (product.isMembersOnly) {
        price = product.ClickpdxCatalog__StandardPrice__c;
    }

    else if (!product.isMembersOnly && product.ClickpdxCatalog__MemberPrice__c) {
        price = product.ClickpdxCatalog__MemberPrice__c;
    }

    else {
        price = product.ClickpdxCatalog__StandardPrice__c;
    }


    return price;
}



export function getEarlyBirdPrice(product) {

    const earlyBirdPrice = product.EarlyBirdPrice__c;

    if (!earlyBirdPrice) {
        return null;
    }

    return earlyBirdPrice;
}

function isBeforeEarlyBirdEndDate(product) {

    const currentDate = new Date().toISOString().split("T")[0];

    const earlyBirdEndDate = product.Event__r?.Early_Bird_End_Date__c;

    if (earlyBirdEndDate && currentDate <= earlyBirdEndDate) {
        return true;
    }

    return false;
}



function formatContactQuery(ids) {
    const idList = ids.map(id => `'${id}'`).join(",");
    return `SELECT Id, Name, Ocdla_Current_Member_Flag__c, Ocdla_Member_Status__c FROM Contact WHERE Id IN (${idList})`;
}


function formatProductQuery(ids) {
    const idList = ids.map(id => `'${id}'`).join(",");
    return `SELECT Id, ClickpdxCatalog__StandardPrice__c, ClickpdxCatalog__MemberPrice__c, EarlyBirdPrice__c, OcdlaEligibleMemberStatuses__c, Event__r.Early_Bird_End_Date__c FROM Product2 WHERE Id IN (${idList})`;
}

export function hashContactIds(arr) {
    // Join array with a separator to preserve string boundaries
    const combinedString = arr.join('|');
    let hash = 0;

    for (let i = 0; i < combinedString.length; i++) {
        const char = combinedString.charCodeAt(i);
        // Bitwise operations to generate the 32-bit integer hash
        hash = ((hash << 5) - hash) + char;
        hash |= 0; // Convert to a 32-bit integer
    }

    // Return an unsigned 32-bit integer string in base 36 (alphanumeric)
    return (hash >>> 0).toString(36).padStart(7, '0');
}




export function getOrderTotal(orderLines) {
    return Object.values(orderLines).reduce(
        (sum, item) => sum + item.UnitPrice,
        0
    );
}

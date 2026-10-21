// uncomment and fix this
// function fubar() {
//         const contactQuery = formatContactQuery(contactIds);

//         const contactResp = await client.query(contactQuery);

//         const contacts = contactResp.records;

//         let algorithms = [selectBestProductByMemberStatus, selectBestProductByIsMember, oneTicketAlgorithm];

//         const recommendations = {};

//         contacts.forEach(contact => {

//             const suggestion = algorithms.map(fn => fn(contact, records)).find(result => !!result);

//             if (!suggestion) {
//                 recommendations[contact.Id] = null;
//                 return;
//             }

//             const calculatedPrice = calculateProductPrice(suggestion, contact,
//             );

//             recommendations[contact.Id] = {
//                 productId: suggestion.Id,
//                 price: calculatedPrice
//             };
//         });



//         return res.json({
//             records: records,
//             recommendations: recommendations
//         });
//     });


// This was just proof of concept. Don't do this.
function selectBestProductRandomly(contact, products, index) {

    let rand = Math.floor(Math.random() * products.length);

    return products[rand];
}


// Changed this function so it can't accidentally pick the special status tickets.
function selectBestProductByIsMember(contact, products) {

    const memberProduct = products.find(product => product.ClickpdxCatalog__IsMembersOnly__c === true && !product.OcdlaEligibleMemberStatuses__c);

    const nonMemberProduct = products.find(product => product.ClickpdxCatalog__IsMembersOnly__c === false && !product.OcdlaEligibleMemberStatuses__c);

    return contact.Ocdla_Current_Member_Flag__c ? memberProduct : nonMemberProduct;
}


function selectBestProductByMemberStatus(contact, products) {

    return products.find(product => {

        if (!product.OcdlaEligibleMemberStatuses__c) {

            return false;

        }

        let eligibleStatuses = product.OcdlaEligibleMemberStatuses__c.split(",");

        let memberStatus = contact.Ocdla_Member_Status__c;

        return eligibleStatuses.includes(memberStatus);

    });
}


function oneTicketAlgorithm(contact, products) {
    if (products.length === 1) {
        return products[0];
    }
}




function formatContactQuery(ids) {
    const idList = ids.map(id => `'${id}'`).join(",");
    return `SELECT Id, Name, Ocdla_Current_Member_Flag__c, Ocdla_Member_Status__c FROM Contact WHERE Id IN (${idList})`;
}


function formatProductQuery(eventId) {
    return `SELECT Id, Name, Event__c, Event__r.Early_Bird_End_Date__c, ClickpdxCatalog__IsMembersOnly__c, OcdlaEligibleMemberStatuses__c, ClickpdxCatalog__StandardPrice__c, ClickpdxCatalog__MemberPrice__c, EarlyBirdPrice__c FROM Product2 WHERE Event__c = '${eventId}' AND IsActive = True AND IsAddOn__c = False`;
}

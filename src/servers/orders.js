import express from "express";
import SalesforceRestApi from '@ocdla/salesforce/SalesforceRestApi.js';

const router = express.Router();



let client;



/**
 * contactIds - an array of contacts Ids selected from the AccountContacs component.
 * productId - a random product "active" and available on the Sandbox.
 * 
 * Goal - execute Salesforce REST api endpoint to create an single order, with one order product for each contactId in the array.
 */
router.post("/orders", async (req, res) => {
    // Note created records id field is in fact lowercase "id" and not "Id" as in the Salesforce object model.  This is a quirk of the Salesforce REST API.

    // Data required to create an Order.
    let contactIds = req.body.contactIds.split(",");
    let accountId = req.cookies.account_id;
    const productId = req.body.productId;
    const paymentTypeId = req.body.paymentTypeId;


    // Connection to Salesforce REST API using the access token and instance URL from cookies.
    let url = req.cookies.instance_url;
    let token = req.cookies.access_token;
    client = new SalesforceRestApi(url, token);


    // Step 1: Get the PricebookEntry for the productId.
    let pricebookEntry = await getPricebookEntry(productId);



    // Step 2: Construct the Order object in Salesforce.
    // Test Order Record
    let orderRecord = {
        AccountId: accountId,
        EffectiveDate: new Date().toISOString().split('T')[0],
        Status: "Draft",
        Pricebook2Id: pricebookEntry.Pricebook2Id,
        BillToContactId: req.cookies.contact_id,
    };

    if (paymentTypeId == "invoice") {
        orderRecord.PostingEntity__c = "Invoice";
    }


    // Step 3: Create the Order in Salesforce.
    const resp = await client.create("Order", orderRecord);
    const orderResult = await resp.json();
    console.log("Order Result:", orderResult);


    if (!resp.ok) throw new Error(orderResult.errors || "Salesforce failed to create an order.");




    // Step 4: Create OrderItems for each contactId.
    const orderItemResults = await createOrderItems(orderResult, contactIds, pricebookEntry);


    // Step 5:  Convert the OrderStatus as appropriate.
    // For invoices Status will be Activated;
    // For all others, Status will be Posted Payment.
    let status = paymentTypeId === "invoice" ? "Activated" : "Posted Payment";
    const updateResp = await client.update("Order", { Id: orderResult.id, Activate__c: true });
    // const updatedOrderResult = await updateResp.json();


    console.log("updateResp:", updateResp.status);


    // Finally return a response. 
    res.json({
        postingEntity: paymentTypeId == "invoice" ? "Invoice" : "Receipt",
        order: orderResult,
        orderItems: orderItemResults
    });


    // Otherwise, maybe there was an error
    /*

        return res.status(resp.status).json({
            error: "Salesforce failed to create the order.",
            details: orderResult
        });
        */



});






async function getPricebookEntry(productId) {

    const pricebookQuery = `SELECT Id, Product2Id, Pricebook2Id, UnitPrice, Product2.ClickpdxCatalog__LineDescription__c FROM PricebookEntry WHERE Product2Id = '${productId}'`;
    const pricebookResp = await client.query(pricebookQuery);
    const pricebookEntry = pricebookResp.records[0];


    // Make sure we found a Pricebook entry for the product
    if (!pricebookEntry) {
        throw new Error(`No PricebookEntry found for product: ${productId}`);
    }

    return pricebookEntry;
}









async function createOrderItems(orderResult, contactIds, pricebookEntry) {


    const orderItemResults = [];

    for (const contactId of contactIds) {

        const orderItemRecord = {
            OrderId: orderResult.id,
            PricebookEntryId: pricebookEntry.Id,
            Quantity: 1,
            UnitPrice: pricebookEntry.UnitPrice,
            Contact__c: contactId,
            Description: pricebookEntry.Product2.ClickpdxCatalog__LineDescription__c
        };

        const itemResp = await client.create("OrderItem", orderItemRecord);
        const itemResult = await itemResp.json();

        console.log("Item Result:", itemResult);

        // Make sure each order item was successful
        if (!itemResp.ok) throw new Error(itemResult.errors || `Salesforce failed to create an order item for contact: ${contactId}`);

        orderItemResults.push(itemResult);
    }



    return orderItemResults;
}




export default router;

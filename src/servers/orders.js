import express from "express";
import SalesforceRestApi from '@ocdla/salesforce/SalesforceRestApi.js';
import chargeCreditCard from './charge.js';


const router = express.Router();



let client;

const FORCE_PAYMENT_ERROR = false;


/**
 * contactIds - an array of contacts Ids selected from the AccountContacs component.
 * productId - a random product "active" and available on the Sandbox.
 * 
 * Goal - execute Salesforce REST api endpoint to create an single order, with one order product for each contactId in the array.
 */
router.post("/orders", async (req, res) => {

    let accountId = req.cookies.account_id;

    const orderLines = req.body.orderLines;
    const contactIds = orderLines.map(line => line.contactId);
    const productIds = orderLines.map(line => line.productId);

    const paymentMethodId = req.body.paymentMethodId;

    let url = req.cookies.instance_url;
    let token = req.cookies.access_token;
    client = new SalesforceRestApi(url, token);


    // Step 1: Get the PricebookEntry for the first productId.
    let pricebookEntries = await getPricebookEntries(productIds);

    // Step 1.5: Get the Pricebook2Id from the first product queried for. Use the key (the productId) for the .get
    const pricebook2Id = pricebookEntries.get(productIds[0]).Pricebook2Id;


    // Step 2: Construct the Order object in Salesforce.
    // Test Order Record
    let orderRecord = {
        AccountId: accountId,
        EffectiveDate: new Date().toISOString().split('T')[0],
        Status: "Draft",
        Pricebook2Id: pricebook2Id,
        BillToContactId: req.cookies.contact_id,
    };

    if (paymentMethodId == "invoice") {
        orderRecord.PostingEntity__c = "Invoice";
    }


    // Step 3: Create the Order in Salesforce.
    const resp = await client.create("Order", orderRecord);
    const orderResult = await resp.json();
    console.log("Order Result:", orderResult);


    if (!resp.ok) throw new Error(orderResult.errors || "Salesforce failed to create an order.");




    // Step 4: Create OrderItems for each contactId.
    const orderItemResults = await createOrderItems(
        orderResult,
        orderLines,
        pricebookEntries
    );


    // Step 5:  Convert the OrderStatus as appropriate.
    // This needs some kind of "await".
    // build in error message
    chargeCreditCard(updateOrderStatus.bind(null, orderResult.id));

    let successfulOrder = {
        postingEntity: paymentMethodId == "invoice" ? "Invoice" : "Receipt",
        order: orderResult,
        orderItems: orderItemResults
    };

    // Otherwise, maybe there was an error

    let failedOrder = {
        error: "Salesforce failed to create the order.",
        details: orderResult
    };

    res.json(FORCE_PAYMENT_ERROR ? failedOrder : successfulOrder);



});



async function updateOrderStatus(orderId) {
    // For invoices Status will be Activated;
    // For all others, Status will be Posted Payment.

    const updateResp = await client.update("Order", { Id: orderId, Activate__c: true });
    // const updatedOrderResult = await updateResp.json();


    console.log("updateResp:", updateResp.status);
}



async function getPricebookEntries(productIds) {

    const soql = productIds.map(productId => `'${productId}'`).join(', ');

    const entriesByProduct = new Map();

    const pricebookQuery = `SELECT Id, Product2Id, Pricebook2Id, UnitPrice, Product2.ClickpdxCatalog__LineDescription__c FROM PricebookEntry WHERE Product2Id IN (${soql})`;

    console.log(pricebookQuery);
    const pricebookResp = await client.query(pricebookQuery);
    const pricebookEntries = pricebookResp.records;


    for (const entry of pricebookEntries) {
        entriesByProduct.set(entry.Product2Id, entry);
    }


    // Make sure we found a Pricebook entry for the product
    if (!pricebookEntries) {
        throw new Error(`No PricebookEntry found for product(s): ${productIds}`);
    }

    return entriesByProduct;
}




async function createOrderItems(orderResult, orderLines, pricebookEntries) {

    const orderItemResults = [];

    for (const lineItem of orderLines) {

        const pricebookEntry = pricebookEntries.get(lineItem.productId);

        const orderItemRecord = {
            OrderId: orderResult.id,
            PricebookEntryId: pricebookEntry.Id,
            Quantity: 1,
            UnitPrice: lineItem.UnitPrice,
            Contact__c: lineItem.contactId,
            Description: pricebookEntry.Product2.ClickpdxCatalog__LineDescription__c
        };

        const itemResp = await client.create("OrderItem", orderItemRecord);
        const itemResult = await itemResp.json();

        console.log("Item Result:", itemResult);

        if (!itemResp.ok) {
            throw new Error(
                `Salesforce failed to create an order item for contact: ${lineItem.contactId}`
            );
        }

        orderItemResults.push(itemResult);
    }

    return orderItemResults;
}





export default router;

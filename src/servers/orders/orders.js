import express from "express";
import SalesforceRestApi from '@ocdla/salesforce/SalesforceRestApi.js';
import SalesforceCompositeRequest from '@ocdla/salesforce/SalesforceCompositeRequest.js';
import chargeCreditCard from './charge.js';
import Order from "../../utils/Order.js";
import CreditCard from "./CreditCard.js";


const router = express.Router();
const FORCE_PAYMENT_ERROR = false;
let client;



// let cc = {
//     cardNumber: '4242424242424242',
//     expirationDate: '0842',
//     cardCode: '999'
// };

/**
 * contactIds - an array of contacts Ids selected from the AccountContacs component.
 * productId - a random product "active" and available on the Sandbox.
 * 
 * Goal - execute Salesforce REST api endpoint to create an single order, with one order product for each contactId in the array.
 */
router.post("/orders", async (req, res) => {

    console.log(req.body);
    let accountId = req.cookies.account_id;
    let orderLines = req.body.orderLines;
    let paymentMethodId = req.body.paymentMethodId;
    let url = req.cookies.instance_url;
    let token = req.cookies.access_token;

    // Authorize.net Test Visa Card credentials
    let visaCC = CreditCard.newVisaTestCard();

    let transId = null;


    client = new SalesforceRestApi(url, token);
    let order = new Order(accountId, req.cookies.contact_id);
    order.addLines(Object.values(orderLines));
    order.setPaymentMethod(paymentMethodId);


    let { records: [{ Id: standardPricebookId }] } = await client.query("SELECT Id FROM Pricebook2 WHERE IsStandard = true");
    let pricebookEntries = await getPricebookEntries(Object.values(orderLines));




    order.setPricebook2Id(standardPricebookId);
    order.setPricebookEntries(pricebookEntries);

    let sf = new SalesforceCompositeRequest("Order");
    let body = await order.toObject();
    console.log("PROCESSING ORDER");
    console.dir(body, { depth: null });
    sf.setBody(JSON.stringify(body));

    console.log("COMPOSITE RESPONSE");
    let resp = await client.composite(sf);
    let respBody = await resp.json();
    console.dir(respBody, { depth: null });

    let newOrderId = respBody.results[0].id;


    const { records: [priceRecord] } = await client.query(`SELECT Id, OrderNumber, BillToContact.FirstName, BillToContact.LastName, PostingEntity__c, TotalAmount FROM Order WHERE Id = '${newOrderId}'`);
    console.log("ORDER INFO:", priceRecord);

    let info = {
        Id: newOrderId,
        OrderNumber: priceRecord.OrderNumber,
        PostingEntity__c: priceRecord.PostingEntity__c,
        FirstName: priceRecord.BillToContact.FirstName,
        LastName: priceRecord.BillToContact.LastName,
        Amount: priceRecord.TotalAmount,
        lineItems: order.getLineItems()
    };



    if (order.isCreditCard()) {

        await chargeCreditCard(info, visaCC).then((resp) => {

            transId = resp.getTransactionResponse().getTransId();
            // Now we need to save the transactionId to the order in Salesforce, and activate the order.
        });
    }


    await client.update("Order", {
        Id: newOrderId,
        Activate__c: true,
        TransactionId__c: transId
    });


    res.json({ ...info, transactionId: transId });
});





async function getPricebookEntries(orderLines) {

    const productIds = orderLines.map(line => line.productId);
    const entries = new Map();
    const soql = productIds.map(productId => `'${productId}'`).join(', ');
    const query = `SELECT Id, Product2Id, Pricebook2Id, UnitPrice, Product2.Name, Product2.ClickpdxCatalog__LineDescription__c FROM PricebookEntry WHERE Product2Id IN (${soql})`;



    const { records: pricebookEntries } = await client.query(query);


    for (const entry of pricebookEntries) {
        entries.set(entry.Product2Id, entry);
    }


    return entries;
}





function parseTransactionResponse(response) {



    if (response.getMessages().getResultCode() == APIContracts.MessageTypeEnum.OK) {
        if (response.getTransactionResponse().getMessages() != null) {
            console.log('Successfully created transaction with Transaction ID: ' + response.getTransactionResponse().getTransId());
            console.log('Response Code: ' + response.getTransactionResponse().getResponseCode());
            console.log('Message Code: ' + response.getTransactionResponse().getMessages().getMessage()[0].getCode());
            console.log('Description: ' + response.getTransactionResponse().getMessages().getMessage()[0].getDescription());
        }
        else {
            console.log('Failed Transaction.');
            if (response.getTransactionResponse().getErrors() != null) {
                console.log('Error Code: ' + response.getTransactionResponse().getErrors().getError()[0].getErrorCode());
                console.log('Error message: ' + response.getTransactionResponse().getErrors().getError()[0].getErrorText());
            }
        }
    }
    else {
        console.log('Failed Transaction. ');
        if (response.getTransactionResponse() != null && response.getTransactionResponse().getErrors() != null) {

            console.log('Error Code: ' + response.getTransactionResponse().getErrors().getError()[0].getErrorCode());
            console.log('Error message: ' + response.getTransactionResponse().getErrors().getError()[0].getErrorText());
        }
        else {
            console.log('Error Code: ' + response.getMessages().getMessage()[0].getCode());
            console.log('Error message: ' + response.getMessages().getMessage()[0].getText());
        }
    }


}

export default router;

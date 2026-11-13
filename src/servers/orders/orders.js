import express from "express";
import SalesforceRestApi from '@ocdla/salesforce/SalesforceRestApi.js';
import SalesforceCompositeRequest from '@ocdla/salesforce/SalesforceCompositeRequest.js';
import chargeCreditCard from './charge.js';
// import { getPrices, getPricebookEntries } from "../../utils/product.js";
import Order from "../../utils/Order.js";


const router = express.Router();
const FORCE_PAYMENT_ERROR = false;
let client;




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




    client = new SalesforceRestApi(url, token);
    let order = new Order(accountId, req.cookies.contact_id);
    order.addLines(Object.values(orderLines));
    order.setPaymentMethod(paymentMethodId);


    let { records: [{ Id: standardPricebookId }] } = await client.query("SELECT Id FROM Pricebook2 WHERE IsStandard = true");
    // Step 1: Get the PricebookEntry for the first productId.
    let pricebookEntries = await getPricebookEntries(Object.values(orderLines));
    order.setPricebook2Id(standardPricebookId);
    order.setPricebookEntries(pricebookEntries);


    let sf = new SalesforceCompositeRequest("Order");
    let body = await order.toObject()
    console.log("PROCESSING ORDER");
    console.dir(body, { depth: null });
    sf.setBody(JSON.stringify(body));

    console.log("COMPOSITE RESPONSE");
    let result = await client.composite(sf);
    let foobar = await result.json();

    console.log(foobar);

    let processTransaction = new Promise((resolve, reject) => {
        if (!order.isCreditCard()) {



            resolve({ Id: "roobar", PostingEntity__c: "Invoice" });
            return;
        }

        chargeCreditCard(order, function(resp) {



            if (resp != null) {
                // parseTransactionResponse(resp);
                let sometingImportantAboutTheResponse = { Id: "roobar", PostingEntity__c: "Invoice" };
                resolve(sometingImportantAboutTheResponse);
            }
            else {
                // var apiError = ctrl.getError();
                //console.log(apiError);
                reject(new Error('Null Response'));
            }

        });
    });


    let cc = await processTransaction.then((order) => {
        client.update("Order", {
            Id: order.Id,
            Status: "Activated"
        })

        return order;
    });


    // Okay, now we can any relevant properties to resp.  For example, OrderNumber, TotalAmount, AuthorizationCode.

    res.json(cc);
});





async function getPricebookEntries(orderLines) {

    const productIds = orderLines.map(line => line.productId);
    const entries = new Map();
    const soql = productIds.map(productId => `'${productId}'`).join(', ');
    const query = `SELECT Id, Product2Id, Pricebook2Id, UnitPrice, Product2.ClickpdxCatalog__LineDescription__c FROM PricebookEntry WHERE Product2Id IN (${soql})`;



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

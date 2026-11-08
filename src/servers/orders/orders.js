import express from "express";
import SalesforceRestApi from '@ocdla/salesforce/SalesforceRestApi.js';
import chargeCreditCard from './charge.js';
// import { getPrices, getPricebookEntries } from "../../utils/product.js";
// import Order from "../../utils/Order.js";


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
    let url = req.cookies.instance_url;
    let token = req.cookies.access_token;
    let paymentMethodId = req.body.paymentMethodId;



    client = new SalesforceRestApi(url, token);


    let order = new Order(accountId);
    order.addLines(Object.values(orderLines));
    let result = await order.insert();

    let orderInfo = await order.getOrderInfo();
    // order.setPaymentMethod(paymentMethodId); // Uncomment and set the payment method if needed


    let processTransaction = new Promise((resolve, reject) => {
        if (!order.isCreditCard())
        {
            resolve();
            return;
        }

        chargeCreditCard(order, function(resp) {



            if (resp != null)
            {
                // parseTransactionResponse(resp);
                let sometingImportantAboutTheResponse = {};
                resolve(sometingImportantAboutTheResponse);
            }
            else
            {
                // var apiError = ctrl.getError();
                //console.log(apiError);
                reject(new Error('Null Response'));
            }




        });
    });


    let cc = await processTransaction();


    // Get interesting stuff from the resp
    let resp = {};
    // Okay, now we can any relevant properties to resp.  For example, OrderNumber, TotalAmount, AuthorizationCode.

    res.json(resp);
});




function parseTransactionResponse(response) {



    if (response.getMessages().getResultCode() == APIContracts.MessageTypeEnum.OK)
    {
        if (response.getTransactionResponse().getMessages() != null)
        {
            console.log('Successfully created transaction with Transaction ID: ' + response.getTransactionResponse().getTransId());
            console.log('Response Code: ' + response.getTransactionResponse().getResponseCode());
            console.log('Message Code: ' + response.getTransactionResponse().getMessages().getMessage()[0].getCode());
            console.log('Description: ' + response.getTransactionResponse().getMessages().getMessage()[0].getDescription());
        }
        else
        {
            console.log('Failed Transaction.');
            if (response.getTransactionResponse().getErrors() != null)
            {
                console.log('Error Code: ' + response.getTransactionResponse().getErrors().getError()[0].getErrorCode());
                console.log('Error message: ' + response.getTransactionResponse().getErrors().getError()[0].getErrorText());
            }
        }
    }
    else
    {
        console.log('Failed Transaction. ');
        if (response.getTransactionResponse() != null && response.getTransactionResponse().getErrors() != null)
        {

            console.log('Error Code: ' + response.getTransactionResponse().getErrors().getError()[0].getErrorCode());
            console.log('Error message: ' + response.getTransactionResponse().getErrors().getError()[0].getErrorText());
        }
        else
        {
            console.log('Error Code: ' + response.getMessages().getMessage()[0].getCode());
            console.log('Error message: ' + response.getMessages().getMessage()[0].getText());
        }
    }


}



function doSomething() {





}




export default router;

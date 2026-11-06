/**
 * Example of how to charge a credit card using the Authorize.Net API.
 */

// 1. Import the default object from the package
import AuthorizeNet from 'authorizenet';

// 2. Extract the sub-modules you need
const { APIContracts, APIControllers } = AuthorizeNet;


const AUTHORIZE_NET_API_LOGIN_ID = process.env.AUTHORIZE_NET_API_LOGIN_ID;
const AUTHORIZE_NET_TRANSACTION_KEY = process.env.AUTHORIZE_NET_TRANSACTION_KEY;
const SAMPLE_CHARGE_AMOUNT = 120.00; // Example charge amount

// REPLACE COMMON JS WITH ABOVE IMPORTS.
// var APIContracts = require('authorizenet').APIContracts;
// var APIControllers = require('authorizenet').APIControllers;
// var SDKConstants = require('authorizenet').Constants;




// var utils = require('../utils.js');
// var constants = require('../constants.js');



export default function chargeCreditCard(callback) {
    var merchantAuthenticationType = new APIContracts.MerchantAuthenticationType();
    merchantAuthenticationType.setName(AUTHORIZE_NET_API_LOGIN_ID);
    merchantAuthenticationType.setTransactionKey(AUTHORIZE_NET_TRANSACTION_KEY);

    var creditCard = new APIContracts.CreditCardType();
    creditCard.setCardNumber('4242424242424242');
    creditCard.setExpirationDate('0842');
    creditCard.setCardCode('999');

    var paymentType = new APIContracts.PaymentType();
    paymentType.setCreditCard(creditCard);

    var orderDetails = new APIContracts.OrderType();
    orderDetails.setInvoiceNumber('INV-12345');
    orderDetails.setDescription('Product Description');

    var billTo = new APIContracts.CustomerAddressType();
    billTo.setFirstName('Ellen');
    billTo.setLastName('Johnson');
    billTo.setCompany('Souveniropolis');
    billTo.setAddress('14 Main Street');
    billTo.setCity('Pecan Springs');
    billTo.setState('TX');
    billTo.setZip('44628');
    billTo.setCountry('USA');

    var lineItem_id1 = new APIContracts.LineItemType();
    lineItem_id1.setItemId('1');
    lineItem_id1.setName('vase');
    lineItem_id1.setDescription('cannes logo');
    lineItem_id1.setQuantity('18');
    lineItem_id1.setUnitPrice(45.00);

    var lineItem_id2 = new APIContracts.LineItemType();
    lineItem_id2.setItemId('2');
    lineItem_id2.setName('vase2');
    lineItem_id2.setDescription('cannes logo2');
    lineItem_id2.setQuantity('28');
    lineItem_id2.setUnitPrice('25.00');

    var lineItemList = [];
    lineItemList.push(lineItem_id1);
    lineItemList.push(lineItem_id2);

    var lineItems = new APIContracts.ArrayOfLineItem();
    lineItems.setLineItem(lineItemList);

    var transactionSetting1 = new APIContracts.SettingType();
    transactionSetting1.setSettingName('duplicateWindow');
    transactionSetting1.setSettingValue('120');

    var transactionSetting2 = new APIContracts.SettingType();
    transactionSetting2.setSettingName('recurringBilling');
    transactionSetting2.setSettingValue('false');

    var transactionSettingList = [];
    transactionSettingList.push(transactionSetting1);
    transactionSettingList.push(transactionSetting2);

    var transactionSettings = new APIContracts.ArrayOfSetting();
    transactionSettings.setSetting(transactionSettingList);


    // Figure out what we really need for this function
    // Reflect teh actual order data
    var transactionRequestType = new APIContracts.TransactionRequestType();
    transactionRequestType.setTransactionType(APIContracts.TransactionTypeEnum.AUTHCAPTURETRANSACTION);
    transactionRequestType.setPayment(paymentType);
    transactionRequestType.setAmount(SAMPLE_CHARGE_AMOUNT);
    transactionRequestType.setLineItems(lineItems);
    transactionRequestType.setOrder(orderDetails);
    transactionRequestType.setBillTo(billTo);
    transactionRequestType.setTransactionSettings(transactionSettings);

    var createRequest = new APIContracts.CreateTransactionRequest();
    createRequest.setMerchantAuthentication(merchantAuthenticationType);
    createRequest.setTransactionRequest(transactionRequestType);

    // Pretty print request
    console.log(JSON.stringify(createRequest.getJSON(), null, 2));

    var ctrl = new APIControllers.CreateTransactionController(createRequest.getJSON());
    //Defaults to sandbox
    //ctrl.setEnvironment(SDKConstants.endpoint.production);

    ctrl.execute(function() {

        var apiResponse = ctrl.getResponse();

        if (apiResponse != null) var response = new APIContracts.CreateTransactionResponse(apiResponse);

        //pretty print response
        console.log(JSON.stringify(response, null, 2));

        if (response != null) {
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
        else {
            var apiError = ctrl.getError();
            console.log(apiError);
            console.log('Null Response.');
        }

        callback(response);
    });
}


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

    var tax = new APIContracts.ExtendedAmountType();
    tax.setAmount('4.26');
    tax.setName('level2 tax name');
    tax.setDescription('level2 tax');

    var duty = new APIContracts.ExtendedAmountType();
    duty.setAmount('8.55');
    duty.setName('duty name');
    duty.setDescription('duty description');

    var shipping = new APIContracts.ExtendedAmountType();
    shipping.setAmount('8.55');
    shipping.setName('shipping name');
    shipping.setDescription('shipping description');

    var billTo = new APIContracts.CustomerAddressType();
    billTo.setFirstName('Ellen');
    billTo.setLastName('Johnson');
    billTo.setCompany('Souveniropolis');
    billTo.setAddress('14 Main Street');
    billTo.setCity('Pecan Springs');
    billTo.setState('TX');
    billTo.setZip('44628');
    billTo.setCountry('USA');

    var shipTo = new APIContracts.CustomerAddressType();
    shipTo.setFirstName('China');
    shipTo.setLastName('Bayles');
    shipTo.setCompany('Thyme for Tea');
    shipTo.setAddress('12 Main Street');
    shipTo.setCity('Pecan Springs');
    shipTo.setState('TX');
    shipTo.setZip('44628');
    shipTo.setCountry('USA');

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

    var userField_a = new APIContracts.UserField();
    userField_a.setName('A');
    userField_a.setValue('Aval');

    var userField_b = new APIContracts.UserField();
    userField_b.setName('B');
    userField_b.setValue('Bval');

    var userFieldList = [];
    userFieldList.push(userField_a);
    userFieldList.push(userField_b);

    var userFields = new APIContracts.TransactionRequestType.UserFields();
    userFields.setUserField(userFieldList);

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

    var transactionRequestType = new APIContracts.TransactionRequestType();
    transactionRequestType.setTransactionType(APIContracts.TransactionTypeEnum.AUTHCAPTURETRANSACTION);
    transactionRequestType.setPayment(paymentType);
    transactionRequestType.setAmount(SAMPLE_CHARGE_AMOUNT);
    transactionRequestType.setLineItems(lineItems);
    transactionRequestType.setUserFields(userFields);
    transactionRequestType.setOrder(orderDetails);
    transactionRequestType.setTax(tax);
    transactionRequestType.setDuty(duty);
    transactionRequestType.setShipping(shipping);
    transactionRequestType.setBillTo(billTo);
    transactionRequestType.setShipTo(shipTo);
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

        if (response != null)
        {
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
        else
        {
            var apiError = ctrl.getError();
            console.log(apiError);
            console.log('Null Response.');
        }

        callback(response);
    });
}


// createCustomerProfileFromTransaction();



function createCustomerProfileFromTransaction() {
    // 1. Setup Merchant Authentication
    const merchantAuthenticationType = new APIContracts.MerchantAuthenticationType();
    merchantAuthenticationType.setName('YOUR_API_LOGIN_ID');
    merchantAuthenticationType.setTransactionKey('YOUR_TRANSACTION_KEY');

    // 2. Set up Payment Data (Example using Accept.js opaque data / nonce)
    const opaqueData = new APIContracts.OpaqueDataType();
    opaqueData.setDataValue('COMMON.ACCEPT.INAPP.NONCE'); // Replace with your actual nonce
    opaqueData.setDataSource('COMMON.ACCEPT.INAPP');

    const paymentType = new APIContracts.PaymentType();
    paymentType.setOpaqueData(opaqueData);

    // 3. Set up Customer Info (Required to populate the profile name/email)
    const customerData = new APIContracts.CustomerDataType();
    customerData.setType(APIContracts.CustomerTypeEnum.INDIVIDUAL);
    customerData.setId('CUSTOMER_INTERNAL_ID_123');
    customerData.setEmail('customer@example.com');

    // 4. Create the Transaction Request Object
    const transactionRequestType = new APIContracts.TransactionRequestType();
    transactionRequestType.setTransactionType(APIContracts.TransactionTypeEnum.AUTHONLYTRANSACTION); // or AUTHCAPTURETRANSACTION
    transactionRequestType.setAmount('49.99');
    transactionRequestType.setPayment(paymentType);
    transactionRequestType.setCustomer(customerData);

    // CRITICAL STEP: Direct Authorize.net to generate a CIM profile from this transaction
    transactionRequestType.setProfileInsideTransactionRequest(true);

    // 5. Wrap inside the ultimate CreateTransactionRequest container
    const createRequest = new APIContracts.CreateTransactionRequest();
    createRequest.setMerchantAuthentication(merchantAuthenticationType);
    createRequest.setTransactionRequest(transactionRequestType);

    // 6. Execute the Request
    const ctrl = new APIControllers.CreateTransactionController(createRequest.getJSON());

    // Switch to production environment when ready using standard endpoint adjustments
    // ctrl.setEnvironment(SDKConstants.endpoint.production); 

    ctrl.execute(function() {
        const apiResponse = ctrl.getResponse();
        const response = new APIContracts.CreateTransactionResponse(apiResponse);

        if (response != null)
        {
            if (response.getMessages().getResultCode() === APIContracts.MessageTypeEnum.OK)
            {
                const transactionResponse = response.getTransactionResponse();

                if (transactionResponse != null && transactionResponse.getMessages() != null)
                {
                    console.log(`Transaction Success! ID: ${transactionResponse.getTransId()}`);

                    // EXTRACTION: Retrieve your newly generated profile IDs
                    const profileResponse = transactionResponse.getProfileResponse();
                    if (profileResponse != null)
                    {
                        console.log(`Generated Customer Profile ID: ${profileResponse.getCustomerProfileId()}`);
                        console.log(`Generated Payment Profile ID: ${profileResponse.getCustomerPaymentProfileIdList().getNumericString()[0]}`);
                    }
                } else
                {
                    console.error('Transaction Failed:', transactionResponse.getErrors().getError()[0].getErrorText());
                }
            } else
            {
                console.error('API Error:', response.getMessages().getMessage()[0].getText());
            }
        } else
        {
            console.error('Null response received from Authorize.Net.');
        }
    });
}


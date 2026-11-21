import AuthorizeNet from 'authorizenet';

const { APIContracts, APIControllers } = AuthorizeNet;


const AUTHORIZE_NET_API_LOGIN_ID = process.env.AUTHORIZE_NET_API_LOGIN_ID;
const AUTHORIZE_NET_TRANSACTION_KEY = process.env.AUTHORIZE_NET_TRANSACTION_KEY;

export default function chargeCreditCard(order, cc, callback) {
    var merchantAuthenticationType = new APIContracts.MerchantAuthenticationType();
    merchantAuthenticationType.setName(AUTHORIZE_NET_API_LOGIN_ID);
    merchantAuthenticationType.setTransactionKey(AUTHORIZE_NET_TRANSACTION_KEY);



    var creditCard = new APIContracts.CreditCardType();
    creditCard.setCardNumber(cc.cardNumber);
    creditCard.setExpirationDate(cc.expirationDate);
    creditCard.setCardCode(cc.cardCode);

    var paymentType = new APIContracts.PaymentType();
    paymentType.setCreditCard(creditCard);

    var orderDetails = new APIContracts.OrderType();
    orderDetails.setInvoiceNumber(order.OrderNumber);
    orderDetails.setDescription(getOrderDescription(order.lineItems));


    var billTo = new APIContracts.CustomerAddressType();
    billTo.setFirstName(order.FirstName);
    billTo.setLastName(order.LastName);
    // billTo.setCompany('Souveniropolis');
    // billTo.setAddress('14 Main Street');
    // billTo.setCity('Pecan Springs');
    // billTo.setState('TX');
    // billTo.setZip('44628');
    // billTo.setCountry('USA');


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
    transactionRequestType.setAmount(order.Amount);
    transactionRequestType.setLineItems(addLineItems(order.lineItems));
    transactionRequestType.setOrder(orderDetails);
    transactionRequestType.setBillTo(billTo);
    transactionRequestType.setTransactionSettings(transactionSettings);

    var createRequest = new APIContracts.CreateTransactionRequest();
    createRequest.setMerchantAuthentication(merchantAuthenticationType);
    createRequest.setTransactionRequest(transactionRequestType);

    const requestJson = createRequest.getJSON();

    var ctrl = new APIControllers.CreateTransactionController(requestJson);

    ctrl.execute(function() {

        var apiResponse = ctrl.getResponse();

        if (apiResponse != null) var response = new APIContracts.CreateTransactionResponse(apiResponse);

        console.log(JSON.stringify(response, null, 2));

        callback(response);
    });
}





function addLineItems(orderLines) {
    const itemList = orderLines.map(line => {
        const item = new APIContracts.LineItemType();

        item.setItemId(line.id);
        item.setName(line.name.slice(0, 31));
        item.setDescription((line.description ?? "").slice(0, 255));
        item.setQuantity(line.quantity);
        item.setUnitPrice(line.unitPrice);

        return item;
    });

    const lineItems = new APIContracts.ArrayOfLineItem();
    lineItems.setLineItem(itemList);

    return lineItems;
}


function getOrderDescription(orderLines) {
    const productQuantities = new Map();

    for (const line of orderLines) {
        const quantity = productQuantities.get(line.name) ?? 0;
        productQuantities.set(line.name, quantity + line.quantity);
    }

    const description = [...productQuantities]
        .map(([name, quantity]) => `${quantity} x ${name}`)
        .join(", ")
        .slice(0, 255);

    return description;
}

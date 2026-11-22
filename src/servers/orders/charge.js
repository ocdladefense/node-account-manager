import AuthorizeNet from 'authorizenet';
import Order from "../../utils/Order.js";


const { APIContracts, APIControllers } = AuthorizeNet;


const AUTHORIZE_NET_API_LOGIN_ID = process.env.AUTHORIZE_NET_API_LOGIN_ID;
const AUTHORIZE_NET_TRANSACTION_KEY = process.env.AUTHORIZE_NET_TRANSACTION_KEY;

export default function chargeCreditCard(order, cc) {
    var credentials = new APIContracts.MerchantAuthenticationType();
    credentials.setName(AUTHORIZE_NET_API_LOGIN_ID);
    credentials.setTransactionKey(AUTHORIZE_NET_TRANSACTION_KEY);

    var creditCard = new APIContracts.CreditCardType();
    creditCard.setCardNumber(cc.getCardNumber());
    creditCard.setExpirationDate(cc.getExpirationDate());
    creditCard.setCardCode(cc.getCardCode());

    var paymentType = new APIContracts.PaymentType();
    paymentType.setCreditCard(creditCard);

    var orderDetails = new APIContracts.OrderType();
    orderDetails.setInvoiceNumber(order.OrderNumber);
    orderDetails.setDescription(Order.getOrderDescription(order.lineItems));

    var billTo = new APIContracts.CustomerAddressType();
    billTo.setFirstName(order.FirstName);
    billTo.setLastName(order.LastName);
    // billTo.setCompany('Souveniropolis');
    // billTo.setAddress('14 Main Street');
    // billTo.setCity('Pecan Springs');
    // billTo.setState('TX');
    // billTo.setZip('44628');
    // billTo.setCountry('USA');


    var config1 = new APIContracts.SettingType();
    config1.setSettingName('duplicateWindow');
    config1.setSettingValue('120');

    var config2 = new APIContracts.SettingType();
    config2.setSettingName('recurringBilling');
    config2.setSettingValue('false');

    var configs = new APIContracts.ArrayOfSetting();
    configs.setSetting([config1, config2]);


    // finding a new home for this code, but leaving it here for now
    var lineItems = new APIContracts.ArrayOfLineItem();
    lineItems.setLineItem(Order.toAuthNetLineItems(order.lineItems, APIContracts));


    var body = new APIContracts.TransactionRequestType();
    body.setTransactionType(APIContracts.TransactionTypeEnum.AUTHCAPTURETRANSACTION);
    body.setPayment(paymentType);
    body.setAmount(order.Amount);
    body.setLineItems(lineItems);
    body.setOrder(orderDetails);
    body.setBillTo(billTo);
    body.setTransactionSettings(configs);



    var req = new APIContracts.CreateTransactionRequest();
    req.setMerchantAuthentication(credentials);
    req.setTransactionRequest(body);

    var ctrl = new APIControllers.CreateTransactionController(req.getJSON());

    return new Promise((resolve, reject) => {
        ctrl.execute(function() {

            var resp = ctrl.getResponse();

            if (resp != null) {
                var response = new APIContracts.CreateTransactionResponse(resp);

                console.log(JSON.stringify(response, null, 2));

                resolve(response);
            }

            else {
                reject(new Error('Failed to create transaction'));
            }

        });
    });
}




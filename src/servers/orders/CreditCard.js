export default class CreditCard {
    constructor(cardNumber, expirationDate, cardCode) {
        this.cardNumber = cardNumber;
        this.expirationDate = expirationDate;
        this.cardCode = cardCode;
    }

    TEST_VISA_CARD_NUMBER = '4242424242424242';
    TEST_VISA_EXPIRATION_DATE = '0842';
    TEST_VISA_CARD_CODE = '999';

    // Authorize.net Test Visa Card credentials
    static newVisaTestCard() {
        return new CreditCard('4242424242424242', '0842', '999');
    }

    getCardNumber() {
        return this.cardNumber;
    }

    getExpirationDate() {
        return this.expirationDate;
    }

    getCardCode() {
        return this.cardCode;
    }

    setCardNumber(cardNumber) {
        this.cardNumber = cardNumber;
    }

    setExpirationDate(expirationDate) {
        this.expirationDate = expirationDate;
    }

    setCardCode(cardCode) {
        this.cardCode = cardCode;
    }


}



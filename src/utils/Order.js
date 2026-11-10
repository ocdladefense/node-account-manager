
export default class Order {

    order = {};

    lines = [];
    contactId = null;
    pricebookEntries = null;
    paymentMethodId = null;
    pricebook2Id = null;

    constructor(accountId, contactId) {
        this.lines = [];


        // Step 2: Construct the Order object in Salesforce.
        // Test Order Record
        this.order = {
            AccountId: accountId,
            EffectiveDate: new Date().toISOString().split('T')[0],
            Status: "Draft",
            Pricebook2Id: null,
            BillToContactId: contactId,
            PostingEntity__c: "Invoice"
        };


    }


    async toObject() {

        if (this.paymentMethodId == "invoice")
        {
            this.order.PostingEntity__c = "Invoice";
        }

        let lines = this.toOrderItems();

        this.order.OrderItems = {
            records: lines.map((line, index) => ({
                attributes: { type: "OrderItem", referenceId: "refItem" + (index + 1) },
                ...line
            }))
        };

        return {
            records: [{ attributes: { type: "Order", referenceId: "refOrder1" }, ...this.order }]
        };
    }


    setPaymentMethod(paymentMethodId) {
        this.paymentMethodId = paymentMethodId;
    }


    setPricebook2Id(standardPricebookId) {
        this.order.Pricebook2Id = standardPricebookId;
    }


    addLines(orderLines) {
        this.lines = this.lines || [];
        this.lines.push(...orderLines);
    }



    setPricebookEntries(pricebookEntries) {
        this.pricebookEntries = pricebookEntries;
    }


    toOrderItems() {

        return this.lines.map(line => {
            const pricebookEntry = this.pricebookEntries.get(line.productId);
            const serverPrice = { price: 0 }; // Placeholder, as serverPrices is not passed here

            return {
                // OrderId: this.orderId,
                PricebookEntryId: pricebookEntry.Id,
                Quantity: 1,
                UnitPrice: serverPrice.price,
                Contact__c: line.contactId,
                Description: pricebookEntry.Product2.ClickpdxCatalog__LineDescription__c
            };
        });

    }


    extract(prop) {

        let vals = [];

        for (let orderLine of this.lines)
        {
            vals.push(orderLine[prop]);
        }
        return vals;
    }





    isCreditCard() {
        return this.paymentMethodId !== "invoice";
    }


    async getOrderInfo() {



        // Salesforce OrderNumber === orderDetails.setInvoiceNumber ???
        const soql = `SELECT Id, OrderNumber, TotalAmount FROM Order WHERE Id = '${this.orderId}'`;
        const resp = await client.query(soql);

        return resp.records?.[0];
    }


    // const priceRequests = Object.values(orderLines).map(line => ({
    //     contactId: line.contactId,
    //     productId: line.productId
    // }));

    // const serverPrices = await getPrices(priceRequests, url, token);

}









export function hashContactIds(arr) {
    // Join array with a separator to preserve string boundaries
    const combinedString = arr.join('|');
    let hash = 0;

    for (let i = 0; i < combinedString.length; i++)
    {
        const char = combinedString.charCodeAt(i);
        // Bitwise operations to generate the 32-bit integer hash
        hash = ((hash << 5) - hash) + char;
        hash |= 0; // Convert to a 32-bit integer
    }

    // Return an unsigned 32-bit integer string in base 36 (alphanumeric)
    return (hash >>> 0).toString(36).padStart(7, '0');
}



export async function updateOrderStatus(orderId, response) {
    // For invoices Status will be Activated;
    // For all others, Status will be Posted Payment.

    const updateResp = await client.update("Order", { Id: orderId, Activate__c: true });
    // const updatedOrderResult = await updateResp.json();


    console.log("updateResp:", updateResp.status);

    if (!updateResp.ok)
    {
        throw new Error(`Failed to update Salesforce Order. Status: ${updateResp.status}`);
    }
}






export function getOrderTotal(orderLines) {
    return Object.values(orderLines).reduce(
        (sum, item) => sum + item.UnitPrice,
        0
    );
}

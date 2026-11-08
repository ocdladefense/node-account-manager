
export default class Order {

    lines = [];


    constructor() {
        this.lines = [];


        // Step 2: Construct the Order object in Salesforce.
        // Test Order Record
        let orderRecord = {
            AccountId: accountId,
            EffectiveDate: new Date().toISOString().split('T')[0],
            Status: "Draft",
            Pricebook2Id: standardPricebookId,
            BillToContactId: req.cookies.contact_id,
        };

        if (paymentMethodId == "invoice")
        {
            orderRecord.PostingEntity__c = "Invoice";
        }
    }


    async loadThings() {


        // Step 1: Get the Pricebook2Id from the first product queried for. Use the key (the productId) for the .get
        let { records: [{ Id: standardPricebookId }] } = await client.query("SELECT Id FROM Pricebook2 WHERE IsStandard = true");


    }


    addLines(orderLines) {
        this.lines = this.lines || [];
        this.lines.push(...orderLines);
    }


    extract(prop) {

        let vals = [];

        for (let orderLine of this.lines)
        {
            vals.push(orderLine[prop]);
        }
        return vals;
    }


    async insert() {


        // Step 1: Get the PricebookEntry for the first productId.
        let pricebookEntries = await getPricebookEntries(productIds);




        // Step 3: Create the Order in Salesforce.
        const { id: orderId } = await client.create("Order", orderRecord);
        this.orderId = orderId;
        let orderLines = toOrderItems(this.orderLines, orderId, pricebookEntries);

        this.insertOrderItems(orderLines);
    }


    async persist() {

        toOrderItems(Object.values(orderLines), orderId, pricebookEntries);

    }



    async insertOrderItems(orderItems) {

        return orderItems.map(async (line) => {
            const result = await client.create("OrderItem", line).then(resp => resp.json());
            return result;
        });
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



// toOrderItems( Object.values(orderLines), orderResult.id, pricebookEntries);

export function toOrderItems(orderLines, orderId, pricebookEntries) {

    let lines = orderLines.map(lineItem => {
        const pricebookEntry = pricebookEntries.get(lineItem.productId);
        const serverPrice = { price: 0 }; // Placeholder, as serverPrices is not passed here

        return {
            OrderId: orderId,
            PricebookEntryId: pricebookEntry.Id,
            Quantity: 1,
            UnitPrice: serverPrice.price,
            Contact__c: lineItem.contactId,
            Description: pricebookEntry.Product2.ClickpdxCatalog__LineDescription__c
        };
    });

    return lines;
}





export function getOrderTotal(orderLines) {
    return Object.values(orderLines).reduce(
        (sum, item) => sum + item.UnitPrice,
        0
    );
}

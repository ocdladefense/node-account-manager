import express from "express";
import path from "path";
import fs from "fs";
import SalesforceRestApi from '@ocdla/salesforce/SalesforceRestApi.js';




const router = express.Router();
const BASE_UPLOADS_DIR = path.resolve("uploads");



/**
 * contactIds - an array of contacts Ids selected from the AccountContacs component.
 * productId - a random product "active" and available on the Sandbox.
 * 
 * Goal - execute Salesforce REST api endpoint to create an single order, with one order product for each contactId in the array.
 */
router.post("/orders", async (req, res) => {

    const product2Id = req.body.productId;
    const contactIds = ["003hr000000NvVR"];//req.body.contactIds;

    let url = req.cookies.instance_url;
    let token = req.cookies.access_token;

    let client = new SalesforceRestApi(url, token);
    let orderRecord = { Name: "Foobar 2", AccountId: req.cookies.account_id, EffectiveDate: new Date().toISOString().split('T')[0], Status: 'Draft' };

    let pricebookIdResp = await client.query(`SELECT Id FROM Pricebook2 WHERE IsActive = true AND IsStandard = true LIMIT 1`);
    console.log("orders.js: pricebookIdResp: ", pricebookIdResp);
    // let json = await pricebookIdResp.json();
    let pricebookId = pricebookIdResp.records[0].Id;
    orderRecord.Pricebook2Id = pricebookId;

    let pricebookEntryResp = await client.query(`SELECT Id FROM PricebookEntry WHERE Product2Id = '${product2Id}' AND IsActive = true LIMIT 1`);
    console.log("orders.js: pricebookEntryResp: ", pricebookEntryResp);
    // let json = await pricebookEntryResp.json();
    let pricebookEntryId = pricebookEntryResp.records[0].Id;

    // Next step: insert an order product using the required data, OrderId.

    let resp = await client.create('Order', orderRecord);
    let jsonResp = await resp.json(); // Should return the id of the newly-created order record.


    let orderId = jsonResp.id;

    for (let contactId of contactIds)
    {
        let orderProductRecord = { OrderId: orderId, Contact__c: contactId, PricebookEntryId: pricebookEntryId, Quantity: 1, UnitPrice: 100.00 };
        let orderProductResp = await client.create('OrderItem', orderProductRecord);
        let orderProductJsonResp = await orderProductResp.json();
        console.log("orders.js: created order product record: ", orderProductJsonResp);
    }

    res.json(jsonResp);
});

export default router;

import express from "express";
import SalesforceRestApi from "@ocdla/salesforce/SalesforceRestApi.js";

const router = express.Router();

router.post("/payment-method", async (req, res) => {

    console.log("payment method route successful");

    const instanceUrl = req.cookies.instance_url;
    const accessToken = req.cookies.access_token;

    const client = new SalesforceRestApi(instanceUrl, accessToken);



    const record = {
        Name: "TEST-PAYMENT-METHOD",
        Last4Digits__c: 1234,
        NameOnCard__c: "Somebody Tolove",
        CardType__c: "Discover"
    };

    const resp = await client.create(
        "PaymentMethod__c",
        record
    );

    const data = await resp.json();

    console.log("create post response:", data);


    if (!resp.ok) {
        return res.status(resp.status).json({
            error: "Failed to create payment method.",
            details: data
        });
    }

    res.status(201).json({
        message: "Payment method created.",
        id: data.id,
        record: record
    });

});

export default router;

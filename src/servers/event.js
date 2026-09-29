import express from "express";

const router = express.Router();

router.post("/event/recommendations", async (req, res) => {

    const { contactIds, eventId } = req.body;

    const recommendations = new Map();

    const PRODUCT_ID = "01thr0000008NytAAE";

    contactIds.forEach((contactId) => { recommendations.set(contactId, PRODUCT_ID); });

    return res.json({ recommendations: Object.fromEntries(recommendations) });
});

export default router;

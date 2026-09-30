import express from "express";

const router = express.Router();

router.post("/event/recommendations", async (req, res) => {

    const { contactIds, eventId } = req.body;

    const recommendations = new Map();

    const MEMBER_PRODUCT_ID = "01thr0000008NytAAE";
    const NON_MEMBER_PRODUCT_ID = "01thr0000008Np4AAE";

    contactIds.forEach((contactId, index) => {

        const productId = index % 2 === 0 ? MEMBER_PRODUCT_ID : NON_MEMBER_PRODUCT_ID;

        recommendations.set(contactId, productId);
    });

    return res.json({ recommendations: Object.fromEntries(recommendations) });
});

export default router;

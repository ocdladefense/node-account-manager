import express from "express";

const router = express.Router();

router.post("/event/recommendations", async (req, res) => {

    const { contactIds, eventId } = req.body;

    const recommendations = new Map();

    contactIds.forEach((contactId) => { recommendations.set(contactId, null); });

    return res.json({ recommendations: Object.fromEntries(recommendations) });
});

export default router;

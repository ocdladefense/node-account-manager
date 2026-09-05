import express from "express";

const router = express.Router();

router.get("/payment-method/test", (req, res) => {
    res.json({
        message: "payment route is working"
    });
});

export default router;

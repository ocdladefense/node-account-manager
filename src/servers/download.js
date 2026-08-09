import express from "express";
import multer from "multer";
import path from "path";
import mime from 'mime';

const router = express.Router();

router.get("/download/:filename", (req, res) => {
    const userId = req.cookies.user_id;
    const { filename } = req.params;

    if (!userId) {
        return res.status(401).send("Missing user ID");
    }

    const filePath = path.join("uploads", userId, filename);

    const contentType =
        mime.getType(filePath) || "application/octet-stream";

    res.setHeader("Content-Type", contentType);

    res.download(filePath, filename, (err) => {
        if (err) {
            console.error("download.js: Download error:", err);
        }
    });
});

export default router;

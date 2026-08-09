import express from "express";
import multer from "multer";
import path from "path";
import mime from 'mime';

const router = express.Router();

router.get("/download/:filename", (req, res) => {
    const contactId = req.cookies.contact_id;
    const { filename } = req.params;

    if (!contactId) {
        return res.status(401).send("Missing contact ID");
    }

    const filePath = path.join("uploads", contactId, filename);


    // Use MIME type from Salesforce, fallback to MIMI type using npm package detection,
    // then finally fall back to better safe than sorry method: octet-stream (unknown binary file)
    const contentType = type || mime.getType(filename) || 'application/octet-stream';

    res.setHeader('Content-Type', contentType);
    res.download(filePath, filename, (err) => {
        if (err) console.error("download.js: Download error:", err);
    });
});

export default router;

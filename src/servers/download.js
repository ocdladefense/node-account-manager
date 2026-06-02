import express from "express";
import multer from "multer";
import path from "path";
import mime from 'mime';

const router = express.Router();

router.get("/download/:contactId/:filename", (req, res) => {
    const { contactId, filename } = req.params;
    const { type } = req.query;
    const filePath = path.join("uploads", contactId, filename);

    // Use MIME type from Salesforce, fallback to MIMI type using npm package detection,
    // then finally fall back to better safe than sorry method: octet-stream (unknown binary file)
    const contentType = type || mime.getType(filename) || 'application/octet-stream';

    res.setHeader('Content-Type', contentType);
    res.download(filePath, filename, (err) => {
        if (err) console.error("Download error:", err);
    });
});

export default router;

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


// fs.readdirSync() is a Node.js file system method that synchronously reads the contents of a directory and returns an array of filenames/entries.

// Potential changes for fetching files from server instead of Salesforce
// const resp = await fetch(`/files/${contactId}`);
// const files = await resp.json();
// setFiles(files);

// try {
//     if (!fs.existsSync(dirPath)) {
//         return res.json([]);
//     }

//     const files = fs.readdirSync(dirPath).map(filename => ({
//         filename,
//         path: `/download/${contactId}/${filename}`,
//         // Optional: add server file metadata
//         size: fs.statSync(path.join(dirPath, filename)).size,
//         lastModified: fs.statSync(path.join(dirPath, filename)).mtime
//     }));

//     res.json(files);
// } catch (error) {
//     res.status(500).json({ error: error.message });
// }

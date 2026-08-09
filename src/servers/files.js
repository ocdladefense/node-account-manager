import express from "express";
import path from "path";
import fs from "fs";

const router = express.Router();

router.get("/files", (req, res) => {
    const userId = req.cookies.user_id;

    if (!userId) {
        return res.status(401).json({
            error: "Missing user ID"
        });
    }

    const uploadsPath = path.resolve("uploads");
    const directoryPath = path.resolve(uploadsPath, userId);

    if (
        directoryPath !== uploadsPath &&
        !directoryPath.startsWith(uploadsPath + path.sep)
    ) {
        return res.status(400).json({
            error: "Invalid path"
        });
    }

    fs.readdir(directoryPath, { withFileTypes: true }, (err, entries) => {
        if (err) {
            if (err.code === "ENOENT") {
                return res.json([]);
            }

            console.error("files.js: Error reading directory:", err);

            return res.status(500).json({
                error: "Unable to read directory"
            });
        }

        const files = entries
            .filter((entry) => entry.isFile())
            .map((entry) => {
                const filePath = path.join(directoryPath, entry.name);
                const stats = fs.statSync(filePath);

                return {
                    id: path.join(userId, entry.name),
                    name: entry.name,
                    size: stats.size,
                    type: path.extname(entry.name).slice(1),
                    dateCreated: stats.birthtime
                };
            });

        res.json(files);
    });
});

export default router;

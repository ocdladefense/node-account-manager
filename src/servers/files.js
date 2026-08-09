import express from "express";
import path from "path";
import fs from "fs";

const router = express.Router();
const BASE_UPLOADS_DIR = path.resolve("uploads");




router.post("/files", (req, res) => {

    const subpath = req.body.subpath;

    // throw an error if subpath is not a string.
    if (typeof subpath !== "string" || subpath.trim() === "") {
        return res.status(400).json({
            error: "Invalid subpath"
        });
    }

    const directoryPath = path.resolve(BASE_UPLOADS_DIR, subpath);

    if (
        directoryPath !== BASE_UPLOADS_DIR &&
        !directoryPath.startsWith(BASE_UPLOADS_DIR + path.sep)
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
                    id: path.join(subpath, entry.name),
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

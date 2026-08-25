/**
 * https://expressjs.com/en/starter/hello-world.html
 * OpenID: https://help.salesforce.com/s/articleView?id=xcloud.remoteaccess_using_openid.htm&type=5
 * So we can extract some user information.
 */

import path from "path";
import { fileURLToPath } from 'url';
import crypto from 'crypto';
import cors from "cors";
import 'dotenv/config';
import express from 'express';
import cookieParser from 'cookie-parser';
import cacheRoutes from './cache.js';
import geocodeRoutes from './geocode.js';
import authRoutes from './auth.js';
import districtRoutes from './district.js';
import legislatorsRoutes from './legislators.js';
import uploadRoutes from './upload.js';
import downloadRoutes from './download.js';
import filesRoutes from "./files.js";
import orderRoutes from "./orders.js";
import fs from 'fs';
import accountContactsRoutes from "./accountContacts.js";
import eventProductsRoutes from "./eventProducts.js";

const app = express();
const port = process.env.PORT || 80;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ALPHANUMERIC_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

/**
 * Generates a cryptographically secure, random alphanumeric string to set as an id.
 * @param {number} [length=16] - The desired character length of the ID.
 * @returns {string} The generated unique ID.
 */
function createUniqueAlphanumericId(length = 16) {
    let id = '';

    while (id.length < length) {
        id += ALPHANUMERIC_CHARS[crypto.randomInt(0, ALPHANUMERIC_CHARS.length)];
    }

    return id;
}


console.log("app.js: server current working directory: ", process.cwd());


// Serve static files from the 'dist' directory
app.use(cookieParser());
app.use(express.json());
app.use(cors());
app.use(express.static('dist'));
app.use('/uploads', express.static('uploads'));
app.use('/', cacheRoutes);
app.use('/', geocodeRoutes);
app.use('/', authRoutes);
app.use('/', districtRoutes);
app.use('/', legislatorsRoutes);
app.use('/', uploadRoutes);
app.use('/', downloadRoutes);
app.use("/", filesRoutes);
app.use("/", orderRoutes);
app.use("/", accountContactsRoutes);
app.use("/", eventProductsRoutes);





// Define a route to serve index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(process.cwd(), 'dist', 'index.html'));
});




// route to delete uploaded files
app.delete("/delete", (req, res) => {
    const filePath = req.body.path;
    const isDirectory = req.body.isDirectory || false;
    const recursive = req.body.recursive || false;

    const rmdirOptions = { recursive: recursive, force: true };

    const uploadsDir = path.join(process.cwd(), "uploads");
    const absolutePath = path.join(uploadsDir, filePath);

    if (!absolutePath.startsWith(uploadsDir)) {
        return res.status(400).json({
            success: false,
            error: "Invalid path"
        });
    }

    if (isDirectory) {
        fs.rm(absolutePath, rmdirOptions, err => {
            if (err) {
                return res.status(500).json({
                    success: false,
                    error: err.message
                });
            }

            res.json({
                success: true
            });
        });
    }

    else {
        fs.unlink(absolutePath, err => {
            if (err) {
                return res.status(500).json({
                    success: false,
                    error: err.message
                });
            }

            res.json({
                success: true
            });
        });

        let dirPath = absolutePath.substring(0, absolutePath.lastIndexOf("/"));
        const files = fs.readdirSync(dirPath);

        if (files.length == 0) {
            fs.rmdir(dirPath, () => { });
        }
    }
});




// Define a route to serve index.html
app.all('/{*any}', (req, res) => {
    res.sendFile(path.join(process.cwd(), 'dist', 'index.html'));
});




// Start the server
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
    console.log(`dev link: http://localhost:${port}/`)
});

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
import queryRoutes from "./query.js";
import paymentMethodRoutes from "./payment-method.js";
import eventRoutes from "./event.js";
import productSuggestionRoutes from "./product-suggestion.js";
import { createCanvas } from 'canvas';

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

    while (id.length < length)
    {
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
app.use('/', filesRoutes);
app.use('/', orderRoutes);
app.use('/', queryRoutes);
app.use("/", paymentMethodRoutes);
app.use("/", eventRoutes);
app.use("/", productSuggestionRoutes);



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

    if (!absolutePath.startsWith(uploadsDir))
    {
        return res.status(400).json({
            success: false,
            error: "Invalid path"
        });
    }

    if (isDirectory)
    {
        fs.rm(absolutePath, rmdirOptions, err => {
            if (err)
            {
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

    else
    {
        fs.unlink(absolutePath, err => {
            if (err)
            {
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

        if (files.length == 0)
        {
            fs.rmdir(dirPath, () => { });
        }
    }
});


/**
 * GET /api/cover
 * Query Params: ?title=Your+Title&date=Your+Date
 */
app.get('/api/cover', (req, res) => {
    // Extract query parameters with fallbacks if missing
    const title = req.query.title || 'Untitled Book';
    const date = req.query.date || 'Unknown Date';

    try
    {
        const imgBuffer = generateCoverBuffer(title, date);

        // Set content type header to PNG and send the image binary
        res.setHeader('Content-Type', 'image/png');
        res.send(imgBuffer);
    } catch (error)
    {
        console.error('Error generating cover:', error);
        res.status(500).json({ error: 'Failed to generate book cover' });
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






/**
 * Helper function to generate canvas buffer
 */
function generateCoverBuffer(title) {
    const width = 500;
    const height = 500;
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');

    // 1. Background Gradient (White on Blue Theme)
    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, '#1e3c72'); // Deep blue
    gradient.addColorStop(1, '#2a5298'); // Lighter slate blue
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // 2. Main Typography Styling (Bold Sans-Serif / Upper-case formatting)
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.fillStyle = '#ffffff'; // Pure white text

    // 3. Process wrapped book title across the expanded width
    ctx.font = 'bold 36px Sans-Serif';
    const words = title.toUpperCase().split(' ');
    let lines = [];
    let currentLine = '';

    // Position text with comfortable padding from the canvas edges
    const textStartX = 40;
    const maxTextWidth = width - (textStartX * 2);

    for (let n = 0; n < words.length; n++)
    {
        let testLine = currentLine + words[n] + ' ';
        let metrics = ctx.measureText(testLine);
        if (metrics.width > maxTextWidth && n > 0)
        {
            lines.push(currentLine.trim());
            currentLine = words[n] + ' ';
        } else
        {
            currentLine = testLine;
        }
    }
    lines.push(currentLine.trim());

    // Print out the book header lines starting from the top padding area
    let textY = 40;
    lines.forEach((line) => {
        ctx.fillText(line, textStartX, textY);
        textY += 46; // Line height spacing
    });

    // Return raw PNG image stream data buffer
    return canvas.toBuffer('image/png');
}

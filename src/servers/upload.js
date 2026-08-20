import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";

const Registered_Applications = {
    1: {
        name: "picture",
        destination: (req, file, cb) => {
            const contactId = process.env.SF_CONTACT_ID;

            if (!contactId) {
                return cb(new Error("Missing contactId"));
            }

            const dir = path.join("uploads", contactId);

            // create folder if it doesn't exist
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
            }

            cb(null, dir);
        },
        filename: (req, file, cb) => {
            const contactId = process.env.SF_CONTACT_ID;
            cb(null, file.originalname);
        }
    },
    2: {
        name: "documents",

        destination: (req, file, cb) => {
            const userId = req.cookies.user_id;

            if (!userId) {
                return cb(new Error("Missing userId"));
            }

            const dir = path.join("uploads", userId);

            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
            }

            cb(null, dir);
        },

        filename: (req, file, cb) => {
            cb(null, file.originalname);
        }
    },
    3: {
        name: "jobPosting",
        destination: (req, file, cb) => {
            // const contactId = process.env.SF_CONTACT_ID;
            const jobId = req.body.jobId;

            if (!jobId) {
                return cb(new Error("Missing jobId"));
            }

            const dir = path.join("uploads", "JobPostings", jobId);

            // create folder if it doesn't exist
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
            }

            cb(null, dir);
        },
        filename: (req, file, cb) => {
            cb(null, file.originalname);
        }
    }
};

const router = express.Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        console.log("upload.js: upload req.headers: ", req.headers);
        let appId = req.headers["x-applicationid"];
        if (!appId) {
            throw new Error("No application Id provided.")
        }
        console.log("upload.js: App Id:" + appId);
        let app = Registered_Applications[appId];
        console.log("upload.js: App: ", app);
        let destination = app.destination;

        destination(req, file, cb);
        // cb(null, dir);
    },

    filename: (req, file, cb) => {
        let appId = req.headers["x-applicationid"];
        let app = Registered_Applications[appId];
        let filename = app.filename;
        filename(req, file, cb);
        // cb(null, fileName);
    }

});

const upload = multer({
    storage: storage,
    limits: { fileSize: 10000000000 },
    fileFilter: function(req, file, cb) {
        checkFileType(file, cb);
    }
});

//moved outside of checkFileType so that it does not run everytime a document is uploaded
const allowedFileTypes = ["jpeg", "jpg", "png", "gif", "pdf", "odt", "docx"];
const fileTypeMap = allowedFileTypes.map(str => str.replace(/[|\\{}()[\]^$+*?.]/g, '\\$&')) // Escape special regex characters so they are treated as literal text 
const fileTypeRegex = new RegExp(fileTypeMap.join('|'));

function checkFileType(file, cb) {

    const extname = fileTypeRegex.test(path.extname(file.originalname).toLowerCase());
    //const mimetype = fileTypeRegex.test(file.mimetype);

    if (extname /* && mimetype */) { 
        return cb(null, true);
    } else {
        cb(`Error: only (${allowedFileTypes.toString()}) file types are allowed. "${path.extname(file.originalname).toLowerCase()}" files are not allowed.`);
    }

}

router.post("/upload", upload.array("files", 10), (req, res) => {
    // req.files gets populated when using upload.arrray
    // req.flle gets populated when using upload.single
    res.json({
        success: true
    });
});

export default router;

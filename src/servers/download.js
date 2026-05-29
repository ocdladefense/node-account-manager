import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";

const Registered_Applications = {
    2: {
        name: "documents",
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
    }
};

const router = express.Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        console.log(req.headers);
        let appId = req.headers["x-applicationid"];
        console.log("App Id:" + appId);
        let app = Registered_Applications[appId];
        console.log("App:" + app);
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

function checkFileType(file, cb) {
    const filetypes = /jpeg|jpg|png|gif|pdf/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb('Error: Images only! (jpeg, jpg, png, gif)');
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

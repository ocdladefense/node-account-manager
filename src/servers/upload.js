import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";

const Registered_Applications = {
    abcd123: {
        name: "ProfilePicture",
        destination: (req, file, cb) => {

            const contactId = req.params.contactId;

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
            const contactId = req.params.contactId;
            const ext = path.extname(file.originalname);

            // ? category = ${ uploadFile.category }
            let category = "profile-picture";

            let fileName;

            if (category === "profile-picture") {
                fileName = `PF${contactId}${ext}`;
            }
            else if (category === "expert-document") {
                fileName = `ExpertDoc.${contactId}${ext}`;
            }
            else {
                return cb(new Error("Invalid or missing category"));
            }

            cb(null, fileName);
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


    //Profile Picture Name

});

const upload = multer({
    storage: storage,
    limits: { fileSize: 1000000 },
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

router.post("/uploads/:contactId", upload.single("file"), (req, res) => {

    if (!req.file) {
        return res.status(400).json({
            success: false,
            error: "No file received"
        });
    }

    res.json({
        success: true,
        filename: req.file.filename,
        path: req.file.path
    });
});

export default router;


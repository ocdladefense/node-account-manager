import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import cors from "cors";


const app = express();



app.use(cors({
    origin: true,
    credentials: true
}));

const storage = multer.diskStorage({
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

        let category = req.query.category;


        console.log("CATEGORY:", category);

        let fileName;

        if (category === "profile-picture") {
            fileName = `PF${contactId}${ext}`;
        }
        if (category === "expert-document") {
            fileName = `ExpertDoc.${contactId}${ext}`;
        }
        else {
            return cb(new Error("Invalid or missing category"));
        }

        cb(null, fileName);
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

app.post("/uploads/:contactId", upload.single("file"), (req, res) => {

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

app.listen(3000, () => {
    console.log("Server running on port 3000");
});

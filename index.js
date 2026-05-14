import express from "express";
import dotenv from "dotenv";
import multer from "multer";
import fs from "fs";

dotenv.config()
const app = express();
const router = express.Router()

// Configure multer for file uploads with diskStorage and fileFilter
const uploadDir = 'uploads/';
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + '-' + file.originalname);
    }
});

const fileFilter = (req, file, cb) => {
    // Example filter: Only accept image or audio files
    if (file.mimetype.startsWith('image/') || file.mimetype.startsWith('audio/')) {
        cb(null, true);
    } else {
        cb(new Error('Unsupported file type. Only images and audio files are allowed.'), false);
    }
};

const upload = multer({ storage: storage, fileFilter: fileFilter });

app.use("/api", router);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

router.get('/', (req, res) => {
    res.send(req.ip)
});

router.post('/', upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).send("No file uploaded.");
    }
    res.json({
        message: "File uploaded successfully",
        file: req.file
    });
});

app.listen(3000, () => {
    console.log("server is runnng on http://localhost:3000/");
})
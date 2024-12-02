import { Request } from "express";
import multer from "multer";
import path from "path";


const storage = multer.diskStorage({
    destination: function (req: Request, file: any, cb: any) {
        cb(null, "public/advertisement-images");
    },
    filename: function (req: Request, file: any, cb: any) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

export const upload = multer({ storage: storage });
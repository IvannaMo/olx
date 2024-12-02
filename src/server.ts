import "dotenv/config";
import Handlebars from "handlebars";
import express from "express";
import cookieParser from "cookie-parser";
import session from "express-session";
import exphbs from "express-handlebars";
import fs from "node:fs";
import path from "node:path";
import https from "node:https";
import { connection } from "./config/config.js";
import { clientRedis } from "./config/redis-config.js";
import { siteRoutes } from "./routes/site-routes.js";
import { seedUsers } from "./seeders/user-seeder.js";
import { seedCategories } from "./seeders/category-seeder.js";
import { seedImages } from "./seeders/image-seeder.js";
import { seedAdvertisements } from "./seeders/advertisement-seeder.js";
import { userRoutes } from "./routes/user-routes.js";
import { categoryRoutes } from "./routes/category-routes.js";
import { advertisementRoutes } from "./routes/advertisement-routes.js";
import { notificationRoutes } from "./routes/notification-routes.js";
import { imageRoutes } from "./routes/image-routes.js";


const PORT = process.env.PORT;
const __dirname = import.meta.dirname;

const hbs = exphbs.create({
    defaultLayout: "main",
    extname: "hbs",
});

const run = async() => {
    await connection.sync({ alter: true, force: true });
    await clientRedis.connect();
    
    await seedUsers();
    await seedCategories();
    await seedAdvertisements();
    await seedImages();
    
    const app = express();
    const options = {
        key: fs.readFileSync(path.join(__dirname, "..", "cert", "key.pem")),
        cert: fs.readFileSync(path.join(__dirname, "..", "cert", "cert.pem")),
    };

    app.use((req, res, next) => {
        if (req.cookies) {
            Object.keys(req.cookies).forEach((cookie) => {
                res.clearCookie(cookie);
            });
        }
        next();
    });

    https
    .createServer(options, app)
    .listen(PORT, () => console.log(`Server is running https://127.0.0.1`));

    app.use(cookieParser());
    app.use(
        session({
            secret: process.env.SESSION_KEY || "secret_session_key",
            resave: false,
            saveUninitialized: true,
        })
    );

    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    app.use(express.static("public"));
    app.engine("hbs", hbs.engine);
    app.set("view engine", "hbs");
    app.set("views", path.join("src", "views"));

    Handlebars.registerHelper("jsonStringify", function(data) {
        return JSON.stringify(data);
    });

    Handlebars.registerHelper("formatDate", function (date) {
        const options: Intl.DateTimeFormatOptions = { year: "numeric", month: "long", day: "numeric" };
        return new Intl.DateTimeFormat("uk-UA", options).format(new Date(date));
    });

    Handlebars.registerHelper("formatDateShort", function (date) {
        const options: Intl.DateTimeFormatOptions = { year: "numeric", month: "long" };
        return new Intl.DateTimeFormat("uk-UA", options).format(new Date(date));
    });

    Handlebars.registerHelper("formatTime", function (date) {
        const options: Intl.DateTimeFormatOptions = { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false };
        return new Intl.DateTimeFormat("uk-UA", options).format(new Date(date));
    });

    Handlebars.registerHelper("equals", function (value1, value2) {
        return value1 === value2;
    });

    Handlebars.registerHelper("count", function(array) {
        return array.length;
    });

    app.use(siteRoutes);
    app.use(userRoutes);
    app.use(categoryRoutes);
    app.use(advertisementRoutes);
    app.use(imageRoutes);
    app.use(notificationRoutes);
};

try {
    run();
}
catch(err) {
    console.error(err);
}
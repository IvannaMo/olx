import "dotenv/config";
import { Sequelize } from "sequelize-typescript";
import { User } from "../models/user-model.js";
import { RefreshToken } from "../models/refresh-token-model.js";
import { Notification } from "../models/notification-model.js";
import { Advertisement } from "../models/advertisement-model.js";
import { Review } from "../models/review-model.js";
import { Favorite } from "../models/favorite-model.js";
import { Tag } from "../models/tag-model.js";
import { Image } from "../models/image-model.js";
import { Category } from "../models/category-model.js";


export const connection = new Sequelize({
    dialect: "mysql",
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    models: [User, RefreshToken, Notification, Advertisement, Review, Favorite, Tag, Image, Category]
});
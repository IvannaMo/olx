import { User, UserType } from "../models/user-model.js";
import bcrypt from "bcrypt";


export async function seedUsers() {
    const salt = bcrypt.genSaltSync(10);

    const users = [
        { name: "admin", email: "admin@gmail.com", password: bcrypt.hashSync("admin", salt), newsletterSubscription: true, type: UserType.ADMIN },
        { name: "alice", email: "alice@gmail.com", password: bcrypt.hashSync("1", salt), newsletterSubscription: true },
    ];

    for (const user of users) {
        await User.findOrCreate({
            where: { email: user.email },
            defaults: user,
        });
    }
}
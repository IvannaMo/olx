import { Advertisement } from "../models/advertisement-model.js";
import { Category } from "../models/category-model.js";
import { User } from "../models/user-model.js";


function getRandomDate(lastWeek: Date, today: Date) {
    const difference = today.getTime() - lastWeek.getTime();
    const randomDifference = Math.floor(Math.random() * difference);

    return new Date(lastWeek.getTime() + randomDifference);
}

export async function seedAdvertisements() {
    const user = await User.findOne({ where: { email: "alice@gmail.com" } });
    if (!user) {
        return;
    }

    const category = await Category.findOne({ where: { name: "Електроніка" } });
    if (!category) {
        return;
    }

    const advertisements = [
        {
            userId: user.userId,
            categoryId: category.categoryId,
            title: "Ігрова консоль PlayStation 5",
            description: "Продам PS5 з гарантією. В комплекті один контролер та популярна гра.",
            price: 22000,
            location: "Одеса",
            views: 200,
            isVip: true,
        },
        {
            userId: user.userId,
            categoryId: category.categoryId,
            title: "Продам ноутбук MacBook Pro 2021",
            description: "Новий MacBook Pro 2021 з процесором M1 Pro. Ідеально підходить для роботи та розваг.",
            price: 50000,
            location: "Київ",
            views: 120,
            isVip: true,
        },
        {
            userId: user.userId,
            categoryId: category.categoryId,
            title: "Смартфон Samsung Galaxy S23 Ultra",
            description: "Флагманський смартфон з відмінною камерою та великим дисплеєм. В ідеальному стані.",
            price: 30000,
            location: "Львів",
            views: 80,
            isVip: false,
        },
        {
            userId: user.userId,
            categoryId: category.categoryId,
            title: "Телевізор LG OLED 4K 55 дюймів",
            description: "Новий OLED телевізор з відмінною якістю зображення. Підтримка всіх популярних додатків.",
            price: 15000,
            location: "Харків",
            views: 50,
            isVip: false,
        },
        {
            userId: user.userId,
            categoryId: category.categoryId,
            title: "Фітнес-трекер Xiaomi Mi Band 7",
            description: "Фітнес-браслет з великим екраном та функцією вимірювання пульсу. Стан нового.",
            price: 800,
            location: "Дніпро",
            views: 60,
            isVip: false,
        },
    ];

    const today = new Date();
    const lastWeek = new Date(today);
    lastWeek.setDate(today.getDate() - 7);

    for (const advertisement of advertisements) {
        const randomPublishDate = getRandomDate(lastWeek, today);

        await Advertisement.findOrCreate({
            where: { title: advertisement.title },
            defaults: {
                ...advertisement,
                publishDate: randomPublishDate,
            },
        });
    }
}
import { Category } from "../models/category-model.js";


export async function seedCategories() {
    const categories = [
        { name: "Допомога", imageUrl: "https://categories.olxcdn.com/assets/categories/olxua/dopomoga-1944-1x.png", imageColor: "rgb(255,206,50)" },
        { name: "Дитячий світ", imageUrl: "https://categories.olxcdn.com/assets/categories/olxua/detskiy-mir-36-1x.png", imageColor: "rgb(58,119,255)" },
        { name: "Нерухомість", imageUrl: "https://categories.olxcdn.com/assets/categories/olxua/nedvizhimost-1-1x.png", imageColor: "rgb(35,229,219)" },
        { name: "Авто", imageUrl: "https://categories.olxcdn.com/assets/categories/olxua/transport-1532-1x.png", imageColor: "rgb(255,86,54)" },
        { name: "Запчастини для транспорту", imageUrl: "https://categories.olxcdn.com/assets/categories/olxua/zapchasti-dlya-transporta-3-1x.png", imageColor: "rgb(255,246,217)" },
        { name: "Робота", imageUrl: "https://categories.olxcdn.com/assets/categories/olxua/rabota-6-1x.png", imageColor: "rgb(206,221,255)" },
        { name: "Тварини", imageUrl: "https://categories.olxcdn.com/assets/categories/olxua/zhivotnye-35-1x.png", imageColor: "rgb(200,248,246)" },
        { name: "Дім і сад", imageUrl: "https://categories.olxcdn.com/assets/categories/olxua/dom-i-sad-899-1x.png", imageColor: "rgb(255,214,201)" },
        { name: "Електроніка", imageUrl: "https://categories.olxcdn.com/assets/categories/olxua/elektronika-37-1x.png", imageColor: "rgb(255,206,50)" },
        { name: "Бізнес та послуги", imageUrl: "https://categories.olxcdn.com/assets/categories/olxua/uslugi-7-1x.png", imageColor: "rgb(206,221,255)" },
        { name: "Оренда та прокат", imageUrl: "https://categories.olxcdn.com/assets/categories/olxua/arenda-prokat-3428-1x.png", imageColor: "rgb(200,248,246)" },
        { name: "Мода і стиль", imageUrl: "https://categories.olxcdn.com/assets/categories/olxua/moda-i-stil-891-1x.png", imageColor: "rgb(255,214,201)" },
        { name: "Хобі, відпочинок і спорт", imageUrl: "https://categories.olxcdn.com/assets/categories/olxua/hobbi-otdyh-i-sport-903-1x.png", imageColor: "rgb(255,246,217)" },
        { name: "Віддам безкоштовно", imageUrl: "https://categories.olxcdn.com/assets/categories/olxua/otdam-darom-1151-1x.png", imageColor: "rgb(58,119,255)" },
        { name: "Обмін", imageUrl: "https://categories.olxcdn.com/assets/categories/olxua/obmen-barter-1153-1x.png", imageColor: "rgb(35,229,219)" },
        { name: "Подарунки з OLX Доставка", imageUrl: "https://categories.olxcdn.com/assets/promo/olxua/national_promo-1x.png", imageColor: "rgb(255,86,54)" },
    ];

    for (const category of categories) {
        await Category.findOrCreate({
            where: { name: category.name },
            defaults: category,
        });
    }
}
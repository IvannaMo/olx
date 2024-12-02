import { Image } from "../models/image-model.js";
import { Advertisement } from "../models/advertisement-model.js";


export async function seedImages() {
    const ps5Advertisement = await Advertisement.findOne({ where: { title: "Ігрова консоль PlayStation 5" } });
    if (!ps5Advertisement) {
        return;
    }

    const macAdvertisement = await Advertisement.findOne({ where: { title: "Продам ноутбук MacBook Pro 2021" } });
    if (!macAdvertisement) {
        return;
    }

    const samsungAdvertisement = await Advertisement.findOne({ where: { title: "Смартфон Samsung Galaxy S23 Ultra" } });
    if (!samsungAdvertisement) {
        return;
    }

    const lgAdvertisement = await Advertisement.findOne({ where: { title: "Телевізор LG OLED 4K 55 дюймів" } });
    if (!lgAdvertisement) {
        return;
    }

    const xiaomiAdvertisement = await Advertisement.findOne({ where: { title: "Фітнес-трекер Xiaomi Mi Band 7" } });
    if (!xiaomiAdvertisement) {
        return;
    }


    const ps5ImageUrl1 = "https://img.mta.ua/image/cache/data/foto/z216/21671/photos/Sony-PlayStation-5-Pro-2TB-89-White-01-600x600.jpg";
    const ps5ImageUrl2 = "https://brain.com.ua/static/images/prod_img/8/0/U0887380_2big_1703253603.jpg";
    const ps5ImageUrl3 = "https://bigmag.ua/image/cache/catalog/image/Product/Sony%20Playstation%205/PS%205%20Slim/ps5slim.3-2000x2000.jpg";
    
    const macImageUrl1 = "https://bigmag.ua/image/catalog/new/kumunren/pic/macbook21/MKGR3%20(1).jpg";
    const macImageUrl2 = "https://newtime.ua/image/import/catalog/mac/macbook_pro/MacBook-Pro-2021/MacBook-Pro-14-Silver-2021/macbook-pro-14-silver-mkgt3-2021.webp";

    const samsungImageUrl1 = "https://easymac.com.ua/image/cache/catalog/image/catalog/easyphoto/28850/samsung-galaxy-s23-ultra-12-256gb-green-3.webp";
    const samsungImageUrl2 = "https://images.samsung.com/ua/smartphones/galaxy-s23-ultra/buy/product_color_green.png";
    
    const lgImageUrl1 = "https://www.lg.com/ua/images/televisions/md07528690/gallery/medium01.jpg";
    const lgImageUrl2 = "https://www.lg.com/ua/images/televisions/md07528690/gallery/medium03.jpg";

    const xiaomiImageUrl1 = "https://s-tell.ua/32239-thickbox_default/xiaomi-mi-smart-band-7-black-cn-bhr6007cn.jpg";
    const xiaomiImageUrl2 = "https://dzvinok.ua/pub/media/catalog/product/cache/c687aa7517cf01e65c009f6943c2b1e9/f/r/front_black_result_1.webp";
    const xiaomiImageUrl3 = "https://www.techadvisor.com/wp-content/uploads/2022/09/Xiaomi-Mi-Band-7-review-2.jpeg?quality=50&strip=all&w=1024";


    const images = [
        {
            advertisementId: ps5Advertisement.advertisementId,
            imageUrl: ps5ImageUrl1,
            primary: true,
        },
        {
            advertisementId: ps5Advertisement.advertisementId,
            imageUrl: ps5ImageUrl2,
        },
        {
            advertisementId: ps5Advertisement.advertisementId,
            imageUrl: ps5ImageUrl3,
        },

        {
            advertisementId: macAdvertisement.advertisementId,
            imageUrl: macImageUrl1,
            primary: true,
        },
        {
            advertisementId: macAdvertisement.advertisementId,
            imageUrl: macImageUrl2,
        },

        {
            advertisementId: samsungAdvertisement.advertisementId,
            imageUrl: samsungImageUrl1,
            primary: true,
        },
        {
            advertisementId: samsungAdvertisement.advertisementId,
            imageUrl: samsungImageUrl2,
        },

        {
            advertisementId: lgAdvertisement.advertisementId,
            imageUrl: lgImageUrl1,
            primary: true,
        },
        {
            advertisementId: lgAdvertisement.advertisementId,
            imageUrl: lgImageUrl2,
        },

        {
            advertisementId: xiaomiAdvertisement.advertisementId,
            imageUrl: xiaomiImageUrl1,
            primary: true,
        },
        {
            advertisementId: xiaomiAdvertisement.advertisementId,
            imageUrl: xiaomiImageUrl2,
        },
        {
            advertisementId: xiaomiAdvertisement.advertisementId,
            imageUrl: xiaomiImageUrl3,
        },
    ];

    for (const image of images) {
        await Image.findOrCreate({
            where: { imageUrl: image.imageUrl },
            defaults: {
                ...image,
            },
        });
    };
}
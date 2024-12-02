function initializeImageSlider(images) {
    let index = 0;

    const currentImage = document.getElementById("current-image");
    const previousImageButton = document.getElementById("previous-image-button");
    const nextImageButton = document.getElementById("next-image-button");

    previousImageButton.addEventListener("click", () => {
        index = (index - 1 + images.length) % images.length;
        currentImage.src = images[index].imageUrl;
    });

    nextImageButton.addEventListener("click", () => {
        index = (index + 1) % images.length;
        currentImage.src = images[index].imageUrl;
    });
}

const images = JSON.parse(document.getElementById("image-slider").getAttribute("data-images"));
initializeImageSlider(images);
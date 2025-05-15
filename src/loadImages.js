import logoR from "../assets/dvdVideoR.png";
import logoB from "../assets/dvdVideoB.png";
import logoG from "../assets/dvdVideoG.png";

let loadedImages = [];

export async function loadImages() {
    const logoSources = [logoR, logoG, logoB];

    const imgElements = logoSources.map(src => {
        const image = new Image();
        image.src = src;
        return image;
    });

    const loadPromises = imgElements.map(image => {
        return new Promise((resolve, reject) => {
            image.onload = () => {
                loadedImages.push(image);
                resolve(image);
            };
            image.onerror = () => reject(new Error(`Failed to load image: ${image.src}`));
        });
    });

    try {
        await Promise.all(loadPromises);
    } catch (error) {
        throw error;
    }
}

export function areImagesLoaded() {
    return loadedImages.length > 0 && loadedImages.every(image => image.complete && image.naturalWidth > 0);
}

export function getImages() {
    return loadedImages;
}

import faviconR from '../assets/dvdVideoR.ico';
import faviconG from '../assets/dvdVideoG.ico';
import faviconB from '../assets/dvdVideoB.ico';

export function areFaviconsLoaded() {
    const link = document.querySelector('link[rel="icon"]');
    if (!link) return false;

    const currentHref = link.href;
    const expectedHrefs = [faviconR, faviconG, faviconB].map(url => new URL(url, document.baseURI).href);
    return expectedHrefs.includes(currentHref);
}

export async function loadFavicons() {
    for (let src of [faviconR, faviconG, faviconB]) {
        setFaviconDirectly(src);
    }
}

function setFaviconDirectly(src) {
    let link = document.querySelector('link[rel="icon"]');
    if (!link) {
        link = document.createElement('link');
        link.rel = 'icon';
        document.head.appendChild(link);
    }
    link.href = new URL(src, document.baseURI).href;
}

export function getFavIconSet() {
    return [faviconR, faviconG, faviconB]
}
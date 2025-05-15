export default function changeFavicon(link) {
    let favicon = document.querySelector('link[rel="icon"]');
    const absoluteLink = new URL(link, document.baseURI).href;

    if (favicon && favicon.href === absoluteLink) {
        return;
    }

    if (!favicon) {
        favicon = document.createElement("link");
        favicon.rel = "icon";
        favicon.id = "favicon";
        document.head.appendChild(favicon);
    }

    favicon.href = link;
}
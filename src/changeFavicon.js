function changeFavicon(link) {
    const absoluteLink = new URL(link, document.baseURI).href;
    let $favicon = document.querySelector('link[rel="icon"]');
    
    if ($favicon && $favicon.href === absoluteLink) {
        return;
    }
    
    if (!$favicon) {
        $favicon = document.createElement("link");
        $favicon.rel = "icon";
        $favicon.id = "favicon";
        document.head.appendChild($favicon);
    }
    
    $favicon.href = absoluteLink;
}

function waitForIframesToLoad() {
    const iframes = document.querySelectorAll('iframe');

    const iframePromises = Array.from(iframes).map((iframe) => {
        return new Promise((resolve, reject) => {
            if (iframe.contentWindow && iframe.contentWindow.document.readyState === 'complete') {
                setTimeout(() => { resolve() }, 1666);
            } else {
                iframe.addEventListener('load', () => {
                    setTimeout(() => { resolve() }, 1666);
                }, { once: true });
            }
        });
    });

    return Promise.all(iframePromises);
}

export default waitForIframesToLoad;
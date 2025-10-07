function waitForIframesToLoad() {

    const iframes = document.querySelectorAll('iframe');


    const iframePromises = Array.from(iframes).map((iframe) => {
        return new Promise((resolve, reject) => {

            if (iframe.contentWindow && iframe.contentWindow.document.readyState === 'complete') {
                resolve();
            } else {

                iframe.addEventListener('load', () => {
                    resolve();
                }, { once: true });
            }
        });
    });

    return Promise.all(iframePromises);
}

export default waitForIframesToLoad;
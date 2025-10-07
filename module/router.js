import throttle from "./throttle.js";
let frameTarget = document.querySelector("#content-frames");
let toggleTarget = document.querySelector("#toggle-menu");
let currentPath = new URLSearchParams(window.location.search).get("$");

let avavilableRoutes = await fetch("/doc/routes.json")
    .then(res => res.json())
    .then(res => res.routes);

var router = {
    current: currentPath,
    frameTarget: frameTarget,
    toggleTarget: toggleTarget,
    available: avavilableRoutes,

    init: async () => {
        router.frameTarget.innerHTML = "";
        router.toggleTarget.innerHTML = "";

        router.available.forEach(item => {
            let iframe = document.createElement("iframe");
            iframe.id = "iframe-" + item.title;
            iframe.src = item.url;
            router.frameTarget.appendChild(iframe);

            let link = document.createElement("div");
            link.classList.add("link");
            link.id = "link-" + item.title;
            for (const text of item.inner) {
                let e = document.createElement("div");
                e.innerHTML = text;
                link.appendChild(e);
            }
            link.addEventListener("click", throttle(function(e) {
                e.stopPropagation();
                if (router.pathTo(item.path)) {
                    router.toggleTarget.removeAttribute('data-open');
                    document.getElementById("menu-btn").classList = "fa fa-bars";
                };
            }));
            router.toggleTarget.appendChild(link);
        });

        if (currentPath && router.available.some(item => item.path === currentPath)) {
            router.pathTo(currentPath);
        } else {
            router.pathTo(router.available[0].path);
        }

        return router;
    },

    updateRoutes: async () => {
        document.querySelectorAll("#toggle-menu>.link").forEach(item => {
            if (item.id !== "link-" + router.current) {
                item.removeAttribute('data-active');
            } else {
                item.setAttribute('data-active', true);
            }
        });

        document.querySelectorAll("#content-frames>iframe").forEach(item => {
            if (item.id !== "iframe-" + router.current) {
                item.removeAttribute('data-active');
            } else {
                item.setAttribute('data-active', true);
                item.scrollIntoView({ behavior: 'auto', block: 'center', inline: 'center' });
            }
        });
    },

    pathTo: (path) => {
        if (!path) { return false; }
        let currentRoute = router.available.find(item => item.path === path);
        if ("enable" in currentRoute && !currentRoute.enable) {
            router.pathTo(router.available[0].path);
            mui.toast("该页面正在更新维护，敬请期待吧...");
            return false;
        }
        window.history.replaceState(null, null, `?$=${path}`);
        router.current = currentRoute.title;
        router.updateRoutes();
        document.querySelector(".subtitle").innerText = currentRoute.title;
        return true;
    }
};

export default router;
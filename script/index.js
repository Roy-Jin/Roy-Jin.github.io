import router from '/module/router.js';
import theme from '/module/theme.js';
import pageshow from '/module/pageshow.js';
import loaded from '/module/loading.js';

document.querySelector(".loading>small").addEventListener("click", () => {
    window.location.reload();
});

let site_data = (await pageshow.init()).data;
pageshow.ref(
    [{
        selector: ".title img",
        attr: {
            src: site_data.avatar[1]
        }
    }, {
        selector: ".title h2",
        attr: {
            innerHTML: site_data.title.split("|")[0]
                + "|<span class='subtitle'>" + site_data.title.split("|")[1] + "</span>"
        }
    }]
);

await router.init().then(() => { theme.init(true) });

loaded().then(() => {
    document.querySelector(".loading").setAttribute("data-hidden", true);
}).catch((error) => {
    // mui.toast(`<span style="color:brown;">${error.message}</span></span>`);
    console.error(error);
});

document.getElementById("menu-btn").addEventListener("click", (e) => {
    if (document.getElementById("toggle-menu").getAttribute("data-open")) {
        document.getElementById("toggle-menu").removeAttribute("data-open");
        e.target.classList = "fa-solid fa-bars";
    } else {
        document.getElementById("toggle-menu").setAttribute("data-open", true);
        e.target.classList = "fa-solid fa-times";
    }
});
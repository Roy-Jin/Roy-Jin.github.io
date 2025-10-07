import throttle from "./throttle.js";
const broadcast = new BroadcastChannel('theme-change');
let currentTheme = localStorage.getItem("theme") || "light";

let theme = {
    isMainPage: false,
    current: currentTheme,
    init: function (isMainPage) {
        this.isMainPage = isMainPage;
        if (isMainPage) {
            let link = document.createElement("div");
            link.classList.add("link");
            link.id = "link-theme";
            link.addEventListener("click", throttle(function (e) {
                e.stopPropagation();
                theme.toggle();
            }));
            let toggleMenu = document.querySelector("#toggle-menu");
            toggleMenu.appendChild(link);
        }
        broadcast.onmessage = (event) => {
            if (event.data !== this.current) {
                this.set(event.data);
            }
        };
        this.set(this.current);
    },
    toggle: function () {
        this.set(this.current === "light" ? "dark" : "light");
    },
    set: function (theme) {
        this.current = theme;
        let body = document.querySelector("body");
        let link = document.getElementById("link-theme");
        body.setAttribute("data-theme", this.current);
        broadcast.postMessage(this.current);
        localStorage.setItem("theme", this.current);
        this.isMainPage && (() => {
            if (this.current === "light") {
                link.innerHTML =
                    "<div><span class='fa fa-moon'></span></div>"
                    + "<div>Dark Mode</div>";
            } else {
                link.innerHTML =
                    "<div><span class='fa fa-sun'></span></div>"
                    + "<div>Light Mode</div>";
            }
        })();
    }
};

export default theme;
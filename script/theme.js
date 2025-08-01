const methods = document.querySelector(".header>.methods");
const body = document.querySelector("body");
if (methods) {
    const themeToggle = document.createElement("div");
    themeToggle.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-sun-moon-icon lucide-sun-moon"><path d="M12 8a2.83 2.83 0 0 0 4 4 4 4 0 1 1-4-4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.9 4.9 1.4 1.4"/><path d="m17.7 17.7 1.4 1.4"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.3 17.7-1.4 1.4"/><path d="m19.1 4.9-1.4 1.4"/></svg>`;
    themeToggle.className = "item";
    themeToggle.id = "theme-toggle";
    document.querySelector(".header>.methods")?.appendChild(themeToggle);

    document.getElementById("theme-toggle").addEventListener("click", () => {
        const body = document.querySelector("body");
        if (body.getAttribute("data-theme") === "dark") {
            body.setAttribute("data-theme", "light");
            localStorage.setItem("theme", "light");
        } else {
            body.setAttribute("data-theme", "dark");
            localStorage.setItem("theme", "dark");
        }
    })
} else {
    window.addEventListener("storage", (e) => {
        if (e.key === "theme") {
            const body = document.querySelector("body");
            if (e.newValue === "dark") {
                body.setAttribute("data-theme", "dark");
            } else {
                body.setAttribute("data-theme", "light");
            }
        }
    });
}

const theme = localStorage.getItem("theme");
if (theme === "dark") {
    body.setAttribute("data-theme", "dark");
} else {
    body.setAttribute("data-theme", "light");
}
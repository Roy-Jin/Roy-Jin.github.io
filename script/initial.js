const eleQuery = (ele) => {
    return document.querySelector(ele)
}

const eleQueryAll = (ele) => {
    return document.querySelectorAll(ele)
}

const eleCreate = (tag, parent) => {
    const ele = document.createElement(tag);
    const ele_parent = eleQuery(parent);
    ele_parent.appendChild(ele);
    return ele;
}

const createLink = (rel, href) => {
    const link = eleCreate("link", "head");
    link.rel = rel;
    link.href = href;
    return link;
}

const pageshow = async () => {
    const config = await fetch("/doc/pageshow.json").then(response => response.json());
    window.site_config = config;

    // 设置元素属性
    for (const element of [
        {
            selector: "#title-text",
            attr: {
                innerHTML: config.data.title,
            }
        }, {
            selector: "#subtitle-text",
            attr: {
                innerHTML: config.data.subtitle,
            }
        }, {
            selector: "#copyright",
            attr: {
                innerHTML: config.data.copyright,
            }
        }, {
            selector: "#name",
            attr: {
                innerHTML: config.data.name,
            }
        }, {
            selector: "#avatar",
            attr: {
                src: config.data.avatar[0],
            }
        }, {
            selector: "#social",
            attr: {
                innerHTML: (() => config.data.social.map(link => `<a href="${link.href}" class="link" target="_blank" style="background:color-mix(in srgb, ${link.color} 20%, transparent)"><i class="fa-2x ${link.icon}" style="color:${link.color ?? ''}"></i></a>`).join(''))()
            }
        }, {
            selector: "#quote-text",
            attr: {
                innerHTML: config.data.quote,
            }
        }, {
            selector: "#projects",
            attr: {
                innerHTML: (() => config.data.projects.map(project => `<a href="${project.href}" class="project" target="_blank" style="background:color-mix(in srgb, ${project.color ?? ''} 20%, transparent)"><div class="text">${project.name}</div></a>`).join(''))() 
            }
        }
    ]) {
        const ele = eleQuery(element.selector);
        function setAttributesRecursively(obj, target) {
            for (const key in obj) {
                if (typeof obj[key] === 'object' && obj[key] !== null) {
                    if (!target[key]) { target[key] = {}; }
                    setAttributesRecursively(obj[key], target[key]);
                } else { target[key] = obj[key]; }
            }
        }
        setAttributesRecursively(element.attr, ele);
    }

    eleQuery(".loader").classList.add("hidden")
};

window.onpageshow = pageshow;
document.oncontextmenu = function () {
    return false;
};
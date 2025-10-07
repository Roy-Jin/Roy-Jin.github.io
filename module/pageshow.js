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

let pageshow = {
    data: {},
    eleQuery,
    eleQueryAll,
    eleCreate,
    createLink,
    init: async (options = {}) => {
        const config = await fetch("/doc/pageshow.json").then(response => response.json());
        pageshow.data = config;

        // 禁止右键菜单
        if (!options.contextmenu) {
            document.oncontextmenu = function () {
                return false;
            }
        }

        return pageshow;
    },
    ref: (elements) => {
        for (const element of elements) {
            const ele = eleQuery(element.selector);
            if (!ele) { console.warn(`【元素】${element.selector} 不存在`); continue; }
            function setAttributesRecursively(obj, target) {
                for (const key in obj) {
                    if (typeof obj[key] === 'object' && obj[key] !== null) {
                        if (!target[key]) { target[key] = {}; }
                        setAttributesRecursively(obj[key], target[key]);
                    } else { target[key] = obj[key]; }
                }
            }
            setAttributesRecursively(element.attr, ele);
        };
        return pageshow;
    }
};

export default pageshow;
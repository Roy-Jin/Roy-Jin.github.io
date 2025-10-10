import pageshow from "/module/pageshow.js"

let { api, server, type, id } = (await pageshow.init()).data.music;

const api_url = new URL(api);
api_url.searchParams.set("server", server);
api_url.searchParams.set("type", type);
api_url.searchParams.set("id", id);

// 发起请求
let data = await fetch(api_url.href)
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
    });

export {
    data,
    api,
    server,
    type,
    id
};
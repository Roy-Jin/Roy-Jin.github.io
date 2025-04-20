(async () => {
    const APIs = [
        {
            name: "dujitang",
            url: "https://v2.xxapi.cn/api/dujitang",
            format: async (data) => {
                data = await data.json();
                return { text: data.data, from: "憨憨语录" }
            }
        }, {
            name: "hitokoto",
            url: "https://v1.hitokoto.cn/",
            format: async (data) => {
                data = await data.json();
                return { text: await data.hitokoto, from: data.from }
            }
        }, {
            name: "one_yan",
            url: "https://jkapi.com/api/one_yan",
            format: async (data) => {
                return { text: await data.text(), from: "憨憨语录" }
            }
        }
    ]

    // 从APIs数组中随机选择一个API
    const randomIndex = Math.floor(Math.random() * APIs.length);
    const randomAPI = APIs[randomIndex];

    let sayings = await fetch(randomAPI.url)
        .catch(() => { return { ok: false } });
    if (sayings.ok) {
        sayings = await randomAPI.format(sayings);
        // console.log(`使用${randomAPI.name}API获取语录: ${sayings.text}`);
    } else {
        sayings = { text: "语录加载失败！", from: "Roy-Jin" }
    }

    // 更新时间
    setInterval(() => {
        document.getElementById("time").innerHTML = `
<p class="time-text">
    <span class="time-num">${dayjs().format("hh:mm:ss")}</span>
    <span class="time-sub-text">${dayjs().format("A")}</span>
</p>
<p class="day-text">${dayjs().format("dddd, D MMMM.")}</p>
<hr>
<div class="sayings"><div class="text">${sayings.text}</div><div class="from">——《${sayings.from}》</div></div>
`
    }, 999)
})()
(async () => {
    // 更新日期&时间
    setInterval(() => {
        if (!window.dayjs) return console.warn("【日期】dayjs 未加载");
        document.getElementById("date").innerHTML = `
            <p class="time">
                <span class="num">${dayjs().format("hh:mm:ss")}</span>
                <span class="sub">${dayjs().format("A")}</span>
            </p>
            <p class="day">${dayjs().format("dddd, D MMMM.")}</p>`;
    }, 99);

    // 获取语录
    (async () => {
        // 所有的 API 接口
        const apis = [
            {
                enable: true,
                name: "dujitang",
                url: "https://v2.xxapi.cn/api/dujitang",
                format: async (data) => {
                    data = await data.json();
                    return { text: data.data, from: "憨憨语录" }
                }
            }, {
                enable: true,
                name: "hitokoto",
                url: "https://v1.hitokoto.cn/",
                format: async (data) => {
                    data = await data.json();
                    return { text: await data.hitokoto, from: data.from }
                }
            }, {
                enable: true,
                name: "one_yan",
                url: "https://jkapi.com/api/one_yan",
                format: async (data) => {
                    return { text: await data.text(), from: "来自一言" }
                }
            }
        ];

        // 随机获取可用的 API 接口
        const enabledAPIs = apis.filter(api => api.enable);
        if (enabledAPIs.length === 0) {
            return console.warn("【语录】没有可用的 API 接口");
        }
        const randomAPI = enabledAPIs[Math.floor(Math.random() * enabledAPIs.length)];
        // console.log(`正在使用 ${randomAPI.name} API 接口`);

        // 先初始化DOM
        document.getElementById("sayings").innerHTML = `
            <p class="text">语录加载中……</p>
            <p class="from">——《Loading》</p>
            `;

        // 发送请求并获取数据
        const response = await fetch(randomAPI.url)
            .catch(e => { return { ok: false } });
        if (response.ok) {
            const sayings = await randomAPI.format(response);
            document.getElementById("sayings").innerHTML = `
                <p class="text">${sayings.text}</p>
                <p class="from">——《${sayings.from}》</p>
                `;
        } else {
            document.getElementById("sayings").innerHTML = `
                <p class="text">获取失败，请稍后再试！</p>
                <p class="from">——《${randomAPI.name}》</p>
                `;
        }
    })();
})()
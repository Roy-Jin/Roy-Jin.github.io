(async () => {
    // 更新日期&时间
    const updateTime = setInterval(() => {
        if (!window.dayjs) {
            clearInterval(updateTime);
            return console.warn("【日期】dayjs 未加载");
        };
        document.getElementById("date").innerHTML = `
            <p class="time">
                <span class="num">${dayjs().format("hh:mm:ss")}</span>
                <span class="sub">${dayjs().format("A")}</span>
            </p>
            <p class="day">${dayjs().format("dddd, D MMMM.")}</p>`;
    }, 99);

    // 所有的语录接口
    const apis = [
        {
            enable: true,
            name: "xxapi/dujitang",
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
            name: "jkapi/one_yan",
            url: "https://jkapi.com/api/one_yan",
            format: async (data) => {
                return { text: await data.text(), from: "来自一言" }
            }
        }, {
            enable: true,
            name: "jkapi/dujitang",
            url: "https://jkapi.com/api/dujitang",
            format: async (data) => {
                return { text: await data.text(), from: "憨憨语录" }
            }
        }
    ];

    // 获取随机语录
    const getQuotes = async () => {
        // 随机获取可用的语录接口
        const enabledAPIs = apis.filter(api => api.enable);
        if (enabledAPIs.length === 0) { return console.warn("【语录】没有可用的语录接口") };
        const randomAPI = enabledAPIs[Math.floor(Math.random() * enabledAPIs.length)];
        // console.log(`【语录】正在使用 ${randomAPI.name} 接口`);

        // 先初始化DOM
        document.getElementById("sayings").innerHTML = `
            <p class="text">语录加载中……</p>
            <p class="from">——《Loading》</p>
            `;

        // 发送请求并获取数据
        const response = await fetch(randomAPI.url)
            .catch(e => { return { ok: false, error: e } });
        if (response.ok) {
            const sayings = await randomAPI.format(response);
            document.getElementById("sayings").innerHTML = `
                <p class="text">${sayings.text}</p>
                <p class="from">——《${sayings.from}》</p>
                `;
        } else {
            // 如果当前接口不可用，则尝试下一个接口
            randomAPI.enable = false;
            if (apis.filter(api => api.enable).length === 0) {
                // 如果所有接口都不可用，则显示错误信息
                return document.getElementById("sayings").innerHTML = `
                <p class="text">${response.error}</p>
                <p class="from">——《${randomAPI.name}》</p>
                `;
            } else {
                return getQuotes();
            }
        }
    }; getQuotes();
})()
/**
 * @class MusicalProvider
 * @param {object|string} options 配置选项，可以是对象或字符串
 * @param {string} options.server 音乐提供服务器，可选值：netEase(default), tencent, kuGou, xiaMi, baidu, kuWo
 * @param {string} options.api 音乐数据 Meting API 地址，默认为 https://api.injahow.cn/meting/ (可自行替换)
 * 
 * @example
 * https://music.163.com/song?id=1963654951
 * const provider = new MusicalProvider();
 * provider.fetch("song", "1963654951").then(data => console.log(data));
 * 
 * @author Roy-Jin
 * @github https://github.com/Roy-Jin
 * @gitee https://gitee.com/Roy-Jin
 * @website https://roy-jin.github.io/
 * @date 2024-12-09
 * @version 1.0.0
 * 
 * - 感谢 @武恩赐(gitee.com/wuenci514/) 提供的 meting-api
 */
class MusicalProvider {
    // 默认配置
    defaultOptions = {
        server: "netease",
        api: new URL("https://api.injahow.cn/meting/"),
    }

    // 构造函数
    constructor(options) {
        this.options = { ...this.defaultOptions };

        if (typeof options === "object") {
            // 将对象的键转换为小写
            options = Object.fromEntries(Object.entries(options).map(([key, value]) => [key.toLowerCase(), value]));

            // 验证 API 地址
            if (options.api && this.isValidUrl(options.api)) {
                this.options = { ...this.defaultOptions, ...options };
            } else if (options.api) {
                console.error("[Parameter Error] API must be a valid URL!");
            }
        } else if (typeof options === "string") {
            this.options.server = options;
        } else {
            console.error("[Parameter Error] Options must be an object or a string!");
        }
    }

    // 验证 URL 是否有效
    isValidUrl(api) {
        try {
            const url = new URL(api);
            return ['http:', 'https:'].includes(url.protocol);
        } catch (error) {
            return false;
        }
    }

    /**
     * 获取音乐数据
     * @param {string} type 音乐类型，可选值：
     *  - song: 歌曲
     *  - album: 专辑
     *  - playlist: 歌单
     *  - search: 搜索
     *  - artist: 艺术家
     * @param {string} id 音乐|歌单|专辑|艺术家 标识
     * @returns {Promise} 包含音乐数据的 Promise 对象
     */
    async fetch(type, id) {
        // 判断参数是否合法
        if (!type || !id) {
            return Promise.reject(new Error("Type and ID must be provided!"));
        }

        // 构造请求 URL
        const api = new URL(this.options.api);
        api.searchParams.set("server", this.options.server);
        api.searchParams.set("type", type);
        api.searchParams.set("id", id);

        // 发起请求
        return await fetch(api.href)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            });
    }
}
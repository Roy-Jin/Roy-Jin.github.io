document.oncontextmenu = function () {
    return false;
};

window.onload = async () => {
    // 加载配置文件
    const config = await fetch('/doc/pageshow.json').then(res => res.json());
    if (!config.music.enable) { return "未启用音乐播放器！" };
    const music = config.music;

    // 获取音乐资源
    const mp = new MusicalProvider({
        server: music.server,
        api: music.api,
    });

    window.ap = new APlayer({
        audio: await mp.fetch(music.type, music.id),
        container: document.getElementById('aplayer'),
        order: 'random',
        preload: 'auto',
        volume: '0.5',
        mutex: true,
        lrcType: 3,
    });

    let musicInterval;
    const eleQuery = (ele) => document.querySelector(ele);
    const updateMusic = () => {
        try {
            eleQuery(".song>.title").innerHTML = eleQuery(".aplayer-list-light>.aplayer-list-title").innerHTML;
            eleQuery(".song>.author").innerHTML = eleQuery(".aplayer-list-light>.aplayer-list-author").innerHTML;
            eleQuery(".song>.lyric").innerHTML = eleQuery(".aplayer-lrc-contents>.aplayer-lrc-current").innerHTML;
            eleQuery(".progress-container>.current-time").innerHTML = eleQuery(".aplayer-ptime").innerHTML;
            eleQuery(".progress-container>.total-time").innerHTML = eleQuery(".aplayer-dtime").innerHTML;
            eleQuery(".progress-bar").value = ap.audio.currentTime / ap.audio.duration * 100;
        } catch (e) { }
    }
    musicInterval = setInterval(() => updateMusic(), 100)
    ap.on('play', function () {
        musicInterval = setInterval(() => updateMusic(), 100)
    });

    ap.on('pause', function () {
        clearInterval(musicInterval);
    });

    // ap.on('listswitch', (e) => {
    //     document.querySelector(".cover").style.backgroundImage = `url(${ap.list.audios[e.index].cover})`;
    // });

    // 添加控制按钮事件监听
    eleQuery('.play-pause').addEventListener('click', () => {
        ap.toggle();
        eleQuery('.play-pause i').className = ap.audio.paused ? 'fas fa-play fa-2x' : 'fas fa-pause fa-2x';
    });

    eleQuery('.prev').addEventListener('click', () => ap.skipBack());
    eleQuery('.next').addEventListener('click', () => ap.skipForward());

    // 进度条交互处理
    const progressBar = eleQuery('.progress-bar');
    progressBar.addEventListener('input', (e) => {
        const percent = e.target.value;
        ap.audio.currentTime = (percent / 100) * ap.audio.duration;
    });
}
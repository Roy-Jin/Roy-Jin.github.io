import theme from '/module/theme.js';
import { data } from '/module/musicData.js';

theme.init();

window.ap = new APlayer({
    audio: data,
    container: document.getElementById('aplayer'),
    order: 'random',
    preload: 'auto',
    volume: '0.5',
    mutex: true,
    lrcType: 3,
});

let rangeDom = document.querySelector('#slider');
let playPause = document.querySelector('#playPause');
let skipForwardButton = document.querySelector('#skipForward');
let skipBackButton = document.querySelector('#skipBack');
let modes = document.querySelector('#modes');
let heart = document.querySelector('#heart');

const colorThief = new ColorThief();
const _image = new Image();
let xhr = new XMLHttpRequest();

let update = {
    img: (current) => {
        let coverDom = document.querySelector('#cover');
        coverDom.style.backgroundImage = `url(${current.pic})`;
    },
    name: (current) => {
        let nameDom = document.querySelector('#name');
        nameDom.innerHTML = current.name;
    },
    author: (current) => {
        let authorDom = document.querySelector('#author');
        authorDom.innerHTML = current.artist;
    },
    lrc: (current = [0, '无歌词收录...']) => {
        function handledLrc(str) {
            const regex = /(.*)\(([^()]*)\)$/;
            const match = str.match(regex);
            if (match) {
                return [match[1].trim(), match[2]];
            } else {
                return false;
            }
        }
        let lrcDom = document.querySelector('#lrc');
        let handled = handledLrc(current[1]);
        if (handled) {
            lrcDom.innerHTML = handled[0]
                + "<p class='translated'>" + handled[1] + "</p>";
        } else {
            lrcDom.innerHTML = current[1];
        }
    },
    progress: () => {
        let format = (seconds) => {
            const minutes = Math.floor(seconds / 60);
            const remainingSeconds = Math.floor(seconds % 60);
            const formattedMinutes = String(minutes).padStart(2, '0');
            const formattedSeconds = String(remainingSeconds).padStart(2, '0');
            return `${formattedMinutes}:${formattedSeconds}`;
        }
        let currentTime = ap.audio.currentTime;
        let duration = ap.audio.duration;
        rangeDom.max = duration;
        rangeDom.value = currentTime;
        document.querySelector('.current').innerHTML = format(currentTime);
        document.querySelector('.duration').innerHTML = format(duration);
    },
    themeColor: () => {
        let coverUrl = ap.list.audios[ap.list.index].pic;

        xhr.onload = function () {
            let coverUrl = URL.createObjectURL(this.response);
            _image.onload = function () {
                let color = colorThief.getColor(_image);
                document.querySelector(".body").style.background = `linear-gradient(to top, rgba(${color[0]}, ${color[1]}, ${color[2]}, 0.6), transparent)`;
                URL.revokeObjectURL(coverUrl)
            };
            _image.src = coverUrl;
        }
        xhr.open('GET', coverUrl, true);
        xhr.responseType = 'blob';
        xhr.send();
    }

}

rangeDom.addEventListener('input', (event) => {
    ap.seek(event.target.value);
    ap.play();
});
playPause.addEventListener('click', () => { ap.template.button.click() });
skipForwardButton.addEventListener('click', () => { ap.skipForward(); ap.play() });
skipBackButton.addEventListener('click', () => { ap.skipBack(); ap.play() });
modes.addEventListener('click', () => { mui.toast("此功能正在开发中...") })
heart.addEventListener('click', () => { mui.toast("此功能正在开发中...") })


function musicUpdate() {
    let currentAudio = ap.list.audios[ap.list.index];
    let currentLrc = ap.lrc.current[ap.lrc.index];
    // 更新歌曲图片信息
    update.img(currentAudio);
    // 更新歌曲名称信息
    update.name(currentAudio);
    // 更像歌曲作者信息
    update.author(currentAudio);
    // 更新歌词信息
    update.lrc(currentLrc);
    // 更新进度条信息
    update.progress();
}

ap.on("timeupdate", musicUpdate);
ap.on("loadeddata", () => {
    musicUpdate();
    update.themeColor();
})
ap.on("play", () => {
    playPause.classList = "fa fa-pause"
    update.themeColor();
});
ap.on("pause", () => {
    playPause.classList = "fa fa-play"
});
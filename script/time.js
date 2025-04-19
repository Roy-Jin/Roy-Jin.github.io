(async () => {
    let hitokoto = await fetch("https://v1.hitokoto.cn/")
        .catch(() => { return { ok: false } });
    if (hitokoto.ok) {
        hitokoto = await hitokoto.json(); 
    } else {
        hitokoto = { hitokoto: "一言加载失败" }
    }
    setInterval(() => {
        document.getElementById("time").innerHTML =
            `
<p class="time-text">
    <span class="time-num">${dayjs().format("hh:mm:ss")}</span>
    <span class="time-sub-text">${dayjs().format("A")}</span>
</p>
<p class="day-text">${dayjs().format("dddd, D MMMM.")}</p>
<hr>
<div class="hitokoto"><div class="text">${hitokoto.hitokoto}</div><div class="from">——《${hitokoto.from}》</div></div>
`
    }, 999)
})()
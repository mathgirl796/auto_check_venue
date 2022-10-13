function ring_once() {
    window.AudioContext = window.AudioContext || window.webkitAudioContext;
    var audioCtx = new AudioContext();
    var oscillator = audioCtx.createOscillator();
    var gainNode = audioCtx.createGain();
    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    oscillator.type = "sine";
    oscillator.frequency.value = 196.00;
    gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
    gainNode.gain.linearRampToValueAtTime(1, audioCtx.currentTime + 0.01);
    oscillator.start(audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 1);
    oscillator.stop(audioCtx.currentTime + 1);
    delete audioCtx;
    delete oscillator;
    delete gainNode;
}

function check_once() {
    place = document.querySelector("#app > div > div.nav > div.bread > span").innerText;
    date = document.querySelector("#app > div > div.card > div:nth-child(4) > div > div > div.session-head > div.time-select > div.time-line > div.time-middle").innerText;
    console.log("checking", place, date, "下午...");
    a = Array.from(document.getElementsByClassName("session-item")).map(function(x) {
        return x.innerText;
    });
    for (var s of a) {
        if (s[0] == "1" && s.indexOf("点击") >= 0) {
            msg = place + " " + date + " " + s.split("\n")[0] + " " + "可以预约";
            console.log(msg);
            ring_once();
        }
    }
    button = document.querySelector("#app > div > div.card > div:nth-child(4) > div > div > div.session-head > div.time-select > div.time-line > div.time-sides");
    button.click();
}

function check_one_place() {
    setTimeout(check_once, 10);
    setTimeout(check_once, 10);
}

function refresh() {
    console.log("刷新页面");
    document.close();
    document.write('<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><meta http-equiv="X-UA-Compatible" content="IE=edge"><meta name="viewport" content="width=device-width,user-scalable=no,minimum-scale=1,maximum-scale=1"><title>工大app</title><link rel="stylesheet" href="./css/animate.min.css"><link href="/css/chunk-20e26175.67a22edd.css" rel="prefetch"><link href="/css/chunk-4416c270.6c7b48ac.css" rel="prefetch"><link href="/css/chunk-5a9a4e8a.7c3ccc14.css" rel="prefetch"><link href="/css/chunk-647f7d60.684fb414.css" rel="prefetch"><link href="/css/chunk-77da2deb.9bab7b05.css" rel="prefetch"><link href="/css/chunk-7eb5f846.f279205d.css" rel="prefetch"><link href="/css/chunk-940ee052.3fe749b1.css" rel="prefetch"><link href="/css/chunk-9707ac80.b581d151.css" rel="prefetch"><link href="/css/chunk-adf0aafa.a9d0276b.css" rel="prefetch"><link href="/css/chunk-c92ec57e.dc7a3c67.css" rel="prefetch"><link href="/css/chunk-fee98ec0.e8b536de.css" rel="prefetch"><link href="/js/chunk-20e26175.96e7fa6f.js" rel="prefetch"><link href="/js/chunk-4416c270.1bf09d3c.js" rel="prefetch"><link href="/js/chunk-502fbe04.3caa6a4b.js" rel="prefetch"><link href="/js/chunk-5a9a4e8a.88bbf547.js" rel="prefetch"><link href="/js/chunk-647f7d60.c3262bac.js" rel="prefetch"><link href="/js/chunk-77da2deb.4651e602.js" rel="prefetch"><link href="/js/chunk-7eb5f846.f9303ac6.js" rel="prefetch"><link href="/js/chunk-940ee052.0fd430e3.js" rel="prefetch"><link href="/js/chunk-9707ac80.730944a5.js" rel="prefetch"><link href="/js/chunk-adf0aafa.26e741aa.js" rel="prefetch"><link href="/js/chunk-c92ec57e.36c618f6.js" rel="prefetch"><link href="/js/chunk-fee98ec0.d744fbfc.js" rel="prefetch"><link href="/css/app.df549113.css" rel="preload" as="style"><link href="/css/chunk-vendors.d0cb2b5c.css" rel="preload" as="style"><link href="/js/app.0b35a9bd.js" rel="preload" as="script"><link href="/js/chunk-vendors.b6e57c9d.js" rel="preload" as="script"><link href="/css/chunk-vendors.d0cb2b5c.css" rel="stylesheet"><link href="/css/app.df549113.css" rel="stylesheet"></head><body><div id="app"></div><script src="/js/chunk-vendors.b6e57c9d.js"></script><script src="/js/app.0b35a9bd.js"></script></body></html>');
}

function todo_list() {
    place_list = document.getElementsByClassName("place-item");
    l = [];
    for (var x of place_list) {
        if (x.innerText.indexOf(venue) >= 0 && x.innerText.indexOf(campus) >= 0) {
            l.push(x);
        }
    }
    return l;
}

function check_all_place() {
    todo_i = 0;
    time_shift = 0;
    for (var j = 0; j < todo_list().length; j++) {
        for (var k = 0; k < pipeline.length; k++) {
            setTimeout(pipeline[k], time_shift);
            time_shift += inner_interval;
        }
    }
}

function start() {
    interval = inner_interval * pipeline.length * todo_list().length;
    console.log("interval:", interval);

    setTimeout(function() {
        refresh();
    }, 0);
    setTimeout(function() {
        check_all_place();
    }, refresh_time);

    itv = setTimeout(function() {
        start();
    }, interval + refresh_time);
}

function stop() {
    clearTimeout(itv);
}

pipeline = [function() {
    console.log(todo_list()[todo_i]);
    todo_list()[todo_i].click();
}, function() {
    ack_btn = document.querySelector("#app > div > div.agree-card-w > div > div.agree-commit > div");
    ack_btn.click();
}, function() {
    check_one_place();
}, function() {
    back_btn = document.querySelector("#app > div > div.nav > div.go-back");
    back_btn.click();
}, function() {
    todo_i += 1;
}];
venue = "羽毛";
campus = "一校区";
inner_interval = 800;
refresh_time = 1000;

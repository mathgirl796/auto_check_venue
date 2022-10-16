function ring_once(freq) {
    window.AudioContext = window.AudioContext || window.webkitAudioContext;
    var audioCtx = new AudioContext();
    var oscillator = audioCtx.createOscillator();
    var gainNode = audioCtx.createGain();
    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    oscillator.type = "sine";
    oscillator.frequency.value = freq;
    gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
    gainNode.gain.linearRampToValueAtTime(1, audioCtx.currentTime + 0.01);
    oscillator.start(audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 1);
    oscillator.stop(audioCtx.currentTime + 1);
    delete audioCtx;
    delete oscillator;
    delete gainNode;
}

function ring(times) {
    var latency = 200;
    var sum = 0;
    for (var i=0;i<times;i++) {
        setTimeout(ring_once, sum, 261.626);
        sum += latency;
    }
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
            ring(5);
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
    /* console.log("刷新页面"); */
    document.querySelector("#app > div.page-container > div.sport-nav > div.item-container > div > div:nth-child(1) > img").click();
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

start_run_counter = 0;
function start() {
    interval = inner_interval * pipeline.length * todo_list().length;
    console.log("interval:", interval, 
                "脚本已执行次数：", start_run_counter,
                "当前时间：", Date());
    start_run_counter ++;

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

start();

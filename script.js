// ==============================
// 音樂時間格式
// ==============================

function formatTime(seconds) {

    if (
        !Number.isFinite(seconds) ||
        seconds < 0
    ) {
        return "0:00";
    }

    const minutes =
        Math.floor(seconds / 60);

    const remainingSeconds =
        Math.floor(seconds % 60);

    return `${minutes}:${remainingSeconds
        .toString()
        .padStart(2, "0")}`;
}

// ==============================
// 音樂列表
// ==============================


const musicFiles = [
    "01 Katana ZERO (OST-version).mp3",
    "02 Sneaky Driver.mp3",
    "03 Disturbed Lines.mp3",
    "04 You Will Never Know.mp3",
    "05 Third District.mp3",
    "06 Meat Grinder.mp3",
    "07 All For Now.mp3",
    "08 Overdose.mp3",
    "09 Driving Force- Neon Fog.mp3",
    "10 Chinatown.mp3",
    "11 Breath Of A Serpent.mp3",
    "12 Delusive Bunker.mp3",
    "13 Full Confession.mp3",
    "14 Rain On Brick.mp3",
    "15 Silhouette.mp3",
    "16 The Sandman 1.mp3",
    "17 Nocturne (Co-composed by Justin Stander).mp3",
    "18 Volition.mp3",
    "19 Coming Down.mp3",
    "20 A Fine Red Mist.mp3",
    "21 Panoramic Feelings.mp3",
    "22 Psychotherapy.mp3",
    "23 Prison Air 1.mp3",
    "24 Prison Air 2.mp3",
    "25 Hit The Floor.mp3",
    "26 Kill Your TV.mp3",
    "27 Tied Up The Moment.mp3",
    "28 A Tense Moment.mp3",
    "29 Snow.mp3",
    "30 End Of The Road.mp3",
    "31 Come and See.mp3",
    "32 The Sandman 2.mp3",
    "33 Blue Room (KZ-version).mp3",
    "34 At Home.mp3",
    "35 V Limo (New Donk Shitty).mp3",
    "36 Worst Neighbors Ever.mp3",
    "37 Boss Boss Boss.mp3",
    "38 (Bonus) The Sandman 1 (Casio Whistle Ringtone).mp3"
];


// ==============================
// 取得 HTML 元素
// ==============================

const musicList = document.getElementById("music-list");

const nowPlayingName =
    document.getElementById("now-playing-name");

const nowPlayingPlayPause =
    document.getElementById("now-playing-play-pause");

const nowPlayingPrev =
    document.getElementById("now-playing-prev");

const nowPlayingNext =
    document.getElementById("now-playing-next");

const nowPlayingProgress =
    document.getElementById("now-playing-progress");


// ==============================
// 音樂播放器狀態
// ==============================

let currentAudio = null;
let currentButton = null;
let currentIndex = -1;

let audioStarted = false;

const audioPlayers = [];


// ==============================
// 隨機選擇歌曲
// ==============================

function randomIndexExcept(exceptIndex) {

    if (musicFiles.length <= 1) {
        return 0;
    }

    let index;

    do {
        index = Math.floor(
            Math.random() * musicFiles.length
        );
    }
    while (index === exceptIndex);

    return index;
}


// ==============================
// 更新右上角進度條
// ==============================

function updateTopProgress(value) {

    nowPlayingProgress.value = value;

    nowPlayingProgress.style.setProperty(
        "--value",
        `${value}%`
    );
}


// ==============================
// 更新目前播放歌曲名稱
// ==============================

function setNowPlaying(index) {

    if (index >= 0) {

        nowPlayingName.textContent =
            musicFiles[index];

    } else {

        nowPlayingName.textContent = "無";

    }
}


// ==============================
// 重設播放按鈕
// ==============================

function resetButton(button) {

    if (!button) {
        return;
    }

    button.innerHTML =
        '<i class="fas fa-play"></i>';
}


// ==============================
// 更新右上角播放按鈕
// ==============================

function updateTopButton() {

    if (
        currentAudio &&
        !currentAudio.paused
    ) {

        nowPlayingPlayPause.innerHTML =
            '<i class="fas fa-pause"></i>';

    } else {

        nowPlayingPlayPause.innerHTML =
            '<i class="fas fa-play"></i>';

    }
}


// ==============================
// 播放指定歌曲
// ==============================

function playTrack(index = currentIndex) {

    if (
        index < 0 ||
        index >= audioPlayers.length
    ) {
        return;
    }


    const item = audioPlayers[index];


    // 如果目前有其他歌曲正在播放
    if (
        currentAudio &&
        currentAudio !== item.audio
    ) {

        currentAudio.pause();

        currentAudio.currentTime = 0;

        resetButton(currentButton);
    }


    currentAudio = item.audio;

    currentButton = item.button;

    currentIndex = index;


    setNowPlaying(index);


    const playPromise =
        currentAudio.play();


    // Chrome / Edge 可能阻擋 autoplay
    if (
        playPromise &&
        typeof playPromise.catch === "function"
    ) {

        playPromise

            .then(() => {

                audioStarted = true;

                currentButton.innerHTML =
                    '<i class="fas fa-pause"></i>';

                updateTopButton();

            })

            .catch(() => {

                audioStarted = false;

                resetButton(currentButton);

                updateTopButton();

            });

    }
}


// ==============================
// 暫停目前歌曲
// ==============================

function pauseTrack() {

    if (!currentAudio) {
        return;
    }


    currentAudio.pause();

    resetButton(currentButton);

    updateTopButton();
}


// ==============================
// 載入歌曲
// ==============================

function loadTrack(
    index,
    shouldPlay = true
) {

    if (
        index < 0 ||
        index >= audioPlayers.length
    ) {
        return;
    }


    // 停止上一首
    if (
        currentAudio &&
        currentAudio !==
        audioPlayers[index].audio
    ) {

        currentAudio.pause();

        currentAudio.currentTime = 0;

        resetButton(currentButton);
    }


    currentAudio =
        audioPlayers[index].audio;

    currentButton =
        audioPlayers[index].button;

    currentIndex = index;


    setNowPlaying(index);


    // 新歌曲從 0% 開始
    updateTopProgress(0);


    if (shouldPlay) {

        playTrack(index);

    } else {

        updateTopButton();

    }
}


// ==============================
// 下一首
// 隨機播放
// ==============================

function playNextTrack() {

    const nextIndex =
        randomIndexExcept(currentIndex);

    loadTrack(
        nextIndex,
        true
    );
}


// ==============================
// 上一首
// ==============================

function playPreviousTrack() {

    const previousIndex =
        randomIndexExcept(currentIndex);

    loadTrack(
        previousIndex,
        true
    );
}


// ==============================
// 建立所有音樂播放器
// ==============================

musicFiles.forEach(
    (file, index) => {

        // --------------------------
        // 播放器外框
        // --------------------------

        const player =
            document.createElement("div");

        player.className =
            "music-player";


        // --------------------------
        // 音樂資訊
        // --------------------------

        const musicInfo =
            document.createElement("div");

        musicInfo.className =
            "music-info";


        // --------------------------
        // 音樂名稱
        // --------------------------

        const musicName =
            document.createElement("span");

        musicName.textContent =
            file;

        musicInfo.appendChild(
            musicName
        );


        // --------------------------
        // 播放按鈕
        // --------------------------

        const playButton =
            document.createElement("button");

        playButton.type =
            "button";

        playButton.title =
            "播放 / 暫停";

        playButton.innerHTML =
            '<i class="fas fa-play"></i>';


        musicInfo.appendChild(
            playButton
        );


        player.appendChild(
            musicInfo
        );


        // --------------------------
        // 音樂進度條
        // --------------------------

        const progressBar =
            document.createElement("input");

        progressBar.type =
            "range";

        progressBar.value =
            0;

        progressBar.min =
            0;

        progressBar.max =
            100;

        progressBar.step =
            0.1;

        progressBar.setAttribute(
            "aria-label",
            `${file} 音樂進度`
        );


        player.appendChild(
            progressBar
        );


        // --------------------------
        // 時間顯示
        // --------------------------

        const timeDisplay =
            document.createElement("div");

        timeDisplay.className =
            "time-display";

        timeDisplay.textContent =
            "0:00 / 0:00";


        player.appendChild(
            timeDisplay
        );


        // --------------------------
        // 建立 Audio
        // --------------------------

        const audio =
            new Audio(
                `Katana Zero mp3/${file}`
            );


        audio.preload =
            "metadata";


        // --------------------------
        // 取得歌曲長度
        // --------------------------

        audio.addEventListener(
            "loadedmetadata",
            () => {

                timeDisplay.textContent =
                    `0:00 / ${formatTime(
                        audio.duration
                    )}`;

            }
        );
        


        // --------------------------
        // 播放進度更新
        // --------------------------

        audio.addEventListener(
            "timeupdate",
            () => {

                if (
                    !Number.isFinite(
                        audio.duration
                    ) ||
                    audio.duration <= 0
                ) {
                    return;
                }


                const percent =
                    (
                        audio.currentTime /
                        audio.duration
                    ) * 100;


                progressBar.value =
                    percent;


                progressBar.style.setProperty(
                    "--value",
                    `${percent}%`
                );


                // 如果是目前歌曲
                // 同步右上角進度條

                if (
                    currentAudio === audio
                ) {

                    updateTopProgress(
                        percent
                    );

                }


                // 更新時間

                timeDisplay.textContent =
                    `${formatTime(
                        audio.currentTime
                    )} / ${formatTime(
                        audio.duration
                    )}`;

            }
        );


        // ==========================
        // ★ 歌曲播放完畢
        // ★ 自動隨機下一首
        // ==========================

        audio.addEventListener(
            "ended",
            () => {

                if (
                    currentAudio === audio
                ) {

                    playNextTrack();

                }

            }
        );


        // ==========================
        // 音樂列表播放按鈕
        // ==========================

        playButton.addEventListener(
            "click",
            (event) => {

                event.stopPropagation();


                // 點擊其他歌曲
                if (
                    currentAudio !== audio
                ) {

                    loadTrack(
                        index,
                        true
                    );

                    return;
                }


                // 目前歌曲是暫停
                if (
                    audio.paused
                ) {

                    playTrack(index);

                } else {

                    pauseTrack();

                }

            }
        );


        // ==========================
        // 音樂列表進度條
        // ==========================

        progressBar.addEventListener(
            "input",
            () => {

                if (
                    !Number.isFinite(
                        audio.duration
                    ) ||
                    audio.duration <= 0
                ) {
                    return;
                }


                audio.currentTime =
                    (
                        progressBar.value /
                        100
                    ) *
                    audio.duration;

            }
        );


        // ==========================
        // 加入頁面
        // ==========================

        musicList.appendChild(
            player
        );


        // 儲存播放器
        audioPlayers.push({
            audio: audio,
            button: playButton
        });

    }
);


// ==============================
// 初始隨機歌曲
// ==============================

const initialIndex =
    Math.floor(
        Math.random() *
        musicFiles.length
    );


loadTrack(
    initialIndex,
    false
);


// ==============================
// 嘗試自動播放
// ==============================
//
// 注意：
// Chrome / Edge / Firefox 可能禁止
// 網頁載入後直接播放「有聲音」。
// 所以這裡先嘗試一次。
// 如果被瀏覽器擋住，下面的第一次
// 使用者操作會重新播放。
// ==============================

playTrack(
    initialIndex
);


// ==============================
// 使用者第一次操作頁面後
// 嘗試啟動音樂
// ==============================

function startMusicAfterInteraction() {

    if (
        audioStarted ||
        !currentAudio
    ) {
        return;
    }


    playTrack(
        currentIndex
    );
}


// 滑鼠點擊
document.addEventListener(
    "pointerdown",
    startMusicAfterInteraction,
    {
        once: true,
        passive: true
    }
);


// 鍵盤
document.addEventListener(
    "keydown",
    startMusicAfterInteraction,
    {
        once: true
    }
);


// 手機觸控
document.addEventListener(
    "touchstart",
    startMusicAfterInteraction,
    {
        once: true,
        passive: true
    }
);


// ==============================
// 右上角播放 / 暫停
// ==============================

nowPlayingPlayPause.addEventListener(
    "click",
    (event) => {

        event.stopPropagation();


        if (!currentAudio) {

            loadTrack(
                initialIndex,
                true
            );

            return;
        }


        if (
            currentAudio.paused
        ) {

            playTrack(
                currentIndex
            );

        } else {

            pauseTrack();

        }

    }
);


// ==============================
// ★ 右上角上一首
// ==============================

nowPlayingPrev.addEventListener(
    "click",
    (event) => {

        event.stopPropagation();

        playPreviousTrack();

    }
);


// ==============================
// ★ 右上角下一首
// ==============================

nowPlayingNext.addEventListener(
    "click",
    (event) => {

        event.stopPropagation();

        playNextTrack();

    }
);


// ==============================
// ★ 右上角進度條
// ==============================

nowPlayingProgress.addEventListener(
    "input",
    () => {

        if (
            !currentAudio ||
            !Number.isFinite(
                currentAudio.duration
            ) ||
            currentAudio.duration <= 0
        ) {
            return;
        }


        currentAudio.currentTime =
            (
                nowPlayingProgress.value /
                100
            ) *
            currentAudio.duration;


        updateTopProgress(
            nowPlayingProgress.value
        );

    }
);


// ==============================
// JavaScript 實現點選選單切換內容
// ==============================

const menuLinks = document.querySelectorAll(
    ".horizontal-menu a, .header__logo"
);

const contentSections = document.querySelectorAll(
    ".content"
);


// ==============================
// 預設顯示首頁
// ==============================

contentSections.forEach(section => {
    section.classList.remove("active");
});

const homeSection = document.getElementById("home");

if (homeSection) {
    homeSection.classList.add("active");
}


// ==============================
// 選單點擊事件
// ==============================

menuLinks.forEach(link => {

    link.addEventListener("click", (e) => {

        e.preventDefault();

        // 隱藏所有內容
        contentSections.forEach(section => {
            section.classList.remove("active");
        });


        // 取得要顯示的頁面
        const targetId =
            link.getAttribute("data-target") || "home";


        const targetSection =
            document.getElementById(targetId);


        // 顯示指定頁面
        if (targetSection) {
            targetSection.classList.add("active");
        }

    });

});


// ==============================
// 遊戲玩法圖片顯示功能
// ==============================

const gameplayOptions =
    document.querySelectorAll(
        ".gameplay-option"
    );


gameplayOptions.forEach(
    option => {

        // --------------------------
        // 取得圖片
        // --------------------------

        const imageNames =
            option
                .getAttribute(
                    "data-image"
                )
                .split(",");


        // --------------------------
        // 建立圖片彈出區域
        // --------------------------

        const popup =
            document.createElement(
                "div"
            );

        popup.className =
            "gameplay-popup";


        // --------------------------
        // 建立圖片
        // --------------------------

        imageNames.forEach(
            imageName => {

                const img =
                    document.createElement(
                        "img"
                    );


                img.src =
                    `image/Gameplay/${imageName.trim()}`;


                img.alt =
                    option.textContent.trim();


                popup.appendChild(
                    img
                );

            }
        );


        // --------------------------
        // 多張圖片
        // --------------------------

        if (
            imageNames.length > 1
        ) {

            popup.classList.add(
                "horizontal"
            );

        }


        // --------------------------
        // ★ 把圖片放到目前的 LI 裡
        // --------------------------

        option.appendChild(
            popup
        );


        // ==========================
        // 滑鼠移入
        // ==========================

        option.addEventListener(
            "mouseenter",
            () => {

                popup.classList.add(
                    "active"
                );

            }
        );


        // ==========================
        // 滑鼠移出
        // ==========================

        option.addEventListener(
            "mouseleave",
            () => {

                popup.classList.remove(
                    "active"
                );

            }
        );

    }
);

// 將秒數轉換為 mm:ss 格式
function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
}

// 音樂列表
const musicFiles = [
    "01 Katana ZERO (OST-version).mp3",
    "02 Sneaky Driver.mp3",
    "03 Disturbed Lines.mp3",
    "04 You Will Never Know.mp3",
    "05 Third District.mp3",
    "06 Meat Grinder.mp3",
    "07 All For Now.mp3",
    "08 Overdose.mp3",
    "09 Neon Fog.mp3",
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

// 動態生成音樂播放器
const musicList = document.getElementById("music-list");
let currentAudio = null; // 當前播放的音頻
let currentButton = null; // 當前播放的按鈕

// 隨機選擇一首音樂
const randomIndex = Math.floor(Math.random() * musicFiles.length);
const randomFile = musicFiles[randomIndex];

// 更新當前播放音樂顯示
const nowPlayingName = document.getElementById("now-playing-name");
const nowPlayingPlayPause = document.getElementById("now-playing-play-pause");
const nowPlayingProgress = document.getElementById("now-playing-progress");

nowPlayingName.textContent = randomFile;

musicFiles.forEach((file, index) => {
    const player = document.createElement("div");
    player.className = "music-player";

    // 音樂名稱
    const musicInfo = document.createElement("div");
    musicInfo.className = "music-info";
    const musicName = document.createElement("span");
    musicName.textContent = file;
    musicInfo.appendChild(musicName);

    // 播放/暫停按鈕
    const playButton = document.createElement("button");
    playButton.innerHTML = '<i class="fas fa-play"></i>'; // 播放圖示
    musicInfo.appendChild(playButton);

    player.appendChild(musicInfo);

    // 進度條
    const progressBar = document.createElement("input");
    progressBar.type = "range";
    progressBar.value = 0;
    progressBar.min = 0;
    progressBar.max = 100;
    player.appendChild(progressBar);

    // 時間顯示
    const timeDisplay = document.createElement("div");
    timeDisplay.className = "time-display";
    timeDisplay.textContent = "0:00 / 0:00";
    player.appendChild(timeDisplay);

    // 音頻元素
    const audio = new Audio(`Katana Zero mp3/${file}`);
    audio.addEventListener("loadedmetadata", () => {
        // 當音頻元數據載入完成後，更新總時長
        timeDisplay.textContent = `0:00 / ${formatTime(audio.duration)}`;
    });

    audio.addEventListener("timeupdate", () => {
        // 更新進度條
        progressBar.value = (audio.currentTime / audio.duration) * 100;
        nowPlayingProgress.value = (audio.currentTime / audio.duration) * 100;
        // 更新時間顯示
        timeDisplay.textContent = `${formatTime(audio.currentTime)} / ${formatTime(audio.duration)}`;
    });

    // 播放/暫停功能
    playButton.addEventListener("click", () => {
        if (currentAudio && currentAudio !== audio) {
            currentAudio.pause(); // 停止當前播放的音頻
            currentButton.innerHTML = '<i class="fas fa-play"></i>'; // 重置按鈕圖示
        }

        if (audio.paused) {
            audio.play();
            playButton.innerHTML = '<i class="fas fa-pause"></i>'; // 暫停圖示
            nowPlayingPlayPause.innerHTML = '<i class="fas fa-pause"></i>'; // 更新右上角按鈕
            currentAudio = audio; // 更新當前播放的音頻
            currentButton = playButton; // 更新當前播放的按鈕
            nowPlayingName.textContent = file; // 更新當前播放音樂顯示
        } else {
            audio.pause();
            playButton.innerHTML = '<i class="fas fa-play"></i>'; // 播放圖示
            nowPlayingPlayPause.innerHTML = '<i class="fas fa-play"></i>'; // 更新右上角按鈕
            currentAudio = null; // 清除當前播放的音頻
            currentButton = null; // 清除當前播放的按鈕
            nowPlayingName.textContent = "無"; // 清除當前播放音樂顯示
        }
    });

    // 進度條控制
    progressBar.addEventListener("input", () => {
        const seekTime = (progressBar.value / 100) * audio.duration;
        audio.currentTime = seekTime;
    });

    nowPlayingProgress.addEventListener("input", () => {
        const seekTime = (nowPlayingProgress.value / 100) * audio.duration;
        audio.currentTime = seekTime;
    });

    musicList.appendChild(player);

    // 如果是隨機選擇的音樂，自動播放
    if (file === randomFile) {
        audio.play();
        playButton.innerHTML = '<i class="fas fa-pause"></i>'; // 暫停圖示
        nowPlayingPlayPause.innerHTML = '<i class="fas fa-pause"></i>'; // 更新右上角按鈕
        currentAudio = audio; // 更新當前播放的音頻
        currentButton = playButton; // 更新當前播放的按鈕
    }
});

// 右上角播放/暫停按鈕功能
nowPlayingPlayPause.addEventListener("click", () => {
    if (currentAudio) {
        if (currentAudio.paused) {
            currentAudio.play();
            nowPlayingPlayPause.innerHTML = '<i class="fas fa-pause"></i>'; // 暫停圖示
        } else {
            currentAudio.pause();
            nowPlayingPlayPause.innerHTML = '<i class="fas fa-play"></i>'; // 播放圖示
        }
    }
});

// JavaScript 實現點選選單切換內容
const menuLinks = document.querySelectorAll('.horizontal-menu a');
const contentSections = document.querySelectorAll('.content');

// 預設顯示首頁內容區域
contentSections[0].classList.add('active');

menuLinks.forEach(link => {
    link.addEventListener("click", (e) => {
        e.preventDefault(); // 防止連結跳轉

        // 隱藏所有內容區域
        contentSections.forEach(section => {
            section.classList.remove('active');
        });

        // 顯示點選的內容區域
        const targetId = link.getAttribute('data-target');
        const targetSection = document.getElementById(targetId);
        if (targetSection) {
            targetSection.classList.add('active');
        }
    });
});

// 遊戲玩法圖片顯示功能
const gameplayOptions = document.querySelectorAll('.gameplay-option');
const gameplayImages = document.getElementById('gameplay-images');

gameplayOptions.forEach(option => {
    option.addEventListener('mouseenter', () => {
        const imageNames = option.getAttribute('data-image').split(',');

        // 清空圖片顯示區域
        gameplayImages.innerHTML = '';

        // 根據圖片名稱動態生成圖片
        imageNames.forEach(imageName => {
            const img = document.createElement('img');
            img.src = `image/Gameplay/${imageName}`;
            img.alt = option.textContent;
            gameplayImages.appendChild(img);
        });

        // 判斷是否需要水平排列（如果有多張圖片）
        if (imageNames.length > 1) {
            gameplayImages.classList.add('horizontal');
        } else {
            gameplayImages.classList.remove('horizontal');
        }

        // 顯示圖片區域
        gameplayImages.classList.add('active');
    });

    // 鼠標離開時隱藏圖片區域
    option.addEventListener('mouseleave', () => {
        gameplayImages.classList.remove('active');
    });
});
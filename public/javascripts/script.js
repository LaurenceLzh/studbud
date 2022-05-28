/* Set the width of the sidebar to 250px (show it) */
let show = true;
const sidePanel = document.getElementById("side_panel");
function toggleNav() {
  if (show) {
    sidePanel.style.width = "0px";
    show = false;
  } else {
    sidePanel.style.width = "250px";
    show = true;
  }
}

const sidePanelLinks = sidePanel.querySelectorAll('a');
const iframe = document.getElementById('iframe');
sidePanelLinks.forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const href = e.target.href;
    sidePanelLinks.forEach(l => l.classList.remove('active'));
    link.classList.add('active');
    iframe.setAttribute('src', href);
  });
});
document.getElementById('play_list').addEventListener('click', () => {
  sidePanelLinks.forEach(l => l.classList.remove('active'));
  sidePanelLinks[sidePanelLinks.length - 1].classList.add('active');
  iframe.setAttribute('src', 'music.html');
});

const tomatoTime = document.getElementById('tomatoTime');
const tomatoProgress = document.getElementById('tomatoProgress');
const endAudio = document.getElementById('end_audio');
const tomatoStatus = document.getElementById('tomato_status');
let tomatoWorkingInterval;
let pauseFlag = false;
let tomatoPauseTime = 0;
let tomatoStartTime;
let tomatoEndTime;
let duration = 0;
function startWorkingTime(hour, minute, breakHour, breakMinute) {
  if (tomatoWorkingInterval) {
    clearInterval(tomatoWorkingInterval);
  }
  tomatoPauseTime = 0;
  tomatoStartTime = Date.now();
  duration = hour + minute;
  tomatoEndTime = tomatoStartTime + duration;
  tomatoStatus.innerHTML = 'WORKING';
  tomatoStatus.style.backgroundColor = '#f4a261';
  tomatoWorkingInterval = setInterval(() => {
    if (!pauseFlag) {
      console.log(tomatoPauseTime);
      const times = tomatoEndTime - Date.now() - tomatoPauseTime;
      if (times <= 0) {
        clearInterval(tomatoWorkingInterval);
        endAudio.play();
        startBreakTime(breakHour, breakMinute);
        return;
      }

      const minutes = Math.floor(times / 60000);
      const seconds = Math.floor(( times - minutes * 60000) / 1000);

      const timeStr = (minutes < 10 ? "0" + minutes : minutes) + ":"
        + (seconds < 10 ? "0" + seconds : seconds);
      tomatoTime.innerHTML = timeStr;
      tomatoProgress.style.width = ((hour + minute) - times) / (hour + minute) * 100 + '%';
      iframe.contentWindow.tomatoUpdate(timeStr, (hour + minute) / 60000, 'WORKING');
    }
  }, 16)
}

function startBreakTime(hour, minute) {
  if (tomatoWorkingInterval) {
    clearInterval(tomatoWorkingInterval);
  }
  tomatoPauseTime = 0;
  tomatoStatus.innerHTML = 'BREAK';
  tomatoStatus.style.backgroundColor = '#a0f4ea';
  tomatoStartTime = Date.now();
  duration = hour + minute;
  tomatoEndTime = tomatoStartTime + duration;
  tomatoWorkingInterval = setInterval(() => {
    if (!pauseFlag) {
      const times = tomatoEndTime - Date.now() - tomatoPauseTime;
      if (times <= 0) {
        clearInterval(tomatoWorkingInterval);
        return;
      }
      const minutes = Math.floor(times / 60000);
      const seconds = Math.floor(( times - minutes * 60000) / 1000);

      const timeStr = (minutes < 10 ? "0" + minutes : minutes) + ":"
        + (seconds < 10 ? "0" + seconds : seconds);
      tomatoTime.innerHTML = timeStr;
      tomatoProgress.style.width = ((hour + minute) - times) / (hour + minute) * 100 + '%';
      iframe.contentWindow.tomatoUpdate(timeStr, (hour + minute) / 60000, 'BREAK');
    }
  });
}

tomatoTime.addEventListener('click', () => {
  pauseFlag = !pauseFlag;
  if (pauseFlag) {
    tomatoPauseTime = Date.now() - tomatoStartTime;
  } else {
    tomatoEndTime = Date.now() + duration;
  }
});

let musicIndex = 0;
let currentMusic;
let musicInterval;
let pause = false;
let pauseTime = 0;
let startTime;
const musicList = document.querySelectorAll('#music_list .music-item');
const audios = document.querySelectorAll('#music_list audio');
const musicProgress = document.getElementById('music_progress');

function playMusic() {
  const musicItem = musicList[musicIndex];
  if (pause) {
    pause = false;
    currentMusic.play();
  } else {
    startTime = Date.now();
    musicList.forEach(item => item.style.display = 'none');
    musicItem.style.display = 'flex';
    pauseTime = 0;
    currentMusic = musicItem.querySelector('audio');
    currentMusic.play();
    currentMusic.removeEventListener('ended', playEnd);
    currentMusic.addEventListener('ended', playEnd);
  }

  const duration = parseInt(currentMusic.duration) * 1000;
  const musicEndTime = Date.now() + duration;

  if (musicInterval) {
    clearInterval(musicInterval);
  }
  musicInterval = setInterval(() => {
    const times = musicEndTime - Date.now() - pauseTime;
    if (times <= 0) {
      clearInterval(musicInterval);
      return;
    }
    musicProgress.style.width = (duration - times) / (duration) * 100 + '%'
  }, 16);
}

function playEnd() {
  if (playMode === 0) {
    musicIndex++;
    if (musicIndex === 5) {
      musicIndex = 0;
    }
  } else {
    musicIndex = Math.floor(Math.random() * 4);
  }
  playMusic();
  if (iframe.contentWindow.setMusicItemActive) {
    iframe.contentWindow.setMusicItemActive();
  }
}

const stopBtn = document.getElementById('stop-btn');
stopBtn.addEventListener('click', () => {
  currentMusic.pause();
  pause = true;
  pauseTime = Date.now() - startTime;
  clearInterval(musicInterval);
  playBtn.style.display = 'block';
  stopBtn.style.display = 'none';
});

const playBtn = document.getElementById('play-btn');
playBtn.addEventListener('click', () => {
  playMusic();
  playBtn.style.display = 'none';
  stopBtn.style.display = 'block';
});

const prevBtn = document.getElementById('prev-btn');
prevBtn.addEventListener('click', () => {
  if (musicIndex > 0) {
    musicIndex--;
    audios.forEach(audio => {
      audio.pause();
      audio.currentTime = 0;
    });
    playMusic();
    playBtn.style.display = 'none';
    stopBtn.style.display = 'block';
    if (iframe.contentWindow.setMusicItemActive) {
      iframe.contentWindow.setMusicItemActive();
    }
  }
});

const nextBtn = document.getElementById('next-btn');
nextBtn.addEventListener('click', () => {
  if (musicIndex < 3) {
    musicIndex++;
    audios.forEach(audio => {
      audio.pause();
      audio.currentTime = 0;
    });
    playMusic();
    playBtn.style.display = 'none';
    stopBtn.style.display = 'block';
    if (iframe.contentWindow.setMusicItemActive) {
      iframe.contentWindow.setMusicItemActive();
    }
  }
});

let playMode = 0;
const orderPlay = document.getElementById('order_play');
const randomPlay = document.getElementById('random_play');
orderPlay.addEventListener('click', () => {
  if (playMode === 0) {
    playMode = 1;
    orderPlay.style.display = 'none';
    randomPlay.style.display = 'inline-block';
  }
});

randomPlay.addEventListener('click', () => {
  if (playMode === 1) {
    playMode = 0;
    orderPlay.style.display = 'inline-block';
    randomPlay.style.display = 'none';
  }
});

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
// iframe route to the link when slide panel link click
sidePanelLinks.forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const href = e.target.href;
    sidePanelLinks.forEach(l => l.classList.remove('active'));
    link.classList.add('active');
    iframe.setAttribute('src', href);
  });
});
// play list button click to route music page
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
// start working time
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
  // call the anonymous function every 10 seconds, update progress and time string
  tomatoWorkingInterval = setInterval(() => {
    if (!pauseFlag) {
      console.log(tomatoPauseTime);
      const times = tomatoEndTime - Date.now() - tomatoPauseTime;
      // when working time is end, play an end music, then start break time
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

// start break time
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
  // call the anonymous function every 10 seconds, update progress and time string
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

// pause and continue tomato time when click
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
  const musicItem = musicList[musicIndex]; // get music by current music index
  if (pause) {
    pause = false;
    currentMusic.play();
  } else {
    // new music to play
    startTime = Date.now();
    musicList.forEach(item => item.style.display = 'none');
    musicItem.style.display = 'flex';
    pauseTime = 0;
    currentMusic = musicItem.querySelector('audio');
    currentMusic.play();
    currentMusic.removeEventListener('ended', playEnd);
    currentMusic.addEventListener('ended', playEnd);
  }

  // calculate play time and update play progress
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

// when a music play end, it will play another by play mode
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

// pause the music when click
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

// set play music to prev
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

// set play music to next
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

// switch play music mode
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

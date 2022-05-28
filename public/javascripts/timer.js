const start = document.getElementById('start');
const pause = document.getElementById('pause');
const reset = document.getElementById('reset');
const time = document.getElementById('time');


const addBtn = document.getElementById('add');

const addModal = document.querySelector('.add-modal');
const addCancel = document.querySelector('#add_cancel');
const addConfirm = document.querySelector('#add_confirm');
const workingTimeHour = document.querySelector('#working_time_hour');
const workingTimeMinute = document.querySelector('#working_time_minute');
const breakTimeHour = document.querySelector('#break_time_hour');
const breakTimeMinute = document.querySelector('#break_time_minute');
addBtn.addEventListener('click', () => {
	addModal.style.display = 'block';
	addBtn.classList.add('active');
});
addCancel.addEventListener('click', () => {
	addModal.style.display = 'none';
	addBtn.classList.remove('active');
});
addConfirm.addEventListener('click', () => {
	const hour = parseInt(workingTimeHour.value) * 60000;
	const minute = parseInt(workingTimeMinute.value) * 1000;
	const breakHour = parseInt(breakTimeHour.value) * 60000;
	const breakMinute = parseInt(breakTimeMinute.value) * 1000;
	window.parent.startWorkingTime(hour, minute, breakHour, breakMinute);
	addModal.style.display = 'none';
	addBtn.classList.remove('active');
});


const tomatoStatus = document.getElementById('tomato_status');
const totalMinute = document.getElementById('total_minute');
const tomatoRestTime = document.getElementById('tomato_rest_time');
const timerTop = document.getElementById('timer_top');
function tomatoUpdate(timeStr, minutes, status) {
	tomatoStatus.innerHTML = status + ' TIME';
	if (status === 'BREAK') {
		timerTop.style.backgroundColor = '#a0f4ea';
	} else {
		timerTop.style.backgroundColor = '#f4a261';
	}
	totalMinute.innerHTML = minutes + ' minutes';
	tomatoRestTime.innerHTML = timeStr;
}

let currentTime;
let pauseTime = 0;
let timeInterval;
let starting = false;

start.addEventListener('click', () => {
	if (!starting) {
		starting = true;
		currentTime = Date.now() - pauseTime;
		timeInterval = setInterval(timeStart, 16);
		
	}
});

pause.addEventListener('click', () => {
	if (starting) {
		pauseTime = Date.now() - currentTime;
		starting = false;
		clearInterval(timeInterval);
	}
});

reset.addEventListener('click', () => {
	currentTime;
	pauseTime = 0;
	clearInterval(timeInterval);
	timeInterval = undefined;
	time.innerHTML =  '00:00:00';
	starting = false;
});

function timeStart () {
	const times = Date.now() - currentTime;
	const minutes = Math.floor(times / 60000);
	const seconds = Math.floor(( times - minutes * 60000) / 1000);
	const ms = Math.floor((times - minutes * 60000 - seconds * 1000) / 10);

	time.innerHTML=
		(minutes<10 ? "0" +minutes : minutes)+":"
		+(seconds<10 ? "0"+seconds :seconds)+":"
		+(ms<10 ? "0"+ms : ms);
}

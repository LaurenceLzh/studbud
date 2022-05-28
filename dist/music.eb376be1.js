function setMusicItemActive() {
    const musicItems = window.parent.document.querySelectorAll('.music-item');
    const activeMusicIndex = Array.from(musicItems).findIndex((item)=>item.style.display === 'flex'
    );
    const listItems = Array.from(document.querySelectorAll('.list-item'));
    listItems.forEach((item)=>item.classList.remove('active')
    );
    listItems[activeMusicIndex].classList.add('active');
}
window.onload = ()=>{
    setMusicItemActive();
};

//# sourceMappingURL=music.eb376be1.js.map

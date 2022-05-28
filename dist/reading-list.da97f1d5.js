const data = [
    {
        projectName: 'DECO2014',
        activityName: 'A3 Report',
        contentName: 'Google',
        content: 'Google. (n.d.). Retrieved April 14, 2022, from https://www.google.com.hk/',
        link: 'HTTPS://WWW.GOOGLE.COM.HK/'
    },
    {
        projectName: 'DECO2014',
        activityName: 'A3 Report',
        contentName: 'Google',
        content: 'Google. (n.d.). Retrieved April 14, 2022, from https://www.google.com.hk/',
        link: 'HTTPS://WWW.GOOGLE.COM.HK/'
    },
    {
        projectName: 'DECO2014',
        activityName: 'A3 Report',
        contentName: 'Google',
        content: 'Google. (n.d.). Retrieved April 14, 2022, from https://www.google.com.hk/',
        link: 'HTTPS://WWW.GOOGLE.COM.HK/'
    }, 
];
const list = document.getElementById('list');
function renderList() {
    let listStr = '';
    const groupData = {};
    data.forEach((item)=>{
        if (groupData[item.projectName]) groupData[item.projectName].push(item);
        else groupData[item.projectName] = [
            item
        ];
    });
    Object.keys(groupData).forEach((key)=>{
        listStr += `<div class="list-top"><div class="list-btn" style="background-color: #b8b8ff">${key}</div>
					<div class="list-btn open-link" data-key="${key}" style="cursor: pointer;background-color: #a0f4ea">OPEN LINK</div></div>`;
        groupData[key].forEach((item)=>{
            const listItem = `
				<div class="list-item">
					<div class="top">${item.activityName}</div>
					<div class="middle">
						<div>${item.contentName}</div>
						<div>${item.content}</div>
					</div>
					<div class="bottom">
						<span class="link-icon"></span>
						${item.link}
					</div>
				</div>
			`;
            listStr += listItem;
        });
    });
    list.innerHTML = listStr;
    addItemClickEvent();
}
renderList();
let editItemIndex;
function addItemClickEvent() {
    const listItems = document.querySelectorAll('.list-item');
    listItems.forEach((item1)=>{
        item1.addEventListener('click', ()=>{
            listItems.forEach((item)=>item.classList.remove('active')
            );
            item1.classList.add('active');
            editItemIndex = Array.from(listItems).indexOf(item1);
        });
    });
    const openLinks = document.querySelectorAll('.open-link');
    openLinks.forEach((item2)=>{
        const key = item2.dataset.key;
        item2.addEventListener('click', (e)=>{
            e.stopPropagation();
            data.filter((item)=>item.projectName === key
            ).forEach((item)=>{
                window.open(item.link, '_blank').location;
            });
        });
    });
}
const addBtn = document.getElementById('add');
const addProjectName = document.getElementById('add_project_name');
const addActivityName = document.getElementById('add_activity_name');
const addContentName = document.getElementById('add_content_name');
const addContent = document.getElementById('add_content');
const addLink = document.getElementById('add_link');
const addModal = document.querySelector('.add-modal');
addBtn.addEventListener('click', ()=>{
    addModal.style.display = 'block';
    addBtn.classList.add('active');
});
const addConfirm = document.querySelector('#add_confirm');
const addCancel = document.querySelector('#add_cancel');
addConfirm.addEventListener('click', ()=>{
    data.push({
        projectName: addProjectName.value,
        activityName: addActivityName.value,
        contentName: addContentName.value,
        content: addContent.value,
        link: addLink.value
    });
    renderList();
    addProjectName.value = '';
    addActivityName.value = '';
    addContentName.value = '';
    addContent.value = '';
    addLink.value = '';
    addModal.style.display = 'none';
    addBtn.classList.remove('active');
});
addCancel.addEventListener('click', ()=>{
    addModal.style.display = 'none';
    addBtn.classList.remove('active');
});
const editBtn = document.getElementById('edit');
const editModal = document.querySelector('.edit-modal');
const editProjectName = document.getElementById('edit_project_name');
const editActivityName = document.getElementById('edit_activity_name');
const editContentName = document.getElementById('edit_content_name');
const editContent = document.getElementById('edit_content');
const editLink = document.getElementById('edit_link');
editBtn.addEventListener('click', ()=>{
    if (editItemIndex !== undefined) {
        const item = data[editItemIndex];
        editProjectName.value = item.projectName;
        editActivityName.value = item.activityName;
        editContentName.value = item.contentName;
        editContent.value = item.content;
        editLink.value = item.link;
        editModal.style.display = 'block';
        editBtn.classList.add('active');
    }
});
const editCancel = document.getElementById('edit_cancel');
const editDelete = document.getElementById('edit_delete');
const editConfirm = document.getElementById('edit_confirm');
editCancel.addEventListener('click', ()=>{
    editModal.style.display = 'none';
    editBtn.classList.remove('active');
});
editDelete.addEventListener('click', ()=>{
    data.splice(editItemIndex, 1);
    renderList();
    editModal.style.display = 'none';
    editBtn.classList.remove('active');
});
editConfirm.addEventListener('click', ()=>{
    if (editItemIndex !== undefined) {
        const item = data[editItemIndex];
        item.projectName = editProjectName.value;
        item.activityName = editActivityName.value;
        item.contentName = editContentName.value;
        item.content = editContent.value;
        item.link = editLink.value;
        renderList();
        editModal.style.display = 'none';
        editBtn.classList.remove('active');
    }
});

//# sourceMappingURL=reading-list.da97f1d5.js.map

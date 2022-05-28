const data = [
	{
		projectName: 'DECO2014',
		state: 'READY',
		activityName: 'A3 Report',
		content: 'Type what you want to type',
		dueDate: new Date()
	},
	{
		projectName: 'DECO2017',
		state: 'READY',
		activityName: 'A3 Report',
		content: 'Type what you want to type',
		dueDate: new Date()
	}
];
let currentState = 'READY';

const list = document.getElementById('list');

function renderList() {
	let listStr = '';
	data
		.filter(item => item.state === currentState)
		.forEach(item => {
		const listItem = `
			<div class="list-item">
				<div class="top">
					<div>${item.projectName}</div>
					<div class="state ${item.state.toLowerCase()}">${item.state}</div>
				</div>
				<div class="middle">
					<div>${item.activityName}</div>
					<div>${item.content}</div>
				</div>
				<div class="bottom">
					<span class="time-icon"></span>
<!--					<img src="./images/time.png" alt="time" width="30" height="30" />-->
					DUE ON ${item.dueDate.toLocaleDateString()}
				</div>
			</div>
		`;
		listStr += listItem;
	});
	list.innerHTML = listStr;
	addItemClickEvent();
}

renderList();

const addBtn = document.getElementById('add');
const addModal = document.querySelector('.add-modal');
addBtn.addEventListener('click', () => {
	addBtn.classList.add('active');
	addModal.style.display = 'block';
});

const addConfirm = document.querySelector('#add_confirm');
const addCancel = document.querySelector('#add_cancel');
const addProjectName = document.getElementById('add_project_name');
const addActivityName = document.getElementById('add_activity_name');
const addContent = document.getElementById('add_content');
const addDate = document.getElementById('add_date');
const addState = document.getElementById('add_state');

const allState = addState.querySelectorAll('div');
allState.forEach(item => {
	item.addEventListener('click', () => {
		allState.forEach(state => state.classList.remove('active'));
		item.classList.add('active');
	});
});

function resetFormValue() {
	addProjectName.value = '';
	addActivityName.value = '';
	addContent.value = '';
	addDate.value = '';
	allState.forEach(state => state.classList.remove('active'));
}

addConfirm.addEventListener('click', () => {
	const state = addState.querySelector('.active').textContent;

	data.push({
		projectName: addProjectName.value,
		state: state,
		activityName: addActivityName.value,
		content: addContent.value,
		dueDate: new Date(addDate.value)
	});
	renderList();
	resetFormValue();
	addModal.style.display = 'none';
	addBtn.classList.remove('active');
});

addCancel.addEventListener('click', () => {
	addModal.style.display = 'none';
	addBtn.classList.remove('active');
	resetFormValue();
});

let editItemIndex;

function addItemClickEvent() {
	const listItems = document.querySelectorAll('.list-item');
	// console.log(listItems);
	listItems.forEach(item => {
		item.addEventListener('click', () => {
			listItems.forEach(item => item.classList.remove('active'));
			item.classList.add('active');
			editItemIndex = Array.from(listItems).indexOf(item);
		});
	});
}


const editBtn = document.getElementById('edit');
const editModal = document.querySelector('.edit-modal');
editBtn.addEventListener('click', () => {
	if (editItemIndex !== undefined) {
		const item = data[editItemIndex];
		editProjectName.value = item.projectName;
		editActivityName.value = item.activityName;
		editContent.textContent = item.content;
		editDate.value = item.dueDate.toISOString().substr(0, 10);
		allEditState.forEach(state => {
			if (state.textContent === item.state) {
				state.classList.add('active');
			}
		});
		editModal.style.display = 'block';
		editBtn.classList.add('active');
	}
});

const editCancel = document.getElementById('edit_cancel');
const editDelete = document.getElementById('edit_delete');
const editConfirm = document.getElementById('edit_confirm');
const editProjectName = document.getElementById('edit_project_name');
const editActivityName = document.getElementById('edit_activity_name');
const editContent = document.getElementById('edit_content');
const editDate = document.getElementById('edit_date');
const editState = document.getElementById('edit_state');
const allEditState = editState.querySelectorAll('div');
allEditState.forEach(item => {
	item.addEventListener('click', () => {
		allEditState.forEach(state => state.classList.remove('active'));
		item.classList.add('active');
	});
});

editCancel.addEventListener('click', () => {
	editModal.style.display = 'none';
	editBtn.classList.remove('active');
});
editDelete.addEventListener('click', () => {
	data.splice(editItemIndex, 1);
	renderList();
	editModal.style.display = 'none';
	editBtn.classList.remove('active');
});
editConfirm.addEventListener('click', () => {
	if (editItemIndex !== undefined) {
		const state = editState.querySelector('.active').textContent;

		const item = data[editItemIndex];
		item.projectName = editProjectName.value;
		item.activityName = editActivityName.value;
		item.content = editContent.textContent;
		item.dueDate = new Date(editDate.value);
		item.state = state;

		renderList();
		editModal.style.display = 'none';
		editBtn.classList.remove('active');
	}
});

const stateList = document.querySelectorAll('.list-bottom div')
stateList.forEach(item => {
	item.addEventListener('click', () => {
		stateList.forEach(item => item.classList.remove('active'));
		item.classList.add('active');
		currentState = item.textContent;
		renderList();
	});
});

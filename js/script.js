const form = document.querySelector('#form')
const taskInput = document.querySelector('#taskInput')
const tasksList = document.querySelector('#tasksList')
const emptyList = document.querySelector('#emptyList')
const clearButton = document.querySelector('#removeCopletedTasks')

let tasks = []

if (localStorage.getItem('tasks')) {
	tasks = JSON.parse(localStorage.getItem('tasks'))
	tasks.forEach(task => renderTask(task))
}

checkEmptyList()

form.addEventListener('submit', addTask)
tasksList.addEventListener('click', deleteTask)
tasksList.addEventListener('click', doneTask)
clearButton.addEventListener('click', deleteCompletedTasks)

function addTask(event) {
	event.preventDefault()

	const taskText = taskInput.value

	if (taskInput.value.trim() === '') {
		return
	}

	const newTask = {
		id: Date.now(),
		text: taskText,
		done: false
	}

	tasks.push(newTask)

	savetoLocalStorage()

	renderTask(newTask)

	taskInput.value = ''
	taskInput.focus()
	
	// if(tasksList.children.length > 1) emptyList.classList.add('none')

	checkEmptyList()
}

function deleteTask(event) {
	if (event.target.dataset.action !== 'delete') return

	const perentNode = event.target.closest('.list-group-item')

	const id = Number(perentNode.id)

	const index = tasks.findIndex(task => task.id === id)

	console.log(index)

	tasks.splice(index, 1)

	savetoLocalStorage()

	perentNode.remove()

	// if(tasksList.children.length === 1) emptyList.classList.remove('none')

	checkEmptyList()
}

function doneTask(event) {
	if (event.target.dataset.action !== 'done') return

	const parentNode = event.target.closest('.list-group-item')

	const id = Number(parentNode.id)
	const task = tasks.find(task => task.id === id)
	task.done = !task.done

	savetoLocalStorage()

	const taskTitle = parentNode.querySelector('.task-title')

	taskTitle.classList.toggle('task-title--done')
}

function checkEmptyList() {
	if (tasks.length === 0) {
		const emptyListHTML = `<li id="emptyList" class="list-group-item empty-list">
		<img src="./img/box.png" alt="Empty" width="48" class="mt-3">
		<div class="empty-list__title">The list is empty</div>
	</li>`
		tasksList.insertAdjacentHTML('afterbegin', emptyListHTML)
	}

	if (tasks.length > 0) {
		const emptyListEl = document.querySelector('#emptyList')
		emptyListEl ? emptyListEl.remove() : null
	}
}

function savetoLocalStorage() {
	localStorage.setItem('tasks', JSON.stringify(tasks))
}

function renderTask(task) {
	const cssClass = task.done ? 'task-title task-title--done' : 'task-title'

	const taskHTML = `<li id="${task.id}" class="list-group-item d-flex justify-content-between task-item">
					<span class="${cssClass}">${task.text}</span>
					<div class="task-item__buttons">
						<button type="button" data-action="done" class="btn-action">
							<img src="./img/tick.svg" alt="Done" width="18" height="18">
						</button>
						<button type="button" data-action="delete" class="btn-action">
							<img src="./img/cross.svg" alt="Delete" width="18" height="18">
						</button>
					</div>
				</li>`

	tasksList.insertAdjacentHTML('beforeend', taskHTML)
}

function deleteCompletedTasks(event) {
	if (event.target.dataset.action !== 'clear') return

	tasks.forEach(task => {
		const index = tasks.findIndex(task => task.done === true)
		// console.log(tasks.findIndex(task => task.done === true))
		if ((tasks.findIndex(task => task.done === true)) >= 0) {
			tasks.splice(index, 1)
		}
	})

	savetoLocalStorage()
	checkEmptyList()

	window.location.reload();
}

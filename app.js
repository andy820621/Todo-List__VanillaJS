const addBtn = document.querySelector(".formBtn");
const sortBtn = document.querySelector(".sort button");
const select = document.querySelector(".select select");
const todoContainer = document.querySelector(".todo-container");
const alertContainer = document.querySelector(".alert-container");
const inputs = document.querySelectorAll("input");
const monthArray = [];
let alertArray = [];
for (let i = 1; i <= 12; i++) {
	getLastDate(i);
}
function getLastDate(month) {
	let thisYear = new Date().getFullYear();
	let date = new Date(thisYear, month, 0).getDate();
	monthArray.push(date);
}

// EventListener
document.addEventListener("DOMContentLoaded", showData); // get Localstorage data & show to Web
addBtn.addEventListener("click", addTodoFunction);
sortBtn.addEventListener("click", sortFunction);

// Add todo to Web Function
function addTodoFunction(e) {
	e.preventDefault();

	// get value
	let todoText = inputs[0].value;
	let todoMonth = inputs[1].value;
	let todoDate = inputs[2].value;
	let completedCalss = false;

	// check value
	checkValue(todoMonth, todoDate);
	if (alertArray.length > 0)
		return (alertContainer.textContent = alertArray[0]);

	alertContainer.textContent = "";

	// save to localStorage
	let thisTodoValueObject = {
		todoText: todoText,
		todoMonth: todoMonth,
		todoDate: todoDate,
		completedCalss: completedCalss,
	};
	saveLocalTodos(thisTodoValueObject);

	// create todo
	createtodo({ todoText, todoMonth, todoDate });

	// Clean form all inputs value
	inputs[0].value = "";
	inputs[1].value = "";
	inputs[2].value = "";
}

// Create todo function
function createtodo(object) {
	// get value
	let todoText = object.todoText;
	let todoMonth = object.todoMonth;
	let todoDate = object.todoDate;
	let completedCalss = object.completedCalss;

	// create Todo
	let todo = document.createElement("li");
	todo.classList.add("todo");
	if (completedCalss) todo.classList.add("completed"); // check if completed
	let text = document.createElement("p");
	text.classList.add("todo-text");
	text.textContent = todoText;
	let time = document.createElement("p");
	time.classList.add("todo-time");
	time.textContent = todoMonth + "/" + todoDate;

	// create check & trash button
	let completeBtn = document.createElement("button");
	completeBtn.classList.add("complete-btn");
	completeBtn.innerHTML = `<i class="fas fa-check"></i>`;
	completeBtn.addEventListener("click", (e) => {
		let todoItem = e.target.parentElement;
		todoItem.classList.toggle("completed");
		updateLocalTodos(todoItem);
	});
	let deleteBtn = document.createElement("button");
	deleteBtn.classList.add("delete-btn");
	deleteBtn.innerHTML = `<i class="fas fa-trash"></i>`;
	deleteBtn.addEventListener("click", (e) => {
		let todoItem = e.target.parentElement;
		removeLocalTodos(todoItem);
		todo.classList.add("scaleDown");
		todoItem.addEventListener("animationend", (e) => e.target.remove());
	});

	todo.appendChild(text);
	todo.appendChild(time);
	todo.appendChild(completeBtn);
	todo.appendChild(deleteBtn);

	todo.classList.add("scaleUp");
	todo.addEventListener("animationend", (e) =>
		e.target.classList.remove("scaleUp")
	);

	todoContainer.appendChild(todo);
}

// get Localstorage data & show Function
function showData() {
	let todoListsArray = JSON.parse(localStorage.getItem("todoLists"));
	todoListsArray?.forEach((todo) => {
		createtodo(todo);
	});
}

// Check inputs value functions
function checkIsNaInteger(value) {
	let checkNumber = Number(value);
	return !Number.isInteger(checkNumber);
}
function checkMonth(month) {
	if (month > 12 || month < 1) return true;
}
function checkDate(month, date) {
	if (date > monthArray[month - 1] || date <= 0) return true;
}
function checkValue(todoMonth, todoDate) {
	alertArray = [];
	inputs.forEach((input, index) => {
		input.dataset.check = "";
		input.classList.remove("alert");

		if (input.value === "") {
			input.dataset.check = "alert";
			if (index === 0) return alertArray.push("*Please type something 🙏🙏");
			return alertArray.push("*Please enter a date 🙏🙏");
		}
		if (index !== 0 && checkIsNaInteger(input.value)) {
			input.dataset.check = "alert";
			return alertArray.push(`*Please enter a Integer Number 🙏🙏`);
		}
		if (index === 1 && checkMonth(todoMonth)) {
			input.dataset.check = "alert";
			alertArray.push(`*Please enter a Integer Number from 1 to 12`);
		}
		if (index === 2 && checkDate(todoMonth, todoDate)) {
			input.dataset.check = "alert";
			alertArray.push(
				`*Please enter a Integer Number from 1 to ${
					monthArray[todoMonth - 1]
				} 🙏🙏`
			);
		}
	});
	let alertSelectors = document.querySelectorAll('input[data-check = "alert"]');
	alertSelectors?.forEach((alertSelector) =>
		alertSelector.classList.add("alert")
	);
}

// localStorage functions
function saveLocalTodos(todo) {
	//Check---Hey Do I already have thing in there?
	let todoLists = localStorage.getItem("todoLists");
	if (todoLists === null) {
		todoLists = [];
	} else {
		todoLists = JSON.parse(todoLists);
	}

	todoLists.push(todo);
	localStorage.setItem("todoLists", JSON.stringify(todoLists));
}
function removeLocalTodos(todo) {
	let todoLists = JSON.parse(localStorage.getItem("todoLists"));
	const todoIndex = [...todoContainer.querySelectorAll(".todo")].indexOf(todo);

	todoLists.splice(todoIndex, 1);
	localStorage.setItem("todoLists", JSON.stringify(todoLists));
}
function updateLocalTodos(todo) {
	let todoLists = JSON.parse(localStorage.getItem("todoLists"));
	const todoIndex = [...todoContainer.querySelectorAll(".todo")].indexOf(todo);

	if (todoLists[todoIndex].completedCalss === false) {
		todoLists[todoIndex].completedCalss = true;
	} else {
		todoLists[todoIndex].completedCalss = false;
	}
	localStorage.setItem("todoLists", JSON.stringify(todoLists));
}

// Merge Sort Function
function mergeTime(array1, array2) {
	let result = [];
	let i = 0,
		j = 0;

	while (i < array1.length && j < array2.length) {
		if (Number(array1[i].todoMonth) > Number(array2[j].todoMonth)) {
			result.push(array2[j]);
			j++;
		} else if (Number(array1[i].todoMonth) < Number(array2[j].todoMonth)) {
			result.push(array1[i]);
			i++;
		} else if (Number(array1[i].todoMonth) === Number(array2[j].todoMonth)) {
			if (array1[i].todoDate > array2[j].todoDate) {
				result.push(array2[j]);
				j++;
			} else {
				result.push(array1[i]);
				i++;
			}
		}
	}

	while (i < array1.length) {
		result.push(array1[i]);
		i++;
	}
	while (j < array2.length) {
		result.push(array2[j]);
		j++;
	}

	return result;
}
function mergeSort(array) {
	if (array.length === 1) return array;

	let middleIndex = Math.floor(array.length / 2);
	let left = array.slice(0, middleIndex);
	let right = array.slice(middleIndex, array.length);
	return mergeTime(mergeSort(left), mergeSort(right));
}

function sortFunction() {
	// sort localStorage data
	let sortArray = mergeSort(JSON.parse(localStorage.getItem("todoLists")));
	localStorage.setItem("todoLists", JSON.stringify(sortArray));

	// remove html all todos
	let todoItems = todoContainer.querySelectorAll(".todo");
	todoItems.forEach((todo) => todo.remove());

	showData();
}

// Select Filter
select.addEventListener("change", filterTodo);

function filterTodo(e) {
	const todos = todoContainer.childNodes;
	todos.forEach((todo) => {
		switch (e.target.value) {
			case "all":
				showTodo(todo);
				break;
			case "completed":
				todo.classList.contains("completed") ? showTodo(todo) : hideTodo(todo);
				break;
			case "uncompleted":
				!todo.classList.contains("completed") ? showTodo(todo) : hideTodo(todo);
				break;
		}
	});
}

function showTodo(todo) {
	todo.classList.add("scaleUp");
	todo.classList.remove("scaleDown");
}
function hideTodo(todo) {
	todo.classList.remove("scaleUp");
	todo.classList.add("scaleDown");
}

/**
 * 
 */


export default class taskList extends HTMLElement {
	#shadow;
	#cssfile = "taskList.css";
	constructor() {
		super();
		//Create a shadow DOM structure
		this.#shadow = this.attachShadow({ mode: 'closed' });
		this.#shadow.appendChild(this.#linkElement());
		this.#createHTML();

	}
	/**
	 *	Function to link stylesheet to the shadow document.
	 *		
	 */
	#linkElement() {
		const link = document.createElement('link');

		// Use directory of script as directory of CSS file
		console.log(import.meta.url);
		const path = import.meta.url.match(/.*\//)[0];
		link.href = path.concat(this.#cssfile);
		console.log(link.href);
		link.rel = "stylesheet";
		link.type = "text/css";
		return link;
	}
	/**
	 * Creates the barebone html for the component and adds it to the document	
	 */


	#createHTML() {
		//Adds the button and text to the top of the page
		const button = document.createElement('button');
		button.textContent = 'new task';
		button.className = 'newBtn';
		button.type = "button";
		button.disabled = true;

		//initial html text
		const startText = document.createElement('p');
		startText.className = "startText";
		startText.textContent = "Waiting for server data..";
		this.#shadow.appendChild(startText);
		this.#shadow.appendChild(button);


		//Creates wrapper divs
		const wrapper = document.createElement('div');
		wrapper.className = "wrapper";

		const wrapping = document.createElement('div');
		wrapping.className = "wrapping";

		const textWrapper = document.createElement('div');
		textWrapper.className = "textWrapper";

		const textContent = `<p class="header-text">TASK</p>
		<p class="header-text">STATUS</p>`;


		//Appending all the divs to the page

		textWrapper.insertAdjacentHTML('beforeend', textContent);

		wrapper.appendChild(textWrapper);

		wrapper.appendChild(wrapping);
		this.#shadow.appendChild(wrapper);

	}
	/**
	 * Enables the add task button
	 */
	enableaddtask() {
		const button = this.#shadow.querySelector('.newBtn');
		button.disabled = false;
		const numberofTasks = this.#shadow.querySelectorAll("form").length;
		this.#shadow.querySelector(".startText").textContent = `Number of tasks: ${numberofTasks}`;
	};

	/**
	 *	Displays the task on the website
	 * @param {Object} - the task to be displayed
	 */

	showTask(object) {
		const content = `
		<FORM id = ${object.id}>
		<label for ="html" class="title-text">${object.title}</label>
		<label for ="html" class="status-text">${object.status}</label>
		<select name = "dropdown">
		<option value = "MODIFY" selected>MODIFY</option>
		</select>
		<label for="html"><button type="button" class ="rmBtn">REMOVE</button><label>
		</FORM>
		`;

		const wrapper = this.#shadow.querySelector(".wrapper");
		const wrapping = this.#shadow.querySelector(".wrapping");

		wrapping.insertAdjacentHTML('beforeend', content);
		wrapper.appendChild(wrapping);

	}

	/**
	 *	Updates the status of an existing task
	 * @param {Object}  object - the task to be updated
	 */

	updateTask(object) {
		const taskId = this.#shadow.getElementById(`${object.id}`);
		const label = taskId.querySelector(".status-text");
		label.textContent = object.status;
	};

	/**
	 *	Removes a task with a given id
	 * @param {string} id - the id of the task to be removed
	 */

	removeTask(id) {
		const taskToRemove = this.#shadow.getElementById(id);
		taskToRemove.remove();
	}

	/**
	 *	Sets the possible statuses of a task to the dropdown menu
	 * @param {Array} statusList - A list of statuses
	 */

	setStatuseslist(statusList) {
		const select = this.#shadow.querySelectorAll('select');
		var amount = statusList.length;
		for (let i = 0; i < amount; i++) {
			const newOption = document.createElement('option');
			newOption.value = statusList[i];
			newOption.text = statusList[i];
			select.forEach(element => element.insertAdjacentElement('beforeend', newOption));
		}
		this.changestatusCallback(statusList);
	}

	/** 
	   *	Adds a callback to the select options allowing for the controller code to change status
	 *	@param {Function} callback - function to be calledback
	 */

	changestatusCallback(callback) {
		this.#shadow.querySelectorAll(".dropdown").forEach((select) => {
			select.addEventListener('change', () => {
				const id = this.#shadow.querySelector("form").id;
				const status = select.options[select.selectedIndex].text;
				const taskTitle = this.#shadow.querySelector(".titleText").textContent;
				if (confirm("Set " + "\ " + taskTitle + "\ " + " to " + status + "?")) {
					callback(id, status);
				}
				select.value = "DEFAULT";
			});
		});
	}

	/** 
	   *	Adds a callback to the select options allowing for the controller code to delete a task
	 *	@param {Function} callback - function to be calledback
	 */
	deletetaskCallback(callback) {
		const btn = this.#shadow.querySelectorAll(".rmBtn");
		console.log(btn);
		this.#shadow.querySelectorAll(".rmBtn").forEach((deleteBtn) => {
			deleteBtn.addEventListener("click", () => {
				const id = this.#shadow.querySelector("form").id;
				const taskTitle = this.#shadow.querySelector(".title-text").textContent;
				if (confirm("Delete task " + taskTitle + "?")) {
					callback(id);
				}
			});
		});
	}

	/** 
	   *	Adds a callback to the select options allowing for the controller code to add a task
	 *	@param {Function} callback - function to be calledback
	 */

	addtaskCallback(callback) {
		this.#shadow.querySelector(".newBtn").addEventListener("click", callback);
	}
	/**
	 * Function to determine if there are no task to display
	 */
	noTask() {
		const startText = document.querySelector(".startText");
		if (this.#shadow.querySelector("form") === null) {
			startText.textContent = "No tasks were found.";
			this.#shadow.appendChild(noTask);
		} else {
			this.#shadow.querySelector(".noTask").remove();
		}

	}

}

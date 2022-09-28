
export default class taskBox extends HTMLElement {

	#shadow;
	#cssfile = "taskBox.css";


	constructor() {
		super();
		this.#shadow = this.attachShadow({ mode: 'closed' });
		this.#shadow.appendChild(this.#linkElement());
		this.#createHTML();
		
		const close = this.#shadow.querySelector(".btn");
		close.addEventListener("click", ()=>{
			this.close();
		});
		
	}

	/**
	 * Function to add a callback when clicking the add button, displays the task if the controlling code
	 * has connected to the server
	 * @param {Function} callback - function to be callbacked
	 */
	newtaskCallback(callback) {
		this.#shadow.querySelector(".addBtn").addEventListener("click", () => {
			const task = {
				title: this.#shadow.querySelector(".titleText").value,
				status: this.#shadow.querySelector(".status").value
			}
			callback(task)
		});
	}
	/**
	 * Function to add links to css stylesheet
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
	};

	/**
	 * Function to create initial html to display in when calling the taksbox component
	 */
	#createHTML() {

		const content = `<dialog class="dialog">
		<button type="button" class="btn">&#10006</button><br>
		<label>Title:</label>
		<input type="text" class="titleText"><br>
		<label>Status:</label>
		<select class = "status">
		    <option value="default">Choose…</option>
		</select><br>
		<button type="button" class="addBtn">Add task</button>
		</dialog>
		`;
		const dialogWrapper = document.createElement('div');
		dialogWrapper.className = "dialogWrapper";
		dialogWrapper.insertAdjacentHTML('beforeend', content);
		this.#shadow.appendChild(dialogWrapper);

	};

	/**
	 * Function to show the dialog box
	 */

	show() {
		this.#shadow.querySelector(".titleText").textContent="";
		const dialog = this.#shadow.querySelector("dialog");
		dialog.style.display = "block";
	};

	/**
	 * Function to add statuses to the dialog box option
	 * @param {Array} list - List of statuses to display
	 */
	setStatuseslist(list) {
		const select = this.#shadow.querySelectorAll('select');
		var amount = list.length;
		for (let i = 0; i < amount; i++) {
			const newOption = document.createElement('option');
			newOption.value = list[i];
			newOption.text = list[i];
			select.forEach(element => element.insertAdjacentElement('beforeend', newOption));
		}
	};

	/**
	 * Function to close the dialog box
	 */
	close() {
		const dialogToRemove = this.#shadow.querySelector('dialog');
		dialogToRemove.style.display = "none";
	}
}
/**
 * 
 */
class Controller {

	#tasklist
	#taskbox
	constructor() {
		this.#taskbox = document.querySelectorAll("task-box");
		this.#tasklist = document.querySelectorAll("task-list");
		this.#enableaddTask();
		this.#setStatusesList();
		this.#gettasklist();

		const taskboxes = this.#taskbox;
		this.#tasklist.forEach((tasklist) => {
			tasklist.addtaskCallback(() => {
				taskboxes.forEach((taskbox) => {
					taskbox.show();
				});
			});
		});

		this.#taskbox.forEach((taskbox) => {
			taskbox.newtaskCallback(this.#postTask.bind(this));
			taskbox.newtaskCallback(() => {
				taskbox.close();
			});
		});
	}

	/**
	 * Asynchronous function to retrieve statuslist from server
	 */
	async #setStatusesList() {
		try {
			const response = await fetch("../TaskServices/api/services/allstatuses", { method: "GET" });
			if (response.ok) {
				const json = await response.json();
				if (json.responseStatus) {
					this.#taskbox.forEach((taskbox) => {
						taskbox.setStatuseslist(json.allstatuses);
					});
					this.#tasklist.forEach((tasklist) => {
						tasklist.setStatuseslist(json.allstatuses);
					});
				} else {
					console.log("Error...");
				}

			}
		} catch (e) {
			console.log(`Got error ${e.message}`);
		}

	}

	/**
	 * Asynchronous function to enable addtask button if the server has responded.
	 */
	async #enableaddTask() {
		try {
			const response = await fetch("../TaskServices/api/services/tasklist", { method: "GET" });
			if (response.ok) {
				const tasklist = document.querySelector("task-list");
				tasklist.enableaddtask();
			}
		} catch (e) {
			console.log(`Got error ${e.message}`);
		}

	}


	/**
	 * Asynchronous function to post task to backend
	 * @param {Object} task - task objec to be added to database
	 */
	async #postTask(task) {
		const requestSettings = {
			"method": "POST",
			"headers": { "Content-Type": "application/json; charset=utf-8" },
			"body": JSON.stringify(task),
			"cache": "no-cache",
			"redirect": "error"
		};

		try {
			const response = await fetch("../TaskServices/api/services/task", requestSettings);
			const object = await response.json();
			if (typeof object.responseStatus != "undefined") {
				if (object.responseStatus) {
					this.#tasklist.forEach((tasklist) => {
						tasklist.showTask(object.task);
					});

				} else {
					console.log("Could not connect to server");
				}
			} else {
				console.log("Could not connect to server");
			}

		} catch (e) {
			console.log("Could not connect to server. Reason: " + e);
		}
	}

	/**
	 * Asynchronous function to post task to backend
	 * @param {Object} task - task objec to be added to database
	 */
	async #puttask(id, status) {
		const object = {
			"status": status
		}
		const requestSettings = {
			"method": "PUT",
			"headers":
				{ "Content-Type": "application/json; charset=utf-8" },
			"body": JSON.stringify(object),
			"cache": "no-cache",
			"redirect": "error"
		};
		try {
			const response = await fetch(`../TaskServices/api/services/task${id}`, requestSettings);
			if (response.ok) {
				const json = await response.json();
				if (json.responseStatus) {
					this.#tasklist.updateTask(object)
				}
			} else {
				console.log(`Got response ${response}`)
			}
		} catch (e) {
			console.log(`Got error ${e.message}`);
		}

	}
	/**
	 * Asynchronous function retrieve all tasks from the database
	 */
	async #gettasklist() {
		try {
			const response = await fetch('../TaskServices/api/services/tasklist');
			if (response.ok) {
				const object = await response.json();
				if (typeof object.responseStatus != "undefined") {
					if (object.responseStatus) {
						this.#tasklist.forEach((tasklist) => {
							object.tasks.forEach((task) => {
								tasklist.showTask(task);
							});

							if (object.tasks.length == 0) {
								tasklist.noTask();
							}
							tasklist.enableaddtask();
							tasklist.changestatusCallback(this.#puttask.bind(this));
							tasklist.deletetaskCallback(this.#deletetask.bind(this));
						});
					} else {
						console.log("Could not connect to server");
					}
				} else {
					console.log("Could not connect to server");
				}
			}
		} catch (e) {
			console.log("Could not connect to server. Reason: " + e);
		}
	}
	/**
	 * Asynchronous function to remove task from backend and view
	 * @param {int} id - the id of the task to be deleted
	 */
	async #deletetask(id) {
		const requestSettings = {
			"method": "DELETE",
			"headers": { "Content-Type": "application/json; charset=utf-8" },
			"cache": "no-cache",
			"redirect": "error"
		};

		try {
			const response = await fetch("../TaskServices/api/services/task/" + id, requestSettings);
			if (response.ok) {
				const object = await response.json();
				if (typeof object.responseStatus != "undefined") {
					if (object.responseStatus) {
						this.#tasklist.forEach((tasklist) => {
							tasklist.removeTask(id);
						});
					} else {
						console.log("Could not connect to server");
					}
				} else {
					console.log("Could not connect to server");
				}
			}
		} catch (e) {
			console.log("Could not connect to server. Reason: " + e);
		}
	}
}

new Controller();

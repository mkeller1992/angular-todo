
export class Todo {
	id?: number;
	title: string;
	category: string;
	dueDate: string;
	important: boolean;
	completed: boolean;

	constructor(title: string = null, category: string = null, dueDate: string = null) {
		this.title = title;
		this.category = category;
		this.dueDate = dueDate;
		this.important = false;
		this.completed = false;
	}
}

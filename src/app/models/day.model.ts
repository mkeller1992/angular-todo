import { Todo } from './todo.model';

export class Day {
	date: Date;
	dateAsStr: string;
	weekDay: string;
	todoList: Todo[];

	constructor(date: Date, dateAsStr: string, weekday: string, todoList: Todo[]) {
		this.date = date;
		this.dateAsStr = dateAsStr;
		this.weekDay = weekday;
		this.todoList = todoList;
	}
}

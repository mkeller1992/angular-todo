import { Component, OnInit, Input, EventEmitter, OnDestroy, Output, QueryList, ViewChildren } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Todo } from 'src/app/models/todo.model';
import { Subscription, Observable, forkJoin } from 'rxjs';
import { TodoService } from 'src/app/services/todo.service';
import { MessageService } from 'src/app/services/message.service';
import { BaseFieldComponent } from 'src/app/form-controls/base-field.component';
import { HelpersService } from 'src/app/services/helpers.service';
import { ApiError } from 'src/app/models/api-error.model';
import { concatMap } from 'rxjs/operators';


@Component({
	selector: 'app-edit-overlay',
	templateUrl: './edit-overlay.component.html',
	styleUrls: ['./edit-overlay.component.scss']
})
export class EditOverlayComponent implements OnInit, OnDestroy {

	// all components tagged with #uiElement are being found (must extend BaseFieldComponent)
	@ViewChildren('uiElement') formFields: QueryList<BaseFieldComponent>;

	@Input()
	currentTodo: Todo;

	@Input()
	categories: string[];

	@Input()
	isNew: boolean;

	isRecurring = false;
	recurringUntil: string; // Date as US-String (yyyy-mm-dd)

	get todoList(): Todo[] {
		return this.todoService.allTodos;
	}

	set todoList(value: Todo[]) {
		this.todoService.allTodos = value;
	}

	@Output()
	todoChanged = new EventEmitter<Todo>();

	private _subs = new Subscription();

	constructor(public activeModal: NgbActiveModal,
				private todoService: TodoService,
				private messageSvc: MessageService,
				private h: HelpersService) { }

	ngOnInit() {
		this.messageSvc.clear();
	}


	onSave() {
		this.messageSvc.clear();
		// Check if all inputs are valid:
		const areAllFieldsValid = this.validateFields();
		if (areAllFieldsValid === false) {
			this.getErrorsFromFields().forEach(e => this.messageSvc.showError(e));
			return;
		}
		/* After all input data have been proven to be valid... */
		// If one or more new todo(s) have to be created:
		if (this.isNew) {
			let newTodos: Todo[] = [];
			if (this.isRecurring) {
				newTodos = this.createRecurringTodoItems(this.currentTodo, this.recurringUntil);
			}
			else {
				newTodos.push(this.currentTodo);
			}
			// Save new todo(s) to db
			this.insertTodos(newTodos);
		}
		// If an existing todo has to be completed:
		else if (this.currentTodo.completed) {
			this.messageSvc.showDialog('Please confirm',
										'Do you really want to complete this todo?' +
										'You will no longer be able to edit it.',
										() => this.updateTodo(), 'Confirm', 'Cancel');
		}
		// If an existing todo has to be updated:
		else {
			this.updateTodo();
		}
	}

	onCancel() {
		this.messageSvc.clear();
		this.activeModal.dismiss('Click: Cancel');
	}

	onRequestDelete() {
		this.messageSvc.showDialog('Please confirm',
							'Do you really want to delete this todo?',
							() => this.deleteTodo(), 'Yes', 'No');
	}


	private insertTodos(todoList: Todo[]) {
		// Create one observable for each Todo that has to be created...
		// ... and push it to the observable-list:
		const observableList: Observable<Todo | ApiError>[] = [];
		todoList.forEach(t => observableList.push(this.todoService.createTodo(t)));

		let firstTodoInSeries: Todo = null;

		this._subs.add(
			forkJoin(observableList) // forkJoin makes sure all todos are saved before proceeding to next step in pipe
		.pipe(
			concatMap((allCreatedTodos: Todo[]) => {
				firstTodoInSeries = allCreatedTodos[0];
				return this.todoService.getAllTodos();
		}))
		.subscribe((allExistingTodos: Todo[]) => {
			this.todoService.allTodos = allExistingTodos;
			this.messageSvc.showSuccess('Creation successful!');
			this.todoChanged.next(firstTodoInSeries);
			this.activeModal.close('Click: Save');
		},
		(error) => {
				this.messageSvc.showError('Ooops, something went wrong...');
				this.activeModal.close('Inserting failed - Modal closing');
			}
		));
	}

	private updateTodo() {
		this._subs.add(this.todoService.updateTodo(this.currentTodo).subscribe(
			(todo: Todo) => {
				// Replace in TODO-Array:
				this.todoList[this.todoList.findIndex(t => t.id === todo.id)] = todo;
				// Inform Subscribers:
				this.todoChanged.next(todo);
				console.log(`Todo ${todo.title} was updated in Db!`);
				this.messageSvc.showSuccess('Update successful!');
				this.activeModal.close('Click: Save');
			},
			(error) => {
				this.messageSvc.showError('Updating failed!');
				this.activeModal.close('Updating failed - Modal closing');
			}
		));
	}

	private deleteTodo() {
		this._subs.add(this.todoService.deleteTodo(this.currentTodo.id).subscribe(
			(response: string) => {
				console.log(`Todo ${this.currentTodo.title} was deleted!`);
				// Remove from TODO-Array:
				this.todoList.splice(this.todoList.findIndex(t => t.id === this.currentTodo.id), 1);
				// Inform Subscribers:
				this.todoChanged.next(null);
				this.messageSvc.showSuccess('Deletion successful!');
				this.activeModal.close('Click: Delete');
			},
			(error) => {
				this.messageSvc.showError('Deleting failed!');
				this.activeModal.close('Deleting failed - Modal closing');
			}
		));
	}


	private createRecurringTodoItems(firstTodo: Todo, endDateAsUSString: string): Todo[] {
		const result: Todo[] = [ firstTodo ];
		const firstDueDate = this.h.getDateFromUSString(firstTodo.dueDate);
		const endOfRecurringPeriod = this.h.getDateFromUSString(endDateAsUSString);
		if (endOfRecurringPeriod <= firstDueDate) {
			return result;
		}
		let nextDate = new Date(firstDueDate);
		nextDate.setDate(nextDate.getDate() + 7);
		while (nextDate <= endOfRecurringPeriod) {
			result.push({
				title: firstTodo.title,
				dueDate: this.h.getDateAsUSString(nextDate),
				category: firstTodo.category,
				important: firstTodo.important,
				completed: false
			});
			nextDate = new Date(nextDate);
			nextDate.setDate(nextDate.getDate() + 7);
		}
		return result;
	}

	private validateFields() {
		return this.formFields.filter(f => f.validate() === false).length === 0;
	}

	private getErrorsFromFields(): string [] {
		const result = [];
		this.formFields.forEach((c: BaseFieldComponent ) => {
			result.push(...c.getErrors());
		});
		return result;
	}

	ngOnDestroy(): void {
		this._subs.unsubscribe();
	}

}

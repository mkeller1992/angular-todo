import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { NgbCalendar, NgbDateStruct, NgbModal, NgbDatepicker } from '@ng-bootstrap/ng-bootstrap';
import { Todo } from 'src/app/models/todo.model';
import { TodoService } from 'src/app/services/todo.service';
import { Subscription } from 'rxjs';
import { concatMap } from 'rxjs/internal/operators/concatMap';
import { Day } from 'src/app/models/day.model';
import { EditOverlayComponent } from '../../edit-overlay/edit-overlay.component';
import { HelpersService } from 'src/app/services/helpers.service';


@Component({
	selector: 'app-calendar-view',
	templateUrl: './calendar-view.component.html',
	styleUrls: ['./calendar-view.component.scss']
})
export class CalendarViewComponent implements OnInit, OnDestroy {

	@ViewChild('dp', { static: false })
	ngDatepicker: NgbDatepicker;

	get allTodos(): Todo[] {
		return this.todoSvc.allTodos;
	}

	set allTodos(value: Todo[]) {
		this.todoSvc.allTodos = value;
	}

	get allCategories(): string[] {
		return this.todoSvc.allCategories;
	}

	set allCategories(value: string[]) {
		this.todoSvc.allCategories = value;
	}

	get selectedCategories(): string[] {
		return this.todoSvc.selectedCategories;
	}

	set selectedCategories(value: string[]) {
		this.todoSvc.selectedCategories = value;
	}

	model: NgbDateStruct;
	date: { year: number, month: number, day: number };

	selectedDate: Date;
	selectedTodo: Todo;

	daysOfSelectedWeek: Day[];

	isLoading = false;
	isCalenderCollapsed = true;

	private _subs = new Subscription();

	isDaySelected(d: Day) {
		return this.h.getDateAsUSString(d.date) === this.h.getDateAsUSString(this.selectedDate);
	}

	constructor(private calendar: NgbCalendar,
				private todoSvc: TodoService,
				private h: HelpersService,
				private modalSvc: NgbModal) { }


	ngOnInit() {
		// Set the current day as the starting-point
		this.model = this.calendar.getToday();
		this.selectedDate = new Date(this.model.year, (this.model.month - 1), this.model.day, 0, 0, 0, 0);
		// Fetch todos from Web-Api and assemble the current week
		this.initializeData();
	}

	initializeData() {
		this.isLoading = true;
		this._subs.add(this.todoSvc.getAllCategories().pipe(
			concatMap((categories: string[]) => {
				this.allCategories = categories;
				if (!this.selectedCategories) {
					this.selectedCategories = [...this.allCategories];
				}
				return this.todoSvc.getAllTodos();
			}))
			.subscribe((todoList: Todo[]) => {
				this.allTodos = todoList;
				this.assembleWeekForSelectedDate(this.selectedDate, this.allTodos, this.selectedCategories);
				this.isLoading = false;
				console.log('Initializing of Calendar-View successful!', todoList);
			}
		));
	}

	onShowCalender() {
		this.isCalenderCollapsed = false;
		// Mark calendar-field that corresponds to the selected day in the todo-table:
		setTimeout(() => {
			this.markDateInCalendar(this.h.getDateAsUSString(this.selectedDate));
		}, 100);
	}

	onCategorySelectionChange() {
		this.assembleWeekForSelectedDate(this.selectedDate, this.allTodos, this.selectedCategories);
	}

	onSelectDateInCalendar(chosenDate: NgbDateStruct) {
		const previousFirstDayOfWeek = this.h.getDateAsUSString(this.selectedDate);
		this.selectedDate = new Date(chosenDate.year, (chosenDate.month - 1), chosenDate.day, 0, 0, 0, 0);
		const firstDayOfNewlySelectedWeek = this.h.getDateAsUSString(this.h.getMonday(this.selectedDate));

		// If the just selected week matches the active week => do nothing
		if (previousFirstDayOfWeek && previousFirstDayOfWeek === firstDayOfNewlySelectedWeek) {
			return;
		}
		// If a new week was selected => Refresh the todos-table
		this.assembleWeekForSelectedDate(this.selectedDate, this.allTodos, this.selectedCategories);
	}

	onCreateTodo(selectedDay: Day) {
		// If user clicked plain 'add-todo'-button (which is unreleated to any date)
		if (!selectedDay) {
			this.selectedTodo = new Todo();
			this.startEditingMode(true, this.selectedTodo);
		}
		// If user clicked plus-symbol (which corresponds to a particular date)
		else {
			// Mark date in calendar which corresponds to the date next to the selected add-button
			this.markDateInCalendar(this.h.getDateAsUSString(selectedDay.date));
			// Mark in the todo-table:
			this.selectedDate = selectedDay.date;
			// Start editing-mode:
			this.selectedTodo = new Todo(null, null, this.h.getDateAsUSString(selectedDay.date));
			this.startEditingMode(true, this.selectedTodo);
		}
	}

	onEditTodo(selectedTodo: Todo) {
		// Mark date in calendar which corresponds to the date next to the selected add-button
		this.markDateInCalendar(selectedTodo.dueDate);
		// Mark in the todo-table:
		this.selectedDate = this.h.getDateFromUSString(selectedTodo.dueDate);
		// If todo is already completed, editing is no longer possible
		if (selectedTodo.completed === false) {
			this.selectedTodo = selectedTodo;
			this.startEditingMode(false, Object.assign(new Todo(), selectedTodo));
		}
	}

	startEditingMode(isNew: boolean, cloneOfSelectedItem: Todo) {
		// Prepare editing-screen which will open as a modal window:
		const modalRef = this.modalSvc.open(EditOverlayComponent);
		const modalComponent: EditOverlayComponent = modalRef.componentInstance;
		modalComponent.isNew = isNew;
		modalComponent.categories = this.allCategories;
		modalComponent.currentTodo =  cloneOfSelectedItem;

		// Since categories could have changed => Refresh categories before updating displayed Todos:
		modalComponent.todoChanged.pipe(
			concatMap((justChangedTodo: Todo) => {
				this.selectedTodo = null;
				if (justChangedTodo) {
					this.selectedTodo = justChangedTodo;
					this.selectedDate = this.h.getDateFromUSString(justChangedTodo.dueDate);
				}
				return this.todoSvc.getAllCategories();
			}))
			.subscribe((cat: string[]) => {
				// Update allCategories-List:
				this.todoSvc.allCategories = cat;
				// By adding/ editing a todo, a new todo-category might have been added or a current category is no longer used
				this.updateSelectedCategoriesList(cat, this.selectedTodo ? this.selectedTodo.category : null);
				// Pick those todo-items that need to be displayed in the todo-table
				this.assembleWeekForSelectedDate(this.selectedDate, this.allTodos, this.selectedCategories);
				// Switch to correct year / month / day in calendar:
				this.markDateInCalendar(this.h.getDateAsUSString(this.selectedDate));
			});
	}

	updateSelectedCategoriesList(newCategories: string[], selectedCategory: string) {
		// If a selected category doesn't exist anymore, remove it:
		this.selectedCategories = this.selectedCategories.filter(c => newCategories.includes(c));
		// Make sure the category of the just changed Todo is visible immediately:
		if (selectedCategory && this.selectedCategories.includes(selectedCategory) === false) {
			this.selectedCategories.push(selectedCategory);
			this.selectedCategories.sort();
		}
	}

	assembleWeekForSelectedDate(selectedDate: Date, allTodos: Todo[], selectedCategories: string[]) {
		// Refresh Todos to display:
		this.daysOfSelectedWeek = [];
		this.h.getDatesOfSelectedWeek(selectedDate).forEach(d => {
			const searchKey = this.h.getDateAsUSString(d);
			const todos: Todo[] = allTodos.filter(t => t.dueDate === searchKey && selectedCategories.includes(t.category));
			this.daysOfSelectedWeek.push(new Day(d, this.h.getDateAsCHString(d), this.h.getWeekDay(d), todos));
		});
	}

	/* Mark field in the calendar that corresponds to the incoming date */
	markDateInCalendar(dateAsUSStr /* yyyy-mm-dd */: string) {
		if (dateAsUSStr && this.isCalenderCollapsed === false) {
			// Move to other month / year if needed:
			const d = dateAsUSStr.split('-');
			this.ngDatepicker.navigateTo( { year: +d[0], month: +d[1]} );
			// Set day within the selected month / year:
			this.model = this.h.getNgbDateStructFromUSDateStr(dateAsUSStr);
		}
	}

	ngOnDestroy(): void {
		this._subs.unsubscribe();
	}
}

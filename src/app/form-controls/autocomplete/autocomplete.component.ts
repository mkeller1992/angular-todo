import { Component, OnInit, Input, ViewEncapsulation, Output, EventEmitter, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { NgModel } from '@angular/forms';
import { BaseFieldComponent } from '../base-field.component';


@Component({
	selector: 'app-autocomplete',
	templateUrl: './autocomplete.component.html',
	styleUrls: ['./autocomplete.component.scss'],
	encapsulation: ViewEncapsulation.None
})
export class AutocompleteComponent extends BaseFieldComponent implements OnInit {

	@ViewChild('typeaheadBasic', { static: false })
	set dropdownFormControl(element: NgModel) {
			this.formControl = element.control;
	}

	@Input()
	items: string[];

	@Input()
	currentValue: string;

	@Input()
	labelText: string;

	@Input()
	minLength = 0;

	@Input()
	maxLength = 10000;

	@Input()
	isRequired: boolean;

	@Output()
	currentValueChange = new EventEmitter<string>();

	search = (text$: Observable<string>) =>
		text$.pipe(
		debounceTime(200),
		distinctUntilChanged(),
		map(term => term.length < 1 ? []
			: this.items.filter(v => v.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 4))
	)

	constructor() {
		super();
	}

	ngOnInit() { }

	getErrors(): string[] {
		const errors = [];
		if (this.isRequired && !this.currentValue) {
			errors.push(`The field '${this.labelText}' must not be empty!`);
			return errors;
		}
		if (this.currentValue) {
			if (this.minLength > this.currentValue.length) {
				errors.push(`The field '${this.labelText}' must contain at least ${this.minLength} letters!`);
			}
		}
		return errors;
	}

	onItemChanged(item: string) {
		this.currentValueChange.next(item);
	}

}

import { Component, OnInit, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { FormControl, NgModel } from '@angular/forms';
import { BaseFieldComponent } from '../base-field.component';

@Component({
	selector: 'app-standard-field',
	templateUrl: './standard-field.component.html',
	styleUrls: ['./standard-field.component.scss']
})
export class StandardFieldComponent extends BaseFieldComponent implements OnInit {

	@ViewChild('standardInputField', { static: false })
	set dropdownFormControl(element: NgModel) {
			this.formControl = element.control;
	}

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

	@Input()
	inputType: string;

	@Output()
	currentValueChange = new EventEmitter<string>();


	constructor() {
		super();
	}

	ngOnInit() {
	}

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

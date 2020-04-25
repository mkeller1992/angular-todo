import { FormControl } from '@angular/forms';


export abstract class BaseFieldComponent {

	formControl: FormControl;

	abstract getErrors(): string[];

	validate(): boolean {
		this.formControl.markAsTouched();
		return this.formControl.valid;
	}

}

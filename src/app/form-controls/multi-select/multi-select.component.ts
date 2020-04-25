import { Component, OnInit, Input, Output, EventEmitter, ViewEncapsulation } from '@angular/core';
import { IDropdownSettings } from 'ng-multiselect-dropdown';

@Component({
	selector: 'app-multi-select',
	templateUrl: './multi-select.component.html',
	styleUrls: ['./multi-select.component.scss'],
	encapsulation: ViewEncapsulation.None
})
export class MultiSelectComponent implements OnInit {

	@Input()
	allCategories: string[] = [];

	@Input()
	selectedCategories: string[];

	@Output()
	selectedCategoriesChange = new EventEmitter<string[]>();


	dropdownSettings: IDropdownSettings = {
		singleSelection: false,
		idField: 'val',
		textField: 'val',
		selectAllText: 'Select All',
		unSelectAllText: 'UnSelect All',
		itemsShowLimit: 13,
		allowSearchFilter: true
	};

	ngOnInit() { }

	onItemSelect(item: string) {
		this.selectedCategoriesChange.emit(this.selectedCategories);
	}

	onItemUnselect(item: string) {
		this.selectedCategoriesChange.emit(this.selectedCategories);
	}

	onSelectAll(items: string[]) {
		this.selectedCategoriesChange.emit(this.allCategories);
	}

	onUnselectAll(items: string[]) {
		this.selectedCategoriesChange.emit([]);
	}

}

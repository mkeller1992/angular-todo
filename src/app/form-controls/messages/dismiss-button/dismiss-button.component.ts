import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
	selector: 'app-dismiss-button',
	templateUrl: './dismiss-button.component.html',
	styleUrls: ['./dismiss-button.component.scss']
})
export class DismissButtonComponent implements OnInit {

	// tslint:disable-next-line:no-output-native
	@Output()
	click = new EventEmitter();

	constructor() { }

	ngOnInit() {
	}

	public onButtonClick(event) {
		event.stopPropagation();
		this.click.next(event);
		return false;
	}


}

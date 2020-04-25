import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';


@Component({
	selector: 'app-dialog',
	templateUrl: './dialog.component.html',
	styleUrls: ['./dialog.component.scss']
})
export class DialogComponent implements OnInit {

	@Input()
	title: string;

	@Input()
	text: string;

	@Input()
	okayBtnText: string;

	@Input()
	cancelBtnText: string;

	@Output()
	confirm = new EventEmitter();

	constructor(public activeModal: NgbActiveModal) { }

	ngOnInit() {
	}

	onCancel() {
		this.activeModal.dismiss('Click: Cancel');
	}

	onSave() {
		this.confirm.next();
		this.activeModal.close('Click: Save');
	}

}

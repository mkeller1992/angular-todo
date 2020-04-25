import { Component, OnInit } from '@angular/core';
import { MessageService } from 'src/app/services/message.service';
import { Message } from 'src/app/models/message.model';

@Component({
	selector: 'app-messages',
	templateUrl: './messages.component.html',
	styleUrls: ['./messages.component.scss']
})
export class MessagesComponent implements OnInit {

	get messages(): Message[] {
		return this.msgService.messages;
	}

	constructor(public msgService: MessageService) { }

	ngOnInit() {
	}


}

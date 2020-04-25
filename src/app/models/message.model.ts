import { EventEmitter } from '@angular/core';


export const MessageType = {
	Default: 'default',
	Ok: 'ok',
	Error: 'error',
	Warning: 'warning',
};

export const MessageState = {
	Display: 'display',
	Dismiss: 'dismiss',
	Dismissed: 'dismissed',
};

export class Message {

	public text: string;
	public type: string;
	public dismissable: boolean;
	public state: string;
	public dismissTime: number;

	public prematureDismissalRequested = new EventEmitter();

	constructor(text: string, type: string, dismissable: boolean, dismissTime = -1) {
		this.text = text;
		this.type = type;
		this.dismissable = dismissable;
		this.dismissTime = dismissTime;
		this.state = MessageState.Display;
	}

	public requestPrematureDismissal() {
		if (this.state === MessageState.Display) {
			this.prematureDismissalRequested.next();
		}
	}

}

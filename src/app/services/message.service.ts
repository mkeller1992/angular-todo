import { Injectable } from '@angular/core';
import { MessageType, MessageState, Message } from '../models/message.model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DialogComponent } from '../form-controls/messages/dialog/dialog.component';


@Injectable({
	providedIn: 'root'
})
export class MessageService {

	messages: Message[] = [];

	constructor(private modalService: NgbModal) { }


	private addMessage(text: string, type = MessageType.Default, dismissable = true, dismissTime = -1) {
		// Remove already dismissed Messages:
		this.messages = this.messages.filter(m => m.state !== MessageState.Dismissed);

		// Create and add new message:
		this.messages.push(new Message(text, type, dismissable, dismissTime));
	}

	public showMessage(message: string, dismissTime: number = 10000) {
		this.addMessage(message, MessageType.Default, true, dismissTime);
	}

	public showSuccess(message: string, dismissTime: number = 2000) {
		this.addMessage(message, MessageType.Ok, (dismissTime <= 0), dismissTime);
	}

	public showWarning(message: string, dismissTime: number = 10000) {
		this.addMessage(message, MessageType.Warning, true, dismissTime);
	}

	public showError(message: string, dismissTime: number = 0) {
		this.addMessage(message, MessageType.Error, true, dismissTime);
	}


	public showDialog(msgTitle: string,
					msgText: string,
					onConfirm: () => void,
					okayBtnTxt = 'OK',
					cancelBtnTxt = 'Abbrechen') {

		const modalRef = this.modalService.open(DialogComponent);
		const modalComponent: DialogComponent = modalRef.componentInstance;
		modalComponent.title = msgTitle;
		modalComponent.text = msgText;
		modalComponent.okayBtnText = okayBtnTxt;
		modalComponent.cancelBtnText = cancelBtnTxt;

		const sub = modalComponent.confirm.subscribe(() => {
			onConfirm();
			sub.unsubscribe();
		});
	}

	public clear() {
		this.messages.forEach(m => {
			if (m != null) {
				m.requestPrematureDismissal();
			}
		});
	}
}

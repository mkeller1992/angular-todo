import { Component, OnInit, Input, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { MessageState, Message } from 'src/app/models/message.model';
import { Subscription } from 'rxjs';


@Component({
	selector: 'app-message',
	templateUrl: './message.component.html',
	styleUrls: ['./message.component.scss'],
	animations: [
		trigger('state', [
			state('void', style({
			height: '0', 'padding-top': '0', 'padding-bottom': '0', 'margin-top': '0', 'margin-bottom': '0'
			})),
			state(MessageState.Display, style({
			height: '*', 'padding-top': '*', 'padding-bottom': '*', 'margin-top': '*', 'margin-bottom': '*'
			})),
			state(MessageState.Dismiss, style({
			height: '0', 'padding-top': '0', 'padding-bottom': '0', 'margin-top': '0', 'margin-bottom': '0'
			})),
			state(MessageState.Dismissed, style({
			display: 'none'
			})),
			transition('* => display', animate('0.5s ease')),
			transition('display => dismiss', animate('0.5s ease'))
		])
	]
})
export class MessageComponent implements OnInit, OnDestroy {

	private _message: Message;
	private _subs = new Subscription();

	@Input()
	set message(value: Message) {
		this._message = value;

		// Watch out for programmatical dismissals e.g. 'messageService.clear()'
		this._subs.add(this._message.prematureDismissalRequested.subscribe(
			() => {
				// Kill timeout-object to prevent double execution:
				if (timeoutObject) {
					clearTimeout(timeoutObject);
				}
				this.setDimissalStart();
				this._subs.unsubscribe();
			}
		));

		let timeoutObject = null;
		// If message has a Dismiss-Time, dismiss it after the specified time:
		if (this._message.dismissTime > 0) {
			timeoutObject = setTimeout(() => {
				this.setDimissalStart();
			}, this.message.dismissTime);
		}
	}

	get message(): Message {
		return this._message;
	}

	constructor(private cdRef: ChangeDetectorRef) { }

	ngOnInit() {
	}

	/* Triggers the animated disappearing of the message */
	public setDimissalStart() {
		if (this.message.state === MessageState.Display) {
			this.message.state = MessageState.Dismiss;
			this.cdRef.detectChanges();
		}
	}

	/* Is evoked at the end of the animated disappearing of the message */
	public onDismissalCompleted() {
		if (this.message.state === MessageState.Dismiss) {
			this.message.state = MessageState.Dismissed;
			this.cdRef.detectChanges();
		}
	}

	ngOnDestroy(): void {
		this._subs.unsubscribe();
	}


}

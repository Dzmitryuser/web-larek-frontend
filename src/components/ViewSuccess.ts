import { IEvents } from './base/events';

export interface ISuccess {
	description: HTMLElement;
	button: HTMLButtonElement;
	success: HTMLElement;
	render(total: number): HTMLElement;
}

export class Success {
	description: HTMLElement;
	closeButton: HTMLButtonElement;
	successWindow: HTMLElement;

	constructor(template: HTMLTemplateElement, protected events: IEvents) {
		this.successWindow = template.content
			.querySelector('.order-success')
			.cloneNode(true) as HTMLElement;
		this.description = this.successWindow.querySelector(
			'.order-success__description'
		);
		this.closeButton = this.successWindow.querySelector(
			'.order-success__close'
		);

		this.closeButton.addEventListener('click', () => {
			events.emit('success:close');
		});
	}

	render(total: number) {
		this.description.textContent = String(`Списано ${total} синапсов`);
		return this.successWindow;
	}
}

import { IEvents } from './base/events';

export interface IContacts {
	formContacts: HTMLFormElement;
	buttonSubmit: HTMLButtonElement;
	formErrors: HTMLElement;
	inputAll: HTMLInputElement[];

	render(): HTMLElement;
}

export class Contacts implements IContacts {
	formContacts: HTMLFormElement;
	buttonSubmit: HTMLButtonElement;
	formErrors: HTMLElement;
	inputAll: HTMLInputElement[];

	constructor(template: HTMLTemplateElement, protected events: IEvents) {
		this.formContacts = template.content
			.querySelector('.form')
			.cloneNode(true) as HTMLFormElement;
		this.buttonSubmit = this.formContacts.querySelector('.button');
		this.inputAll = Array.from(
			this.formContacts.querySelectorAll('.form__input')
		);

		this.formErrors = this.formContacts.querySelector('.form__errors');

		this.inputAll.forEach((item) => {
			item.addEventListener('input', (event) => {
				const target = event.target as HTMLInputElement;
				const field = target.name;
				const value = target.value;
				this.events.emit(`contacts:changeInput`, { field, value });
			});
		});

		this.formContacts.addEventListener('submit', (event: Event) => {
			event.preventDefault();
			this.events.emit('success:open');
		});
	}

	set valid(value: boolean) {
		this.buttonSubmit.disabled = !value;
	}

	render() {
		return this.formContacts;
	}
}

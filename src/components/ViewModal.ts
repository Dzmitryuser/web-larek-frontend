import { IEvents } from './base/events';

export interface IModal {
	open(): void;
	close(): void;
	render(): HTMLElement;
}

export class Modal implements IModal {
	protected modalContainer: HTMLElement;
	protected _content: HTMLElement;
	protected _pageWrapper: HTMLElement;
	protected closeButton: HTMLButtonElement;

	constructor(modalContainer: HTMLElement, protected events: IEvents) {
		this.modalContainer = modalContainer;
		this._content = modalContainer.querySelector('.modal__content');
		this._pageWrapper = document.querySelector('.page__wrapper');
		this.closeButton = modalContainer.querySelector('.modal__close');

		this.closeButton.addEventListener('click', this.close.bind(this));
		this.modalContainer.addEventListener('click', this.close.bind(this));
		this.modalContainer
			.querySelector('.modal__container')
			.addEventListener('click', (event) => event.stopPropagation());
	}

	// получаем место отображения модалки
	set content(value: HTMLElement) {
		this._content.replaceChildren(value);
	}

	set locked(value: boolean) {
		if (value) {
			this._pageWrapper.classList.add('page__wrapper_locked');
		} else {
			this._pageWrapper.classList.remove('page__wrapper_locked');
		}
	}

	// открываем модалку
	open() {
		this.modalContainer.classList.add('modal_active');
		this.events.emit('modal:open');
	}

	// закрываем модалку
	close() {
		this.modalContainer.classList.remove('modal_active');
		this.content = null;
		this.events.emit('modal:close');
	}

	render(): HTMLElement {
		this._content;
		this.open();
		return this.modalContainer;
	}
}

import { ensureElement } from '../utils/utils';
import { IEvents } from './base/events';

export class MainPage {
	protected container: HTMLElement;
	protected gallery: HTMLElement;
	headerCartButton: HTMLButtonElement;
	headerCartCounter: HTMLElement;

	constructor(containerSelector = '.page', protected events: IEvents) {
		this.container = document.querySelector(containerSelector);
		this.gallery = ensureElement<HTMLElement>('.gallery', this.container);
		this.headerCartButton = document.querySelector('.header__basket');
		this.headerCartCounter = document.querySelector('.header__basket-counter');
		this.headerCartButton.addEventListener('click', () => {
		this.events.emit('basket:open');
		});
	}

	renderHeaderCartCounter(value: number) {
		this.headerCartCounter.textContent = `${value}`;
	}

	renderCards(cards: HTMLElement[]): void {
		this.gallery.replaceChildren(...cards);
	}
}

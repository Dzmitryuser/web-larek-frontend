import { createElement } from '../utils/utils';
import { IEvents } from './base/events';

export interface ICart {
	cart: HTMLElement;
	cartList: HTMLElement;
	button: HTMLButtonElement;
	cartPrice: HTMLElement;
	title: HTMLElement;
	renderTotalAllGoods(total: number): void;
	render(): HTMLElement;
}

export class Cart implements ICart {
	cart: HTMLElement;
	cartList: HTMLElement;
	button: HTMLButtonElement;
	cartPrice: HTMLElement;
	title: HTMLElement;
	private _items: HTMLElement[] = [];

	constructor(template: HTMLTemplateElement, protected events: IEvents) {
		this.cart = template.content
			.querySelector('.basket')
			.cloneNode(true) as HTMLElement;
		this.cartList = this.cart.querySelector('.basket__list');
		this.button = this.cart.querySelector('.basket__button');
		this.cartPrice = this.cart.querySelector('.basket__price');
		this.title = this.cart.querySelector('.modal__title');

		this.button.addEventListener('click', () => {
			events.emit('order:open');
		});
	}

	set items(items: HTMLElement[]) {
		this._items = items;

		if (items.length) {
			this.cartList.replaceChildren(...items);
			this.button.removeAttribute('disabled');
		} else {
			this.button.setAttribute('disabled', 'disabled');
			this.cartList.replaceChildren(
				createElement<HTMLParagraphElement>('p', {
					textContent: 'Корзина пуста',
					className: 'basket__empty-message',
				})
			);
		}
	}

	get items(): HTMLElement[] {
		return this._items;
	}

	renderTotalAllGoods(total: number) {
		this.cartPrice.textContent = `${total} синапсов`;
	}

	render() {
		this.title.textContent = 'Корзина';
		return this.cart;
	}
}

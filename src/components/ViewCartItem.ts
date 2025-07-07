import { IActions, IGoodsItem } from '../types';
import { IEvents } from './base/events';

export interface ICartItem {
	basketItem: HTMLElement;
	title: HTMLElement;
	price: HTMLElement;
	index: HTMLElement;
	buttonDelete: HTMLButtonElement;
	render(data: IGoodsItem, item: number): HTMLElement;
}

export class CartItem implements ICartItem {
	basketItem: HTMLElement;
	title: HTMLElement;
	price: HTMLElement;
	index: HTMLElement;
	buttonDelete: HTMLButtonElement;

	constructor(
		template: HTMLTemplateElement,
		protected events: IEvents,
		actions?: IActions
	) {
		this.basketItem = template.content
			.querySelector('.basket__item')
			.cloneNode(true) as HTMLElement;
		this.index = this.basketItem.querySelector('.basket__item-index');
		this.title = this.basketItem.querySelector('.card__title');
		this.price = this.basketItem.querySelector('.card__price');
		this.buttonDelete = this.basketItem.querySelector('.basket__item-delete');

		if (actions?.onClick) {
			this.buttonDelete.addEventListener('click', actions.onClick);
		}
	}

	protected setPrice(value: number | null) {
		if (value === null) {
			return 'Бесценно';
		}
		return `${value} синапсов`;
	}

	render(data: IGoodsItem, item: number) {
		this.index.textContent = String(item);
		this.title.textContent = data.title;
		this.price.textContent = this.setPrice(data.price);
		return this.basketItem;
	}
}

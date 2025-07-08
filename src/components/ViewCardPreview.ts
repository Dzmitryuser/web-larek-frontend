import { Card } from './ViewCard';
import { IActions, IGoodsItem } from '../types';
import { IEvents } from './base/events';

export interface ICard {
	button: HTMLElement;
	text: HTMLElement;
	render(itemData: IGoodsItem): HTMLElement;
}

export class CardPreview extends Card implements ICard {
	button: HTMLElement;
	text: HTMLElement;

	constructor(
		template: HTMLTemplateElement,
		protected events: IEvents,
		actions?: IActions
	) {
		super(template, events, actions);
		this.button = this._cardElement.querySelector('.card__button');
		this.text = this._cardElement.querySelector('.card__text');
		this.button.addEventListener('click', () => {
			this.events.emit('card:addBasket');
		});
	}

	notFOrSale(data: IGoodsItem) {
		if (data.price) {
			return 'Купить';
		} else {
			this.button.setAttribute('disabled', 'true');
			return 'Не продается';
		}
	}

	render(itemData: IGoodsItem): HTMLElement {
		this._cardCategory.textContent = itemData.category;
		this._cardTitle.textContent = itemData.title;
		this._cardImage.src = itemData.image;
		this._cardImage.alt = this._cardTitle.textContent;
		this.cardCategory = itemData.category;
		this._cardPrice.textContent = this.setPrice(itemData.price);
		this.text.textContent = itemData.description;
		this.button.textContent = this.notFOrSale(itemData);
		return this._cardElement;
	}
}

import { IGoodsItem } from '../types';
import { IEvents } from './base/events';

export interface IDataModel {
	selectedCard: IGoodsItem;
	productCards: IGoodsItem[];
	setPreview(item: IGoodsItem): void;
}

export class DataModel implements IDataModel {
	selectedCard: IGoodsItem;
	protected _productCards: IGoodsItem[];

	constructor(protected events: IEvents) {
		this._productCards = [];
	}

	get productCards() {
		return this._productCards;
	}

	set productCards(data: IGoodsItem[]) {
		this._productCards = data;
		this.events.emit('productCards:receive');
	}

	setPreview(item: IGoodsItem) {
		this.selectedCard = item;
		this.events.emit('modalCard:open', item);
	}
}

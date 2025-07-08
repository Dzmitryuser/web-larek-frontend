import { IGoodsItem } from '../types';

export interface ICartModel {
	cartGoods: IGoodsItem[];
    getTotalAllGoods: () => number;
	getCounter: () => number;
	setSelectedItem(data: IGoodsItem): void;
	deleteItemFromCart(goodsItem: IGoodsItem): void;
	clearCartItems(): void;
}

export class CartModel implements ICartModel {
	protected _cartGoods: IGoodsItem[];

	constructor() {
		this._cartGoods = [];
	}

	set cartGoods(data: IGoodsItem[]) {
		this._cartGoods = data;
	}

	get cartGoods() {
		return this._cartGoods;
	}

	// общая стоимость товаров в корзине
	getTotalAllGoods() {
		let sumAll = 0;
		this.cartGoods.forEach((item) => {
			sumAll = sumAll + item.price;
		});
		return sumAll;
	}

	// общее количество товаров в корзине
	getCounter() {
		return this.cartGoods.length;
	}

	// добавляем товар в корзину
	setSelectedItem(data: IGoodsItem) {
		this._cartGoods.push(data);
	}

	// удаляем товар из корзины
	deleteItemFromCart(goodsItem: IGoodsItem) {
		const index = this._cartGoods.indexOf(goodsItem);
		if (index >= 0) {
			this._cartGoods.splice(index, 1);
		}
	}

	// сбрасываем корзину
	clearCartItems() {
		this.cartGoods.length = 0;
	}
}

import { IGoodsItem } from '../types';

export interface ICartModel {
	basketProducts: IGoodsItem[];
    getSumAllProducts: () => number;
	getCounter: () => number;
	setSelectedCard(data: IGoodsItem): void;
	deleteCardToBasket(item: IGoodsItem): void;
	clearBasketProducts(): void;
}

export class CartModel implements ICartModel {
	protected _basketProducts: IGoodsItem[];

	constructor() {
		this._basketProducts = [];
	}

	set basketProducts(data: IGoodsItem[]) {
		this._basketProducts = data;
	}

	get basketProducts() {
		return this._basketProducts;
	}

	// стоимость товаров в корзине
	getSumAllProducts() {
		let sumAll = 0;
		this.basketProducts.forEach((item) => {
			sumAll = sumAll + item.price;
		});
		return sumAll;
	}

	// сумма товаров в корзине
	getCounter() {
		return this.basketProducts.length;
	}

	// добавляем товар в корзину
	setSelectedCard(data: IGoodsItem) {
		this._basketProducts.push(data);
	}

	// удаляем товар из корзины
	deleteCardToBasket(item: IGoodsItem) {
		const index = this._basketProducts.indexOf(item);
		if (index >= 0) {
			this._basketProducts.splice(index, 1);
		}
	}

	// Очищаем корзину
	clearBasketProducts() {
		this.basketProducts = [];
	}
}

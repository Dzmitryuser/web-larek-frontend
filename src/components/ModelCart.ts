import { IGoodsItem } from "../types";

export interface ICartModel {
  basketProducts: IGoodsItem[];
  getCounter: () => number;
  getSumAllProducts: () => number;
  setSelectedСard(data: IGoodsItem): void;
  deleteCardToBasket(item: IGoodsItem): void;
  clearBasketProducts(): void
}

export class CartModel implements ICartModel {
  protected _basketProducts: IGoodsItem[]; // список карточек товара в корзине

  constructor() {
    this._basketProducts = [];
  }

  set basketProducts(data: IGoodsItem[]) {
    this._basketProducts = data;
  }

  get basketProducts() {
    return this._basketProducts;
  }

  // количество товара в корзине
  getCounter() {
    return this.basketProducts.length;
  }

  // сумма всех товаров в корзине
  getSumAllProducts() {
    let sumAll = 0;
    this.basketProducts.forEach(item => {
      sumAll = sumAll + item.price;
    });
    return sumAll;
  }

  // добавить карточку товара в корзину
  setSelectedСard(data: IGoodsItem) {
    this._basketProducts.push(data);
  }

  // удалить карточку товара из корзины
  deleteCardToBasket(item: IGoodsItem) {
    const index = this._basketProducts.indexOf(item);
    if (index >= 0) {
      this._basketProducts.splice(index, 1);
    }
  }

  clearBasketProducts() {
    this.basketProducts = []
  }
}
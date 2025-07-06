import { IGoodsItem } from "../types";
import { IEvents } from "./base/events";

export interface IDataModel {
  productCards: IGoodsItem[];
  selectedСard: IGoodsItem;
  setPreview(item: IGoodsItem): void;
}

export class DataModel implements IDataModel {
  protected _productCards: IGoodsItem[];
  selectedСard: IGoodsItem;

  constructor(protected events: IEvents) {
    this._productCards = []
  }

  set productCards(data: IGoodsItem[]) {
    this._productCards = data;
    this.events.emit('productCards:receive');
  }

  get productCards() {
    return this._productCards;
  }

  setPreview(item: IGoodsItem) {
    this.selectedСard = item;
    this.events.emit('modalCard:open', item)
  }
}
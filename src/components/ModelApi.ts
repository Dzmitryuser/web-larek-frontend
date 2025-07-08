import { ApiListResponse, Api } from './base/api';
import { IOrderedLot, IOrderResult, IGoodsItem } from '../types';

export interface IApiModel {
	cdn: string;
	items: IGoodsItem[];
	postOrderedItem: (orderedLot: IOrderedLot) => Promise<IOrderResult>;
	getListItemsCard: () => Promise<IGoodsItem[]>;

}

export class ApiModel extends Api {
	cdn: string;
	items: IGoodsItem[];

	constructor(cdn: string, baseUrl: string, options?: RequestInit) {
		super(baseUrl, options);
		this.cdn = cdn;
	}

	// получаем информацию о заказе
	postOrderedItem(orderedLot: IOrderedLot): Promise<IOrderResult> {
		return this.post(`/order`, orderedLot).then((data: IOrderResult) => data);
	}

	// получаем данные карточек от сервера
	getListItemsCard(): Promise<IGoodsItem[]> {
		return this.get('/product').then((data: ApiListResponse<IGoodsItem>) =>
			data.items.map((item) => ({
				...item,
				image: this.cdn + item.image,
			}))
		);
	}
}

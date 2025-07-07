import { ApiListResponse, Api } from './base/api';
import { IOrderedLot, IOrderResult, IGoodsItem } from '../types';

export interface IApiModel {
	cdn: string;
	items: IGoodsItem[];
	postOrderLot: (orderedLot: IOrderedLot) => Promise<IOrderResult>;
	getListProductCard: () => Promise<IGoodsItem[]>;

}

export class ApiModel extends Api {
	cdn: string;
	items: IGoodsItem[];

	constructor(cdn: string, baseUrl: string, options?: RequestInit) {
		super(baseUrl, options);
		this.cdn = cdn;
	}

	// получаем информацию по заказу
	postOrderLot(orderedLot: IOrderedLot): Promise<IOrderResult> {
		return this.post(`/order`, orderedLot).then((data: IOrderResult) => data);
	}

	// получаем данные карточек от сервера
	getListProductCard(): Promise<IGoodsItem[]> {
		return this.get('/product').then((data: ApiListResponse<IGoodsItem>) =>
			data.items.map((item) => ({
				...item,
				image: this.cdn + item.image,
			}))
		);
	}
}

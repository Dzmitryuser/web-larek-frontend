import { Api } from './base/api';
import { IOrderedLot, IOrderResult, IGoodsItem } from '../types';

export interface IApiModel {
	cdn: string;
	items: IGoodsItem[];
	postOrder(order: IOrderedLot): Promise<IOrderResult>;
	fetchItems(): Promise<IGoodsItem[]>;
}

export class ApiModel extends Api implements IApiModel {
	readonly cdn: string;
	items: IGoodsItem[] = [];

	constructor(cdn: string, baseUrl: string, options?: RequestInit) {
		super(baseUrl, options);
		this.cdn = cdn;
	}

	async postOrder(order: IOrderedLot): Promise<IOrderResult> {
		const response = (await this.post('/order', order)) as IOrderResult;

		if (typeof response.id !== 'string' || typeof response.total !== 'number') {
			throw new Error('Неверный формат ответа');
		}

		return {
			id: response.id,
			total: response.total,
		};
	}

	async fetchItems(): Promise<IGoodsItem[]> {
		type ItemsResponse = { items: IGoodsItem[] };
		const response = (await this.get('/product')) as ItemsResponse;

		if (!Array.isArray(response?.items)) {
			throw new Error('Неверный формат ответа');
		}

		this.items = response.items.map((item) => ({
			...item,
			image: item.image ? this.cdn + item.image : '',
		}));

		return this.items;
	}
}

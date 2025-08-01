export interface IGoodsItem {
	id: string;
	description: string;
	title: string;
	category: string;
	price: number | null;
	image: string;
	quantity?: number;
}

export interface IActions {
	onClick: (event: MouseEvent) => void;
}

export interface IOrderForm {
	payment?: string;
	email?: string;
	address?: string;
	phone?: string;
}

export type ModalContent = HTMLElement | string;

export interface IOrder extends IOrderForm {
	items: string[];
	total: number;
	payment: string;
}

export interface IOrderedLot {
	payment: string;
	email: string;
	address: string;
	total: number;
	items: string[];
	phone: string;
}

export interface IOrderResult {
	id: string;
	total: number;
}

export type FormErrors = Partial<Record<keyof IOrder, string>> & {
	email?: string;
	phone?: string;
};

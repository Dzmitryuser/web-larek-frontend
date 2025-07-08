import { IEvents } from './base/events';
import { FormErrors } from '../types/index';

export interface IFormModel {
	payment: string;
	phone: string;
	address: string;
	total: number;
	items: string[];
	email: string;

	setOrderAddress(field: string, value: string): void;
	setOrderData(field: string, value: string): void;
	validateOrder(): boolean;
	validateContacts(): boolean;
	getOrderedItem(): object;
}

export class FormModel implements IFormModel {
	payment: string;
	phone: string;
	address: string;
	total: number;
	items: string[];
	email: string;
	formErrors: FormErrors = {};

	constructor(protected events: IEvents) {
		this.payment = '';
		this.phone = '';
		this.address = '';
		this.total = 0;
		this.email = '';
		this.items = [];
	}

	// присваиваем значение полю address
	setOrderAddress(adressField: string, value: string) {
		if (adressField === 'address') {
			this.address = value;
		}

		if (this.validateOrder()) {
			this.events.emit('order:ready', this.getOrderedItem());
		}
	}

	// присваиваем значения email и phone
	setOrderData(contactField: string, value: string) {
		if (contactField === 'email') {
			this.email = value;
		} else if (contactField === 'phone') {
			this.phone = value;
		}

		if (this.validateContacts()) {
			this.events.emit('order:ready', this.getOrderedItem());
		}
	}

	// валидируем адрес
	validateOrder() {
		const errors: typeof this.formErrors = {};
		const adressRegexp = /^[а-яА-ЯёЁa-zA-Z0-9\s\/.,-]{7,}$/;

		if (!this.address) {
			errors.address = 'Необходимо указать адрес';
		} else if (!adressRegexp.test(this.address)) {
			errors.address = 'Укажите настоящий адрес';
		} else if (!this.payment) {
			errors.payment = 'Выберите способ оплаты';
		}

		this.formErrors = errors;
		this.events.emit('formErrors:address', this.formErrors);
		return Object.keys(errors).length === 0;
	}

	// валидируем email и телефон
	validateContacts() {
		const errors: typeof this.formErrors = {};
		const emailRegexp = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
		const phoneRegexp = /^((8|\+7)[\- ]?)?(\(?\d{3}\)?[\- ]?)?[\d\- ]{10}$/;

		if (!this.email) {
			errors.email = 'Необходимо указать email';
		} else if (!emailRegexp.test(this.email)) {
			errors.email = 'Некорректный адрес электронной почты';
		}

		if (this.phone.startsWith('8')) {
			this.phone = '+7' + this.phone.slice(1);
		}

		if (!this.phone) {
			errors.phone = 'Необходимо указать телефон';
		} else if (!phoneRegexp.test(this.phone)) {
			errors.phone = 'Некорректный формат номера телефона';
		}

		this.formErrors = errors;
		this.events.emit('formErrors:change', this.formErrors);
		return Object.keys(errors).length === 0;
	}

	getOrderedItem() {
		return {
			payment: this.payment,
			phone: this.phone,
			address: this.address,
			total: this.total,
			email: this.email,
			items: this.items,
		};
	}
}

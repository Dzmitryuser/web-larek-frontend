import './scss/styles.scss';

import { CDN_URL, API_URL } from './utils/constants';
import { EventEmitter } from './components/base/events';
import { ApiModel } from './components/ModelApi';
import { DataModel } from './components/ModelData';
import { Card } from './components/ViewCard';
import { CardPreview } from './components/ViewCardPreview';
import { IOrderForm, IGoodsItem } from './types';
import { Modal } from './components/ViewModal';
import { ensureElement } from './utils/utils';
import { CartModel } from './components/ModelCart';
import { Cart } from './components/ViewCart';
import { CartItem } from './components/ViewCartItem';
import { FormModel } from './components/ModelForm';
import { Order } from './components/ViewFormOrder';
import { Contacts } from './components/ViewFormContacts';
import { Success } from './components/ViewSuccess';

const cardCatalogTemplate = document.querySelector(
	'#card-catalog'
) as HTMLTemplateElement;
const cardPreviewTemplate = document.querySelector(
	'#card-preview'
) as HTMLTemplateElement;
const basketTemplate = document.querySelector('#basket') as HTMLTemplateElement;
const cardBasketTemplate = document.querySelector(
	'#card-basket'
) as HTMLTemplateElement;
const orderTemplate = document.querySelector('#order') as HTMLTemplateElement;
const contactsTemplate = document.querySelector(
	'#contacts'
) as HTMLTemplateElement;
const successTemplate = document.querySelector(
	'#success'
) as HTMLTemplateElement;

const apiModel = new ApiModel(CDN_URL, API_URL);
const events = new EventEmitter();
const dataModel = new DataModel(events);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);
const basket = new Cart(basketTemplate, events);
const basketModel = new CartModel();
const formModel = new FormModel(events);
const order = new Order(orderTemplate, events);
const contacts = new Contacts(contactsTemplate, events);

// выводим карточки товара
events.on('productCards:receive', () => {
	dataModel.productCards.forEach((item) => {
		const card = new Card(cardCatalogTemplate, events, {
			onClick: () => events.emit('card:select', item),
		});
		ensureElement<HTMLElement>('.gallery').append(card.render(item));
	});
});

// Получаем данные кликнутой карточки
events.on('card:select', (item: IGoodsItem) => {
	dataModel.setPreview(item);
});

// открытие модалки карточки товара
events.on('modalCard:open', (item: IGoodsItem) => {
	const cardPreview = new CardPreview(cardPreviewTemplate, events);
	modal.content = cardPreview.render(item);
	modal.render();
});

// добавляем товар в корзину
events.on('card:addBasket', () => {
	basketModel.setSelectedCard(dataModel.selectedCard);
	basket.renderHeaderBasketCounter(basketModel.getCounter());
	modal.close();
});

// открываем модалку корзины
events.on('basket:open', () => {
	basket.renderSumAllProducts(basketModel.getSumAllProducts());
	let i = 0;
	basket.items = basketModel.basketProducts.map((item) => {
		const basketItem = new CartItem(cardBasketTemplate, events, {
			onClick: () => events.emit('basket:basketItemRemove', item),
		});
		i = i + 1;
		return basketItem.render(item, i);
	});
	modal.content = basket.render();
	modal.render();
});

// удаление товара из корзины
events.on('basket:basketItemRemove', (item: IGoodsItem) => {
	basketModel.deleteCardToBasket(item);
	basket.renderHeaderBasketCounter(basketModel.getCounter());
	basket.renderSumAllProducts(basketModel.getSumAllProducts());
	let i = 0;
	basket.items = basketModel.basketProducts.map((item) => {
		const basketItem = new CartItem(cardBasketTemplate, events, {
			onClick: () => events.emit('basket:basketItemRemove', item),
		});
		i = i + 1;
		return basketItem.render(item, i);
	});
});

// открываем модалку заполнения данных
events.on('order:open', () => {
	modal.content = order.render();
	modal.render();
	formModel.items = basketModel.basketProducts.map((item) => item.id);
});
// передаём способ оплаты
events.on('order:paymentSelection', (button: HTMLButtonElement) => {
	formModel.payment = button.name;
});

// отслеживаем изменения адреса доставки
events.on(`order:changeAddress`, (data: { field: string; value: string }) => {
	formModel.setOrderAddress(data.field, data.value);
});

// валидируем данные адреса и способа оплаты
events.on('formErrors:address', (errors: Partial<IOrderForm>) => {
	const { address, payment } = errors;
	order.valid = !address && !payment;
	order.formErrors.textContent = Object.values({ address, payment })
		.filter((i) => !!i)
		.join('; ');
});

// открываем модалку контактных данных
events.on('contacts:open', () => {
	formModel.total = basketModel.getSumAllProducts();
	modal.content = contacts.render();
	modal.render();
});

// отслеживаем изменения контактных данных
events.on(`contacts:changeInput`, (data: { field: string; value: string }) => {
	formModel.setOrderData(data.field, data.value);
});

// валидируем контактные данные
events.on('formErrors:change', (errors: Partial<IOrderForm>) => {
	const { email, phone } = errors;
	contacts.valid = !email && !phone;
	contacts.formErrors.textContent = Object.values({ phone, email })
		.filter((i) => !!i)
		.join('; ');
});

// открываем модалку успешного оформления заказа
events.on('success:open', () => {
	apiModel
		.postOrderLot(formModel.getOrderLot())
		.then((data) => {
			console.log(data);
			const success = new Success(successTemplate, events);
			modal.content = success.render(basketModel.getSumAllProducts());
			basketModel.clearBasketProducts();
			basket.renderHeaderBasketCounter(basketModel.getCounter());
			modal.render();
		})
		.catch((error) => console.log(error));
});

events.on('success:close', () => modal.close());

// блокировка страницы при открытой модалке
events.on('modal:open', () => {
	modal.locked = true;
});

// разблокировка страницы после закрытия модалки
events.on('modal:close', () => {
	modal.locked = false;
});

// получаем данные карточек от сервера
apiModel
	.getListProductCard()
	.then(function (data: IGoodsItem[]) {
		dataModel.productCards = data;
	})
	.catch((error) => console.log(error));

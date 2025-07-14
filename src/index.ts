import './scss/styles.scss';

import { CDN_URL, API_URL } from './utils/constants';
import { EventEmitter } from './components/base/events';
import { ApiModel } from './components/ModelApi';
import { CartItem } from './components/ViewCartItem';
import { FormModel } from './components/ModelForm';
import { Order } from './components/ViewFormOrder';
import { IOrderForm, IGoodsItem } from './types';
import { Modal } from './components/ViewModal';
import { ensureElement } from './utils/utils';
import { DataModel } from './components/ModelData';
import { Card } from './components/ViewCard';
import { CardPreview } from './components/ViewCardPreview';
import { CartModel } from './components/ModelCart';
import { Cart } from './components/ViewCart';
import { Contacts } from './components/ViewFormContacts';
import { Success } from './components/ViewSuccess';
import { MainPage } from './components/ViewMainPage';


// объявляем переменные темплейт-элементов
const cardCatalogTemplate = document.querySelector(
	'#card-catalog'
) as HTMLTemplateElement;
const cardPreviewTemplate = document.querySelector(
	'#card-preview'
) as HTMLTemplateElement;
const cartTemplate = document.querySelector('#basket') as HTMLTemplateElement;
const cardCartTemplate = document.querySelector(
	'#card-basket'
) as HTMLTemplateElement;
const orderTemplate = document.querySelector('#order') as HTMLTemplateElement;
const contactsTemplate = document.querySelector(
	'#contacts'
) as HTMLTemplateElement;
const successTemplate = document.querySelector(
	'#success'
) as HTMLTemplateElement;

// создаем необходимые для работы экземпляры классов
const apiModel = new ApiModel(CDN_URL, API_URL);
const events = new EventEmitter();
const dataModel = new DataModel(events);
const cart = new Cart(cartTemplate, events);
const cartModel = new CartModel();
const formModel = new FormModel(events);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);
const order = new Order(orderTemplate, events);
const contacts = new Contacts(contactsTemplate, events);
const mainPage = new MainPage('.page', events);


// Обработчик события получения карточек товаров
events.on('productCards:receive', () => {
  const cards = dataModel.itemCards.map(item => {
    const card = new Card(cardCatalogTemplate, events, {
      onClick: () => events.emit('card:select', item)
    });
    return card.render(item);
  });

  mainPage.renderCards(cards);
});

// Получаем данные кликнутой карточки
events.on('card:select', (item: IGoodsItem) => {
	dataModel.setPreview(item);
});

// открываем модалку карточки товара
events.on('modalCard:open', (item: IGoodsItem) => {
	const cardPreview = new CardPreview(cardPreviewTemplate, events);
	modal.content = cardPreview.render(item);
	modal.render();
});

// добавляем товар в корзину
events.on('card:addBasket', () => {
	cartModel.addItem(dataModel.selectedCard);
	mainPage.renderHeaderCartCounter(cartModel.getItemsCount());
	modal.close();
});

// удаляем товар из корзины
events.on('basket:basketItemRemove', (item: IGoodsItem) => {
	cartModel.removeItem(item);
	mainPage.renderHeaderCartCounter(cartModel.getItemsCount());
	cart.renderTotalAllGoods(cartModel.getTotalPrice());
	let i = 0;
	cart.items = cartModel.items.map((item) => {
		const cartItem = new CartItem(cardCartTemplate, events, {
			onClick: () => events.emit('basket:basketItemRemove', item),
		});
		i = i + 1;
		return cartItem.render(item, i);
	});
});

// открываем модалку корзины
events.on('basket:open', () => {
	cart.renderTotalAllGoods(cartModel.getTotalPrice());
	let i = 0;
	cart.items = cartModel.items.map((item) => {
		const cartItem = new CartItem(cardCartTemplate, events, {
			onClick: () => events.emit('basket:basketItemRemove', item),
		});
		i = i + 1;
		return cartItem.render(item, i);
	});
	modal.content = cart.render();
	modal.render();
});


// открываем модалку заполнения данных
events.on('order:open', () => {
	modal.content = order.render();
	modal.render();
	formModel.items = cartModel.items.map((item) => item.id);
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
	formModel.total = cartModel.getTotalPrice();
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
		.postOrder(formModel.getOrderedItem())
		.then((data) => {
			console.log(data);
			const success = new Success(successTemplate, events);
			modal.content = success.render(cartModel.getTotalPrice());
			cartModel.clear();
			mainPage.renderHeaderCartCounter(cartModel.getItemsCount());
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
	.fetchItems()
	.then(function (data: IGoodsItem[]) {
		dataModel.itemCards = data;
	})
	.catch((error) => console.log(error));

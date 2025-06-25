# Проектная работа "Веб-ларек"

## Описание архитектуры

Проект реализован по принципу MVP (Model-View-Presenter), обеспечивающему четкое разделение ответственностей:

### Model
- Работа с загрузкой данных через API
- Сохранение и обработка данных от пользователя
- Бизнес-логика приложения

### View
- Отображение пользовательского интерфейса
- Перехват и обработка событий взаимодействия
- Визуальное представление данных

### EventEmitter (Presenter)
- Координация взаимодействия между Model и View
- Управление потоком событий
- Реализация паттерна "Наблюдатель"

## Используемые технологии

- Языки: HTML, TypeScript
- Стили: SCSS
- Сборка: Webpack

Структура проекта:

src/ — исходные файлы проекта
src/components/ — папка с JS компонентами
src/components/base/ — папка с базовым кодом
Важные файлы:

src/pages/index.html — HTML-файл главной страницы
src/types/index.ts — файл с типами
src/index.ts — точка входа приложения
src/scss/styles.scss — корневой файл стилей
src/utils/constants.ts — файл с константами
src/utils/utils.ts — файл с утилитами

# Описание данных

## Модели данных

Приложение использует следующие интерфейсы для структурирования данных:

### `IGoodsItem` - модель товара
```typescript
interface IGoodsItem {
  id: string;           // Уникальный идентификатор товара
  description: string;  // Подробное описание товара
  title: string;       // Название товара
  category: string;    // Категория товара
  price: number | null;// Цена (null если не установлена)
  image: string;       // URL изображения товара
  quantity?: number;   // Опциональное количество товара
}
```
**Использование**: Хранение и отображение данных о товарах в каталоге.

### `IActions` - обработчики действий
```typescript
interface IActions {
  onClick: (event: MouseEvent) => void;
}
```
**Использование**: Унификация обработки событий в UI-компонентах.

### `IOrderForm` - данные формы заказа
```typescript
interface IOrderForm {
  payment?: string;      // Способ оплаты
  email?: string;        // Email покупателя
  address?: string;      // Адрес доставки
  phone?: string;        // Контактный телефон
}
```
**Использование**: Валидация и обработка данных формы.

### `IOrder` - полные данные заказа
```typescript
interface IOrder extends IOrderForm {
  items: string[];      // ID товаров в заказе
  total: number;        // Общая сумма
  payment: string;      // Способ оплаты
}
```
**Использование**: Передача данных о заказе на сервер.

### `IOrderedLot` - оформленный заказ
```typescript
interface IOrderedLot {
  payment: string;  // Способ оплаты
  email: string;    // Email
  address: string;  // Адрес
  total: number;    // Сумма
  items: string[];  // ID товаров
  phone: string;    // Телефон
}
```
**Использование**: Гарантия заполнения всех обязательных полей заказа.

### `IOrderResult` - результат оформления
```typescript
interface IOrderResult {
  id: string;     // ID заказа
  total: number;  // Сумма заказа
}
```
**Использование**: Отображение информации о созданном заказе.

### `FormErrors` - ошибки формы
```typescript
type FormErrors = Partial<Record<keyof IOrder, string>>;
```
**Использование**: Валидация и отображение ошибок формы.

## Структура хранения данных

|       Данные         |      Модель      |        Место хранения        |
|----------------------|------------------|------------------------------|
| Каталог товаров      | `IGoodsItem[]`   | Локальное состояние/сервер   |
| Корзина              | `string[]`       | Состояние приложения         |
| Данные формы         | `IOrderForm`     | Состояние формы              |
| Оформленные заказы   | `IOrderedLot[]`  | Серверная БД                 |
| Результаты заказов   | `IOrderResult`   | Состояние приложения         |
| Ошибки формы         | `FormErrors`     | Состояние формы              |
| Содержимое модалок   | `ModalContent`   | Состояние модальных окон     |

## Описание базовых классов
## 🛠 Класс API

Базовый класс для работы с сервером через HTTP-запросы. 
Реализует основные методы взаимодействия с API.

### 📌 Методы

#### `handleResponse(response: Response): Promise<object>`
**Назначение**:  
Обработка и парсинг ответа сервера  
**Возвращает**:  
Promise с распарсенными данными в формате объекта

#### `get(url: string)`
**Назначение**:  
Выполнение GET-запроса  
**Параметры**:  
- `url` - endpoint API (относительный путь)  
**Возвращает**:  
Ответ сервера с данными

#### `post(url: string, data: object, method: ApiPostMethods = 'POST')`
**Назначение**:  
Отправка данных на сервер  
**Параметры**:  
- `url` - endpoint API  
- `data` - объект с данными для отправки  
- `method` - HTTP-метод (по умолчанию 'POST')  
**Типы**:  
  type ApiPostMethods = 'POST' | 'PUT' | 'DELETE'

```typescript
## 🎛 Класс EventEmitter

Реализует паттерн **Observer/Наблюдатель** для управления событиями 
в приложении.

### 📝 Обязанности:
- Подписка/отписка на события
- Уведомление подписчиков
- Управление всеми событиями системы

### 🔧 Методы

|   Метод   |              Параметры                |  Ответ |            Описание             |
|-----------|---------------------------------------|--------|---------------------------------|
| `on`      | `(event: string, callback: Function)` | `void` | Подписывает callback на  событие|
| `off`     | `(event: string, callback: Function)` | `void` | Отписывает callback от события  |
| `emit`    | `(event: string, ...args: any[])`     | `void` | Инициирует событие с аргументами|
| `onAll`   | `(callback: Function)`                | `void` | Подписывает callback на события |
| `offAll`  | `()`                                  | `void` | Снимает все подписки            |
| `trigger` | `(event: string, ...args: any[])`     | `void` | Алиас для `emit`                |

### 💡 Особенности реализации:
- Позволяет классам генерировать события без прямой зависимости от EventEmitter
- Реализует механизм "публикация-подписка"
- Поддерживает массовую подписку/отписку


## Описание классов Model, для хранения и обработки данных с сервера и от пользователей.

### 📦 Класс ApiModel (наследуется от Api)
Работает с API сервера для получения и отправки данных

**Методы:**
- `getListProductCards()`: Promise<ProductCards[]>  
  Получает массив карточек товаров с сервера
- `postOrderedLot()`: Promise<OrderResponse>  
  Отправляет данные заказа и получает ответ сервера

### 🛍️ Класс CartModel
Управляет корзиной покупок и товарами пользователя

**Методы:**
- `getItems(): IGoodsItem[]` 
  Возвращает количество товаров в корзине
- `getSumAllProducts()`: number  
  Вычисляет общую сумму товаров в корзине
- `setSelectedCard(card: ProductCard): void`  
  Добавляет товар в корзину
- `deleteCardToCart(cardId: string): void`  
  Удаляет конкретный товар из корзины
- `clearCartProducts(): void`  
  Полностью очищает корзину

### 📊 Класс DataModel
Хранит данные о продуктах

**Методы:**
- `setPreview(card: ProductCard): void`  
  Сохраняет данные просматриваемой карточки товара

### 📝 Класс FormModel
Работает с пользовательскими данными форм

**Методы:**
- `setDeliveryAddress(address: string): void`  
  Сохраняет адрес доставки
- `validateOrder(): boolean`  
  Проверяет валидность адреса и способа оплаты
- `setOrderData(contacts: Contacts): void`  
  Сохраняет контактные данные (телефон/email)
- `validateContacts(): boolean`  
  Проверяет валидность контактных данных
- `getOrderLot(): IOrder`  
  Возвращает полные данные заказа (товары + информация пользователя)


  ## Классы View для отображения элементов страницы с полученными данными, 
  осуществляют интеракшн с пользователем.


### 🏠 Класс MainPage
Управляет отображением главной страницы

**Методы:**
- `renderProductList(products: IGoodsItem[]): void`
  Рендерит список товаров на странице
- `setCounter(value: number): void`
  Обновляет счетчик товаров в корзине (в шапке)
- `bindEvents(): void`
  Навешивает обработчики событий


### 🛒 Класс Cart
Управляет отображением корзины покупок

**Методы:**
- `renderItems(items: IGoodsItem[]): void`
  Отображает список товаров в корзине
- `renderHeaderCartCounter(count: number): void`
  Обновляет счетчик товаров в шапке
- `renderSumAllProducts(sum: number): void`
  Отображает общую сумму заказа
- `clearCart(): void`
  Очищает отображение корзины


### 📦 Класс CartItem
Управляет отображением отдельных товаров в корзине

**Методы:**
- `setPrice(price: number): string`
  Форматирует цену для отображения
- `setTitle(title: string): void`
  Устанавливает название товара
- `setImage(url: string): void`
  Устанавливает изображение товара


### 🏷️ Класс Card
Управляет отображением карточек товаров

**Методы:**
- `setText(element: HTMLElement, text: string): void`  
  Устанавливает текстовое содержимое элемента
- `cardCategory(category: string): string`  
  Создает CSS-класс на основе категории товара
- `setPrice(price: number): string`  
  Форматирует цену для отображения

### 🔍 Класс CardPreview (наследуется от Card)
Управляет детальным просмотром товара

**Методы:**
- `isOnSale(product: Product): boolean`  
  Проверяет доступность товара для покупки (по наличию цены)


### 💳 Класс Order
Управляет формой заказа

**Методы:**
- `paymentHighLight(method: string): void`
  Визуально выделяет выбранный способ оплаты
- `setAddress(address: string): void`
  Устанавливает адрес доставки
- `showErrors(errors: FormErrors): void`
  Отображает ошибки валидации


### 📱 Класс Contacts
Управляет формой контактных данных

**Методы:**
- `setEmail(email: string): void`
  Устанавливает email
- `setPhone(phone: string): void`
  Устанавливает телефон
- `showErrors(errors: FormErrors): void`
  Отображает ошибки валидации


### 🪟 Класс Modal
Управляет модальными окнами

**Методы:**
- `open(content: HTMLElement): void`
  Открывает модальное окно с переданным контентом
- `close(): void`
  Закрывает модальное окно
- `setContent(content: HTMLElement): void`
  Устанавливает содержимое модального окна


### ✅ Класс Success
Управляет отображением успешного оформления заказа

**Методы:**
- `setOrderNumber(id: string): void`
  Устанавливает номер заказа
- `setTotal(total: number): void`
  Устанавливает сумму заказа
- `show(): void`
  Показывает окно успешного оформления
``` 

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```
## Сборка

```
npm run build
```

или

```
yarn build
```

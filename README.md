# Проектная работа "Веб-ларек"

## Сcылка на репозиторий
https://github.com/Dzmitryuser/web-larek-frontend.git

## Сcылка на GitHub Pages
https://dzmitryuser.github.io/web-larek-frontend/

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
type FormErrors = Partial<Record<keyof IOrder, string>> {
	email?: string;
	phone?: string;
};
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
- fetchItems(): Promise<IGoodsItem[]> 
  Получает массив карточек товаров с сервера
- postOrder(order: IOrderedLot): Promise<IOrderResult> 
  Отправляет данные заказа и получает ответ сервера

### 🛍️ Класс CartModel
Управляет корзиной покупок и товарами пользователя

**Методы:**
- getItemsCount(): number;
  Возвращает количество товаров в корзине
- getTotalPrice(): number; 
  Вычисляет общую сумму товаров в корзине
- addItem(item: IGoodsItem): void;  
  Добавляет товар в корзину
- removeItem(item: IGoodsItem): boolean; 
  Удаляет конкретный товар из корзины
- clear(): void;
  Полностью очищает корзину

### 📊 Класс DataModel
Хранит данные о продуктах

**Методы:**
- setPreview(goodsItem: IGoodsItem): void;
  Сохраняет данные просматриваемой карточки товара

### 📝 Класс FormModel
Работает с пользовательскими данными форм

**Методы:**
- setOrderAddress(field: string, value: string): void; 
  Сохраняет адрес доставки
- validateOrder(): boolean;
  Проверяет валидность адреса и способа оплаты
- setOrderData(field: string, value: string): void; 
  Сохраняет контактные данные (телефон/email)
- validateContacts(): boolean;
  Проверяет валидность контактных данных
- getOrderedItem(): object;
  Возвращает полные данные заказа (товары + информация пользователя)


## Классы View для отображения элементов страницы с полученными данными, 
осуществляют интеракшн с пользователем.

### 🏷️ Класс Card
Управляет отображением карточек товаров

**Методы:**
- setText(element: HTMLElement, value: unknown): string  
  Устанавливает текстовое содержимое элемента
- render(itemData: IGoodsItem): HTMLElement 
  Рендерит карточку
- setPrice(itemValue: number | null): string  
  Форматирует цену для отображения

### 🔍 Класс CardPreview (наследуется от Card)
Управляет детальным просмотром товара

**Методы:**
- notFOrSale(data: IGoodsItem): boolean  
  Проверяет доступность товара для покупки (по наличию цены)
- render(itemData: IGoodsItem): HTMLElement
  Рендерит карточку

### 🛒 Класс Cart
Управляет отображением корзины покупок

**Методы:**
- render()
  Отображает список товаров в корзине
- renderHeaderCartCounter(value: number)
  Обновляет счетчик товаров в шапке
- renderTotalAllGoods(total: number) 
  Отображает общую сумму заказа

### 📦 Класс CartItem
Управляет отображением отдельных товаров в корзине

**Методы:**
- setPrice(value: number | null)
  Форматирует цену для отображения
- render(data: IGoodsItem, item: number)
  Отображает карточку

### 📱 Класс Contacts
Управляет формой контактных данных

**Методы:**
- render()
  Наполняет рендерит форму с контактами

### 💳 Класс Order
Управляет формой заказа

**Методы:**
- render()
  Наполняет рендерит форму заказа

### 🪟 Класс Modal
Управляет модальными окнами

**Методы:**
- open(): void;
  Открывает модальное окно с переданным контентом
- close(): void;
  Закрывает модальное окно
- render(): HTMLElement;
  Рендерит содержимое модального окна

  ### ✅ Класс Success
Управляет отображением успешного оформления заказа

**Методы:**
- render(total: number): HTMLElement;
  Рендерит окно успешного оформления
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

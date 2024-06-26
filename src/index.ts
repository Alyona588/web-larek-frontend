import './scss/styles.scss';

import { API } from './components/API';
import { API_URL, CDN_URL } from './utils/constants';
import { EventEmitter } from './components/base/events';
import { AppState, ProductItem } from './components/AppData';
import { cloneTemplate, ensureElement, createElement } from './utils/utils';
import { Order } from './components/OrderForm';
import { GalleryChangeEvent, IOrderForms } from './types';
import { Page } from './components/Page';
import { Modal } from './components/common/Modal';
import { Basket } from './components/Basket';
import { Card, ProductInBasket, CardModalView } from './components/Card';
import { Success } from './components/Success';
import { ContactsForm } from './components/ContactsForm';

const cardGalleryTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');

const api = new API(CDN_URL, API_URL);
const events = new EventEmitter();

events.onAll(({ eventName, data }) => {
	console.log(eventName, data);
});

const appState = new AppState({}, events);
const page = new Page(document.body, events);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);

const basket = new Basket(cloneTemplate(basketTemplate), events);
const orderForm = new Order(cloneTemplate(orderTemplate), events);
const contactsForm = new ContactsForm(cloneTemplate(contactsTemplate), events);
const successView = new Success(cloneTemplate(successTemplate), {
	onClick: () => {
		modal.close();
		events.emit('order:send');
	},
});
//получаем товары с сервера
api
	.getItemList()
	.then(appState.setGallery.bind(appState))
	.catch((err) => {
		console.error(err);
	});

//блокировка прокрутки страницы при открытии модального окна
events.on('modal:opened', () => {
	page.locked = true;
});

//разблокировка прокрутки
events.on('modal:closed', () => {
	page.locked = false;
});

//изменились элементы галереи
events.on<GalleryChangeEvent>('products:changed', () => {
	page.counter = appState.getBasketItems().length;
	page.gallery = appState.getItems().map((item) => {
		const card = new Card('card', cloneTemplate(cardGalleryTemplate), {
			onClick: () => events.emit('product:OpenInModal', item),
		});
		return card.render({
			id: item.id,
			title: item.title,
			image: item.image,
			category: item.category,
			price: item.price ? `${item.price} синапсов` : 'Бесценно',
		});
	});
});

//открытие товара в модальном окне
events.on('product:OpenInModal', (product: ProductItem) => {
	const card = new CardModalView(cloneTemplate(cardPreviewTemplate), {
		onClick: () => events.emit('basket:addItems', product),
	});
	modal.render({
		content: card.render({
			title: product.title,
			image: product.image,
			category: product.category,
			description: product.description,
			price: product.price ? `${product.price} синапсов` : '',
			status:
				product.price === null ||
				appState.getBasketItems().some((item) => item === product),
		}),
	});
});

//добавление товара в корзину
events.on('basket:addItems', (product: ProductItem) => {
	appState.addToBasket(product);
	page.counter = appState.getBasketItems().length;
	modal.close();
});

//открытие корзины
events.on('basket:open', () => {
	const items = appState.getBasketItems().map((item, index) => {
		const product = new ProductInBasket(cloneTemplate(cardBasketTemplate), {
			onClick: () => events.emit('basket:deleteItem', item),
		});
		return product.render({
			index: index + 1,
			id: item.id,
			title: item.title,
			price: item.price,
		});
	});
	modal.render({
		content: createElement<HTMLElement>('div', {}, [
			basket.render({
				items,
				total: appState.getTotal(),
			}),
		]),
	});
});

//удаление товара из корзины
events.on('basket:deleteItem', (product: ProductItem) => {
	appState.deleteFromBasket(product);
	page.counter = appState.getBasketItems().length;
});

//открытие формы заказа
events.on('order:open', () => {
	if (!appState.orderFormReady()) {
		const information = {
			address: '',
		};
		modal.render({
			content: orderForm.render({
				valid: false,
				errors: [],
				...information,
			}),
		});
	} else {
		const information = {
			phone: '',
			email: '',
		};
		modal.render({
			content: contactsForm.render({
				valid: false,
				errors: [],
				...information,
			}),
		});
	}
});

//выбор способа оплаты
events.on('choose:payment', (data: { paymentType: string }) => {
	appState.setOrder('payment', data.paymentType);
});

//изменение состояния валидации формы контактов
events.on('contactsFormErrors:change', (errors: Partial<IOrderForms>) => {
	const { phone, email } = errors;
	contactsForm.valid = !phone && !email;
	contactsForm.errors = Object.values({ phone, email })
		.filter((i) => !!i)
		.join('; ');
});

//изменение состояния валидации формы заказа с оплатой и указанием адреса
events.on('orderFormErrors:change', (errors: Partial<IOrderForms>) => {
	const { payment, address } = errors;
	orderForm.valid = !payment && !address;
	orderForm.errors = Object.values({ payment, address })
		.filter((i) => !!i)
		.join('; ');
});

//изменилось одно из полей валидации формы
events.on(
	'orderInput:change',
	(data: { field: keyof IOrderForms; value: string }) => {
		appState.setOrder(data.field, data.value);
	}
);

//отправка заказа на сервер и проверка на то, что он готов
events.on('order:submit', () => {
	if (
		!appState.getOrder().email ||
		!appState.getOrder().address ||
		!appState.getOrder().phone
	) {
		return events.emit('order:open');
	}

	const products = appState.getBasketItems();
	api
		.orderItems({
			...appState.getOrder(),
			items: products.map((product) => product.id),
			total: appState.getTotal(),
		})
		.then((result) => {
			modal.render({
				content: successView.render({
					title: !result.error ? 'Заказ оформлен' : 'Ошибка оформления заказа',
					description: !result.error
						? `Списано ${result.total} синапсов`
						: result.error,
				}),
			});
		})
		.catch(console.error);
});

//действия после отправления заказа на сервер
events.on('order:send', () => {
	appState.clearOrder();
	appState.clearBasket();
	orderForm.disableButtons();
});

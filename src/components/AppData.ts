import { Model } from './base/model';
import { FormErrors, IAppState, IProduct, IOrderForms, IOrder } from '../types';

export class ProductItem extends Model<IProduct> {
	id: string;
	description: string;
	image: string;
	title: string;
	category: string;
	selected: boolean;
	price: number | null;
}

export class AppState extends Model<IAppState> {
	gallery: ProductItem[];
	basket: ProductItem[] = [];
	formErrors: FormErrors = {};
	preview: string | null;
	order: IOrder = {
		items: [],
		email: '',
		phone: '',
		address: '',
		payment: '',
		total: null,
	};

	//очистка корзины
	clearBasket() {
		this.basket = [];
		this.emitChanges('products:changed', { gallery: this.gallery });
	}

	//добавление товара в корзину
	addToBasket(product: ProductItem) {
		if (!this.basket.some((item) => item === product)) {
			this.basket.push(product);
		}
	}

	//удаление товара из корзины
	deleteFromBasket(product: ProductItem) {
		this.basket = this.basket.filter((item) => item !== product);
	}

	//получение корзины
	getBasketItems() {
		return this.basket;
	}

	//получение итоговой суммы товаров
	getTotal() {
		return this.basket
			.map((product) => product.price)
			.reduce((prev, current) => prev + current, 0);
	}

	//получение всех товаров
	getItems() {
		return this.gallery;
	}

	//установка превьюшки отдельного товара
	setPreview(item: ProductItem) {
		this.preview = item.id;
		this.emitChanges('preview:changed', item);
	}

	//изменение данных полученных с сервера в тип нужный приложению
	setGallery(items: IProduct[]) {
		this.gallery = items.map((item) => new ProductItem(item, this.events));
		this.emitChanges('products:changed', { gallery: this.gallery });
	}

	//проверка на заполненность первой формы заказа
	orderFormReady() {
		if (this.order === null) {
			return false;
		}
		return this.order.address && this.order.payment;
	}

	//валидация формы заказа
	validateOrderForm() {
		const errors: typeof this.formErrors = {};
		if (!this.order.address) {
			errors.address = 'Укажите адрес';
		}
		if (this.order.payment === null) {
			errors.payment = 'Укажите способ оплаты';
		}

		this.formErrors = errors;
		this.events.emit('orderFormErrors:change', this.formErrors);
		return Object.keys(errors).length === 0;
	}

	//валидация формы контактов
	validateUserForm() {
		const errors: typeof this.formErrors = {};
		if (!this.order.phone) {
			errors.phone = 'Укажите номер телефона';
		}
		if (!this.order.email) {
			errors.email = 'Укажите email';
		}

		this.formErrors = errors;
		this.events.emit('contactsFormErrors:change', this.formErrors);
		return Object.keys(errors).length === 0;
	}

	//заполнение полей заказа для отправки заказа
	setOrder(field: keyof IOrderForms, value: string) {
		this.order[field] = value;
		if (this.validateUserForm()) {
			this.events.emit('orderInUserForm:ready', this.order);
		}
		if (this.validateOrderForm()) {
			this.events.emit('orderInOrderForm:ready', this.order);
		}
	}

	//получение заказа
	getOrder() {
		return this.order;
	}

	//очищение заказа
	clearOrder() {
		this.order = {
			payment: null,
			total: null,
			address: '',
			email: '',
			phone: '',
			items: [],
		};
	}

	//изменение поля "selected" в товарах
	takeOffSelection() {
		this.gallery.forEach((item) => (item.selected = false));
	}
}

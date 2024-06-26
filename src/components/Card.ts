import { Component } from './base/component';
import { CategoryType, CategorySelection, IProduct } from '../types';
import { ensureElement } from '../utils/utils';

export const categorySelection: CategorySelection = {
	'софт-скил': 'card__category_soft',
	другое: 'card__category_other',
	дополнительное: 'card__category_additional',
	кнопка: 'card__category_button',
	'хард-скил': 'card__category_hard',
};

export interface ICardAction {
	onClick: (event: MouseEvent) => void;
}

export interface ICard {
	id: string;
	description: string;
	image: string;
	title: string;
	category: string;
	price: string;
	status: boolean;
}

export class Card extends Component<ICard> {
	protected _price: HTMLElement;
	protected _category?: HTMLElement;
	protected _title: HTMLElement;
	protected _image?: HTMLImageElement;
	protected _button?: HTMLButtonElement;

	constructor(
		protected containerName: string,
		protected container: HTMLElement,
		protected events?: ICardAction
	) {
		super(container);

		this._title = ensureElement<HTMLElement>(
			`.${containerName}__title`,
			container
		);
		this._image = ensureElement<HTMLImageElement>(
			`.${containerName}__image`,
			container
		);

		this._button = container.querySelector(`.${containerName}__button`);
		this._category = container.querySelector(`.${containerName}__category`);
		this._price = container.querySelector(`.${containerName}__price`);

		if (events?.onClick) {
			if (this._button) {
				this._button.addEventListener('click', events.onClick);
			} else {
				container.addEventListener('click', events.onClick);
			}
		}
	}

	get id(): string {
		return this.container.dataset.id || '';
	}

	set id(value: string) {
		this.container.dataset.id = value;
	}

	get title(): string {
		return this._title.textContent || '';
	}

	set title(value: string) {
		this.setText(this._title, value);
	}

	// отключение кнопки добавления товара, если он уже выбран
	set selected(value: boolean) {
		if (!this._button.disabled) {
			this._button.disabled = value;
		}
	}

	set category(value: CategoryType) {
		this._category.classList.add(categorySelection[value]);
		this._category.textContent = value;
	}

	set image(value: string) {
		this.setImage(this._image, value, this.title);
	}

	set price(value: string) {
		this.setText(this._price, value);
	}

	//установка статуса товара
	set status(value: boolean) {
		if (this._button) {
			if (this._price.textContent === '') {
				this.setText(this._button, 'Недоступно');
				this.setDisabled(this._button, true);
			} else {
				this.setText(this._button, value ? 'Уже в корзине' : 'В корзину');
				this.setDisabled(this._button, value);
			}
		}
	}
}

export class CardModalView extends Card {
	protected _description?: HTMLElement;

	constructor(container: HTMLElement, actions?: ICardAction) {
		super('card', container, actions);
		this._description = container.querySelector(`.${this.containerName}__text`);
	}

	set description(value: string | string[]) {
		if (Array.isArray(value)) {
			this._description.replaceWith(
				...value.map((str) => {
					const textTemplate = this._description.cloneNode() as HTMLElement;
					this.setText(textTemplate, str);
					return textTemplate;
				})
			);
		} else {
			this.setText(this._description, value);
		}
	}
}

export interface IProductBasket extends IProduct {
	id: string;
	index: number;
}

export interface IProductBasketActions {
	onClick: (event: MouseEvent) => void;
}

export class ProductInBasket extends Component<IProductBasket> {
	protected _button: HTMLButtonElement;
	protected _title: HTMLElement;
	protected _price: HTMLElement;
	protected _index: HTMLElement;

	constructor(container: HTMLElement, actions?: IProductBasketActions) {
		super(container);

		this._title = container.querySelector(`.card__title`);
		this._index = container.querySelector(`.basket__item-index`);
		this._price = container.querySelector(`.card__price`);
		this._button = container.querySelector(`.card__button`);

		if (this._button) {
			this._button.addEventListener('click', (evt) => {
				this.container.remove();
				actions?.onClick(evt);
			});
		}
	}

	set index(value: number) {
		this._index.textContent = value.toString();
	}

	set title(value: string) {
		this._title.textContent = value;
	}

	set price(value: number) {
		this.setText(this._price, `${value} синапсов`);
	}
}

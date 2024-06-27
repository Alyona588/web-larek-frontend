import { IProduct } from '../types';
import { createElement, ensureElement } from '../utils/utils';
import { Component } from './base/component';
import { EventEmitter, IEvents } from './base/events';

export interface IBasketView {
	total: number; //итоговая сумма заказа
	items: HTMLElement[]; // список товаров в корзине
}

export class Basket extends Component<IBasketView> {
	protected _button: HTMLButtonElement;
	protected _total: HTMLElement;
	protected _list: HTMLElement;

	constructor(container: HTMLElement, protected events: EventEmitter) {
		super(container);

		this._list = ensureElement<HTMLElement>('.basket__list', this.container);
		this._button = this.container.querySelector('.basket__button');
		this._total = ensureElement<HTMLElement>('.basket__price', this.container);

		if (this._button) {
			this._button.addEventListener('click', () => {
				events.emit('order:open');
			});
		}
		this.items = [];
	}
	//отключение кнопки внутри корзины
	disableButton(state: boolean) {
		this.setDisabled(this._button, state);
	}

	//отрисовка товаров в корзине, если корзина пуста отрисовка надписи
	set items(items: HTMLElement[]) {
		if (items.length) {
			this._list.replaceChildren(...items);
			this.disableButton(false);
		} else {
			this.disableButton(true);
			this._list.replaceChildren(
				createElement<HTMLParagraphElement>('p', {
					textContent: 'Корзина пуста',
				})
			);
		}
	}

	//отключение кнопки "оформить", если корзина пуста
	set selected(items: string[]) {
		this.setDisabled(this._button, !items.length);
	}

	//отрисовка итоговой суммы
	set total(total: number) {
		this.setText(this._total, total.toString() + ' синапсов');
	}
}

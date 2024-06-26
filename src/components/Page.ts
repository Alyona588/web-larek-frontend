import { Component } from './base/component';
import { ensureElement } from '../utils/utils';
import { IEvents } from './base/events';

export interface IPage {
	gallery: HTMLElement[];
	counter: number;
	locked: boolean;
}

export class Page extends Component<IPage> {
	protected _counter: HTMLElement;
	protected _basket: HTMLElement;
	protected _gallery: HTMLElement;
	protected _wrapper: HTMLElement;

	constructor(container: HTMLElement, protected events: IEvents) {
		super(container);

		this._counter = ensureElement<HTMLElement>('.header__basket-counter');
		this._basket = ensureElement<HTMLElement>('.header__basket');
		this._gallery = ensureElement<HTMLElement>('.gallery');
		this._wrapper = ensureElement<HTMLElement>('.page__wrapper');

		this._basket.addEventListener('click', (e: Event) => {
			this.events.emit('basket:open');
		});
	}

	//установка значения счетчику товаров корзины
	set counter(value: number) {
		this.setText(this._counter, String(value));
	}

	//сеттер для товаров
	set gallery(value: HTMLElement[]) {
		this._gallery.replaceChildren(...value);
	}

	//сеттер для элемента прокрутки
	set locked(value: boolean) {
		if (value) {
			this._wrapper.classList.add('page__wrapper_locked');
		} else {
			this._wrapper.classList.remove('page__wrapper_locked');
		}
	}
}

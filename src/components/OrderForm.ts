import { IEvents } from './base/events';
import { ensureElement } from '../utils/utils';
import { Form } from './common/Form';

export interface IOrder {
	address: string;
	payment: string;
}

export class Order extends Form<IOrder> {
	protected _cash: HTMLButtonElement;
	protected _online: HTMLButtonElement;
	protected _address: HTMLInputElement;

	constructor(container: HTMLFormElement, events: IEvents) {
		super(container, events);

		this._cash = container.elements.namedItem('cash') as HTMLButtonElement;
		this._online = container.elements.namedItem('card') as HTMLButtonElement;

		if (this._cash) {
			this._cash.addEventListener('click', () => {
				this.toggleClass(this._cash, 'button_alt-active', true)
				this.toggleClass(this._online, 'button_alt-active', false)
				this.onInputChange('cash', 'payment');
			});
		}
		if (this._online) {
			this._online.addEventListener('click', () => {
				this.toggleClass(this._cash, 'button_alt-active', false)
				this.toggleClass(this._online, 'button_alt-active', true)
				this.onInputChange('card', 'payment');
			});
		}
	}

	//отключение выделения кнопок способа оплаты
	disableButtons() {
		this.toggleClass(this._cash, 'button_alt-active', false);
		this.toggleClass(this._online, 'button_alt-active', false);
	}

	//установка значения адреса
	set address(value: string) {
		(this.container.elements.namedItem('address') as HTMLInputElement).value =
			value;
	}
}

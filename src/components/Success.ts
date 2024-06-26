import { ensureElement } from '../utils/utils'; 
import { Component } from './base/component';

export interface ISuccess {
	total: number;
	title: string;
	description: string;
}

export interface ISuccessActions {
	onClick(): void;
}

export class Success extends Component<ISuccess> {
	protected _button: HTMLButtonElement;
	protected _description: HTMLElement;
	protected _title: HTMLElement;

	constructor(container: HTMLElement, actions: ISuccessActions) {
		super(container);

		this._button = ensureElement<HTMLButtonElement>(
			'.order-success__close',
			this.container
		);

		this._description = ensureElement<HTMLElement>(
			'.order-success__description',
			this.container
		);
		this._title = ensureElement<HTMLElement>(
			'.order-success__title',
			this.container
		);

		if (actions?.onClick) {
			this._button.addEventListener('click', actions.onClick);
		}
	}
	//установка текста заголовка в окне успешной отправки заказа
	set title(value: string) {
		this.setText(this._title, value);
	}

	//установка текста в окне успешной отправки заказа
	set description(value: string) {
		this.setText(this._description, value);
	}
}

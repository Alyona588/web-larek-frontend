import { ensureElement } from '../../utils/utils';
import { Component } from '../base/component';
import { IEvents } from '../base/events';

export interface IForm {
	valid: boolean; //валидна ли форма
	errors: string[]; //массив с ошибками
}

export class Form<T> extends Component<IForm> {
	protected _errors: HTMLElement;
	protected _submit: HTMLButtonElement;

	constructor(protected container: HTMLFormElement, protected events: IEvents) {
		super(container);
		this._errors = ensureElement<HTMLElement>('.form__errors', this.container);
		this._submit = ensureElement<HTMLButtonElement>(
			'button[type=submit]',
			this.container
		);

		this.container.addEventListener('input', (e: Event) => {
			const target = e.target as HTMLInputElement;
			const value = target.value;
			const field = target.name as keyof T;
			this.onInputChange(value, field);
		});

		this.container.addEventListener('submit', (e: Event) => {
			e.preventDefault();
			this.events.emit('order:submit');
		});
	}
	//изменение полей инпута
	protected onInputChange(value: string, field: keyof T) {
		this.events.emit('orderInput:change', {
			value,
			field,
		});
	}

	//отрисовка ошибок
	set errors(value: string) {
		this.setText(this._errors, value);
	}

	//отключение кнопки "далее" в случае невалидности данных
	set valid(value: boolean) {
		this._submit.disabled = !value;
	}

	//отрисовка данных формы
	render(state: Partial<T> & IForm) {
		const { errors, valid, ...inputs } = state;
		super.render({ errors, valid });
		Object.assign(this, inputs);
		return this.container;
	}
}

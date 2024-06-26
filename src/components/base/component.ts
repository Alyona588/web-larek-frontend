export abstract class Component<T> {
	protected constructor(protected readonly container: HTMLElement) {}

	//переключение класса
	toggleClass(element: HTMLElement, className: string, force?: boolean) {
		element.classList.toggle(className, force);
	}

	//скрыть элемент
	protected setHidden(element: HTMLElement) {
		element.style.display = 'none';
	}

	//сделать элемент видимым
	protected setVisible(element: HTMLElement) {
		element.style.removeProperty('display');
	}

	//установить текст элементу
	protected setText(element: HTMLElement, value: unknown) {
		if (element) {
			element.textContent = String(value);
		}
	}
	//установить картинку
	protected setImage(element: HTMLImageElement, src: string, alt?: string) {
		if (element) {
			element.src = src;
			if (alt) {
				element.alt = alt;
			}
		}
	}

	//сделать недоступным для взаимодействия
	setDisabled(element: HTMLElement, state: boolean) {
		if (element) {
			if (state) {
				element.setAttribute('disabled', 'disabled');
			} else {
				element.removeAttribute('disabled');
			}
		}
	}

	//отрисовка элемента
	render(data?: Partial<T>): HTMLElement {
		Object.assign(this as object, data ?? {});
		return this.container;
	}
}

export interface IOrderForms {
	payment: string;
	address: string;
	email: string;
	phone: string;
}

export interface IOrder {
	items: string[];
	payment: string;
	address: string;
	email: string;
	phone: string;
	total: number;
}

export type CategoryType =
	| 'софт-скил'
	| 'другое'
	| 'дополнительное'
	| 'кнопка'
	| 'хард-скил';

export type CategorySelection = {
	[Key in CategoryType]: string;
};

export interface IProduct {
	id: string;
	description: string;
	image: string;
	title: string;
	category: CategoryType;
	price: number | null;
	selected: boolean;
}

export type GalleryChangeEvent = {
	gallery: IProduct[];
};

export interface IOrderResult {
	id: string;
  total: number
  error?: string
}

export interface IAppState {
	catalog: IProduct[];
	basket: string[];
	order: IOrder;
}

export type FormErrors = Partial<Record<keyof IOrderForms, string>>;

export interface IAPI {
	getItem: (id: string) => Promise<IProduct>;
	getItemList: () => Promise<IProduct[]>;
	orderItems: (order: IOrder) => Promise<IOrderResult>;
}

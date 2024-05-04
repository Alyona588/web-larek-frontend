interface IModal {
  content: HTMLElement;
  closeButton: HTMLButtonElement;
  open(): void;
  close(): void; 

}

interface IPage {
  catalogContainer: HTMLElement[];
}

interface IBasketView {
  total: number;
  items: HTMLElement[];
}

interface IForm {
  valid: boolean;
  errors: string[];
}

interface ICard {
  id: string;
  description: string;
  image: string;
  title: string;
  category: string;
  price: number;
}

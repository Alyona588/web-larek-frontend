# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Webpack

Структура проекта:

- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:

- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/styles/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск

Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```

## Сборка

```
npm run build
```

или

```
yarn build

```

## Типы данных и интерфейсы

interface IOrderForms - описывает поля формы заказа
interface IOrder - описывает сам заказ
type CategoryType - тип категории товара на странице магазина
type CategorySelection - тип выбора категории
interface IPage - описывает визуальную составляющую магазина и прокрутку страницы при открытом модальном окне
interface IProduct - описывает отдульный товар
type GalleryChangeEvent - тип нужный для отрисовки изменившейся галереи товаров
interface IOrderResult - описывает результат составления заказа
interface IAppState - описывает основное состояние приложения
type FormErrors - тип для ошибок формы заполнения данных заказа
interface IAPI - описывает основные методы взаимодействия с сервером

## Базовый классы приложения

1. abstract class Component
   Основной класс для представлений.

   constructor(protected readonly container: HTMLElement)
   В конструкторе принимает элемент разметки, заполняющийся данными из модели. Основные методы:

   toggleClass(element: HTMLElement, className: string, force?: boolean)
   Переключатель класса элемента. Принимает элемент разметки, имя класса, и параметр типа булеан(необязательный).

   protected setHidden(element: HTMLElement)
   Скрывает элемент, параметр - элемент разметки

   protected setVisible(element: HTMLElement)
   Показывает элемент, параметр - элемент разметки

   protected setText(element: HTMLElement, value: unknown)
   Устанавливает текст элементу. Параметры: элемент разметки и значение любого типа

   protected setImage(element: HTMLImageElement, src: string, alt?: string)
   Устанавливает картинку. Параметры: элемент разметки, ссылка типа string и значение альтернативного текста(если передано)

   setDisabled(element: HTMLElement, state: boolean)
   Делает элемент недоступным для взаимодействия. Параметры: элемент разметки, значение boolean в зависимости от которого будет сниматься или устанавливаться атрибут

   render(data?: Partial<T>): HTMLElement
   Отрисовка элемента, возвращает элемент с заполненными данными.

2. Class EventEmmiter
   Позволяет подписываться на события и уведомлять подписчиков о наступлении этого события, таким образом реализуя паттерн "Observer" или "Наблюдатель".
   Основные методы:

   on(eventName: EventName, callback: (event: T) => void) - добавляет обработчик на определенное событие.
   off(eventName: EventName, callback: Subscriber) - снятие обработчика с определенного события.
   emit(eventName: string, data?: T) - инициализация события с передачей данных.
   onAll(callback: (event: EmitterEvent) => void) - слушатель всех событий.
   offAll() - удаление всех обработчиков событий
   trigger(eventName: string, context?: Partial<T>) - функция, генерирующая событие при вызове.

3. Class Api
   Класс, реализовывающий работу с данными, приходящими с сервера и отправляемыми на сервер.
   readonly baseUrl: string;
   Свойство, принимающее на вход строку, содержащую адрес сервера.

   protected options: RequestInit;
   свойство с специальными свойствами отправки запроса.

   constructor(baseUrl: string, options: RequestInit = {})
   Конструктов принимает адрес сервера и параметры запроса.

   handleResponse(response: Response): Promise<object>
   Обрабатывает запрос и возвращает промис

   get(uri: string): Promise<Object>
   Get-запрос, позволяющий получить данные в виде объекта, принимающий на вход адрес сервера

   post(uri: string, data: object, method: ApiPostMethods = 'POST')
   Post - метод, позволяющий отправить данные в виде объекта на сервер.

4. abstract class Model
   Базовый класс модели данных.

   constructor(data: Partial<T>, protected events: IEvents)
   Констуктор принимает данные выбранного тип и экземпляр IEvents для того, чтобы работать с событиями.

   emitChanges(event: string, payload?: object)
   Единственный метод класса, сообщает, что модель данных изменилась, принимает на вход само событие данные(необязательно), в которых произошли изменения

## Общие компоненты

1. class Form<T> extends Component<IForm>
   Общий класс для всех форм, расширяет Component.

   constructor(protected container: HTMLFormElement, protected events: IEvents)
   В констукторе принимает элемент разметки формы и экземпляр "IEvents" для того, чтобы работать с событиями.

   Методы:
   protected onInputChange(value: string, field: keyof T)
   Изменение значений поля ввода. Параметры: само значение и поле инпута

   set errors(value: string)
   Сеттер для установки текста для ошибок

   set valid(value: boolean)
   отключает кнопку "далее" в случае невалидности данных, в качестве параметра принимает булево значение

   render(state: Partial<T> & IForm)
   Возвращает элемент с заполненными данными

2. class Modal extends Component<IModal>  
   Общий класс для всех маодальных окон, расширяет Component.

   constructor(container: HTMLElement, protected events: IEvents)
   В констукторе принимает элемент разметки и экземпляр "IEvents" для того, чтобы работать с событиями.

   Методы:
   set content(value: HTMLElement)
   Устанавливает содержимое модального окна. В параметрах указывается элемент разметки

   close()
   Отвечает за закрытие модального окна

   open()
   Отвечает за открытие модального окна

   render(data: IModal): HTMLElement
   Возвращает модальное окно с нужными данными

## Компоненты модели данных (бизнес - логика)

1. class API extends Api implements IAPI
   Отвечает за работу с конкретным сервером. Наследует класс Api.

   constructor(cdn: string, baseUrl: string, options?: RequestInit)
   В конструкторе принимает адрес конкретный запрос к серверу, базовый адрес сервера и опции запроса(необязательно)

   getItem(id: string): Promise<IProduct>
   Получение одного товара с сервера по айдишнику, возвращает промис

   getItemList(): Promise<IProduct[]>
   Получение списка товаров с сервера, возвращает промис

   orderItems(order: IOrder): Promise<IOrderResult>
   Отправка данных товаров на сервер. Принимается объект с данными, возвращается промис с результатом.

2. class ProductItem extends Model<IProduct>
   Класс, описывающий состояние приложения.

   gallery: ProductItem[] //товары на странице магазина
   basket: ProductItem[] = []; //товары в корзине
   formErrors: FormErrors = {}; //объект с ошибками валидации
   preview: string | null; //превьюшка
   order: IOrder = {
   items: [],
   email: '',
   phone: '',
   address: '',
   payment: '',
   total: null,
   }; //объект заказа с товарами

   clearBasket()
   Очистка корзины

   addToBasket(product: ProductItem)
   Добавление товара в корзину. На вход принимает товар с типом ProductItem.

   deleteFromBasket(product: ProductItem)
   Удаление товара из корзины. На вход принимает товар с типом ProductItem.

   getBasketItems()
   Возвращает корзину

   getTotal()
   Получение итоговой суммы товаров

   getItems()
   Получение всех товаров магазина

   setPreview(item: ProductItem)
   Установка превьюшки отдельного товара. На вход принимает товар с типом ProductItem.

   setGallery(items: IProduct[])
   Изменение данных полученных с сервера в тип нужный приложению. На вход принимает массив товаров с типом IProduct

   orderFormReady()
   Проверка на заполненность первой формы заказа

   validateOrderForm()
   Валидация формы заказа

   validateUserForm()
   Валидация формы контактов

   setOrder(field: keyof IOrderForms, value: string)
   заполнение полей заказа для отправке заказа. В параметрах принимает поле, где вводятся данные и значение.

   getOrder()
   Получение заказа

   clearOrder()
   Очищение заказа

   takeOffSelection()
   Изменение поля "selected" в товарах

3. class Basket extends Component<IBasketView>
   Отвечает за отображение корзины в модальнои окне. Расширяет класс Component.

   constructor(container: HTMLElement, protected events: EventEmitter)
   В констукторе принимает элемент разметки и экземпляр "IEvents" для того, чтобы работать с событиями.

   disableButton()
   Отключение кнопки внутри корзины

   set items(items: HTMLElement[])
   Отрисовка товаров в корзине, если корзина пуста отрисовка надписи

   updateIndex()
   Обновление индекса товара

   set selected(items: string[])
   Сеттер для отключения кнопки "оформить", если корзина пуста

   set total(total: number)
   отрисовка итоговой суммы

4. class Card extends Component<ICard>  
   Отвечает за отображение карточки. Расширяет класс Component.

   constructor(
   protected containerName: string,
   protected container: HTMLElement,
   protected events?: ICardAction
   )
   В констукторе принимает название контейнера для элементов, элемент разметки и экземпляр "IEvents" для того, чтобы работать с событиями.

   Основные методы:
   set selected(value: boolean)
   Отключение кнопки добавления товара, если он уже выбран. На вход принимает булево значение

   set status(value: boolean)
   Установка статуса товара(недоступен, уже в корзине, добавить в корзину). На вход принимает булево значение

5. class ProductInBasket extends Component<IProductBasket>
   Отвечает за отображение товара в корзине. Расширяет Component.

   constructor(container: HTMLElement, actions?: IProductBasketActions)
   В констукторе принимает элемент разметки и опционально действия по событиям IProductBasketActions.

6. class ContactsForm extends Form<IContactsForm>
   Класс взаимодействия с формой заполнения контактов пользователя. Наследует класс Form.

   constructor(container: HTMLFormElement, events: IEvents)
   В констукторе принимает контейнер с элементом разметки формы и экземпляр "IEvents" для того, чтобы работать с событиями.
   Методы:

   set phone(value: string)
   установка значения номера телефона

   set email(value: string)
   установка значения email

7. class Order extends Form<IOrder>
   Класс взаимодействия с формой заполнения заказа. Наследует класс Form.

   constructor(container: HTMLFormElement, events: IEvents)
   В констукторе принимает контейнер с элементом разметки формы и экземпляр "IEvents" для того, чтобы работать с событиями.

   Методы:
   disableButtons()
   отключение выделения кнопок способа оплаты

   set address(value: string)
   сеттер для установки значения адреса

8. class Page extends Component<IPage>  
   Класс отображения страницы магазина. Расширяет класс Component.

   constructor(container: HTMLElement, protected events: IEvents)
   В констукторе принимает контейнер с элементом разметки и экземпляр "IEvents" для того, чтобы работать с событиями.

   Методы:
   set counter(value: number)
   установка значения счетчику товаров корзины

   set locked(value: boolean)
   сеттер для элемента прокрутки. На вход принимает булево значение.

9. class Success extends Component<ISuccess>
   Класс отображения окна успешного выполнения заказа. Расширяет класс Component.

   constructor(container: HTMLElement, actions: ISuccessActions)
   В констукторе принимает контейнер с элементом разметки и специально сгенирированное событие.

   Методы:
   set title(value: string)
   установка текста заголовка в окне успешной отправки заказа

   set description(value: string)
   установка текста в окне успешной отправки заказа

## Основные события

'modal:opened'
открытие модального окна. Срабатывает при клике на элемент разметки отдельной карточки.

'modal:closed'
закрытие модального окна. Срабатывает при клике на кнопку закрытия модального окна
или при клике на оверлей

'products:changed'
изменение списка товаров. Срабатывает при изменении списка товаров

'product:OpenInModal'
открытие превьюшки товара. Срабатывает при клике на элемент разметки отдельной карточки

'basket:addItems'
Добавление товара в корзину. Срабатывает при клике на кнопку "В корзину" отдельной карточки

'basket:open'
Открытие корзины. Срабатывает при клике на корзину магазина.

'basket:deleteItem'
удаление товара из корзины. Срабатывает при клике на крестик рядом с названием товара в корзине

'order:open'
открытие формы заказа

'choose:payment'
выбор метода оплаты

'contactsFormErrors:change'
изменение формы с заполнением контактов пользователя

'orderFormErrors:change'
изменение формы с заполнением адреса и метода оплаты

'orderInput:change'
изменение инпута формы заказа

'order:submit'
подтверждение заказа, когда готовы обе формы

'order:send'
отправка заказа

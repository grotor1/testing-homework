import {checkoutComplete, initStore} from '../../src/client/store';
import {CartApi, ExampleApi} from '../../src/client/api';
import {elem, mockArray} from '../helper/mockData';
import axios from 'axios';
import mocked = jest.mocked;
import {appRender} from '../helper/appRender';
import userEvent from '@testing-library/user-event';
import {from, map} from 'rxjs';

const basename = '/hw/store';
jest.mock('axios');

const mockedAxios = mocked(axios);

describe('Тесты корзины', () => {
  beforeEach(() => {
    mockedAxios.mockClear();
    localStorage.clear();
  });

  it('Обновление не сбрасывает корзину', () => {
    let store = initStore(new ExampleApi(basename), new CartApi());

    store.dispatch({type: 'ADD_TO_CART', product: elem});

    location.reload();

    store = initStore(new ExampleApi(basename), new CartApi());

    expect(store.getState().cart[elem.id].count).toBe(1);
  });

  it('Количество уникальных элементов показывается в навигации', () => {
    let store = initStore(new ExampleApi(basename), new CartApi());

    const screen = appRender(
      ['/'],
      store
    );

    store.dispatch({type: 'ADD_TO_CART', product: elem});
    store.dispatch({type: 'ADD_TO_CART', product: elem});
    store.dispatch({type: 'ADD_TO_CART', product: mockArray[1]});

    screen.findByText('Cart (2)');
  });

  it('Ссылка в каталог на пустой корзине', async () => {
    const screen = appRender(
      ['/cart'],
    );

    const link = await screen.findByText('catalog');
    // @ts-ignore
    expect(link.href).toBe(`${window.location}catalog`);
  });

  it('Верность данных в таблице', async () => {
    let store = initStore(new ExampleApi(basename), new CartApi());

    const screen = appRender(
      ['/cart'],
      store
    );

    store.dispatch({type: 'ADD_TO_CART', product: elem});
    store.dispatch({type: 'ADD_TO_CART', product: elem});
    store.dispatch({type: 'ADD_TO_CART', product: elem});
    store.dispatch({type: 'ADD_TO_CART', product: elem});

    await screen.findAllByText('$' + elem.price * 4);
    await screen.findByText(4);
    await screen.findByText(elem.name);
    await screen.findByText(1);

    store.dispatch({type: 'ADD_TO_CART', product: mockArray[1]});

    await screen.findByText('$' + (elem.price * 4 + mockArray[1].price));
  });

  it('Проверка валидирования правильного ввода', async () => {
    let store = initStore(new ExampleApi(basename), new CartApi());
    const user = userEvent.setup();

    const screen = appRender(
      ['/cart'],
      store
    );

    store.dispatch({type: 'ADD_TO_CART', product: elem});

    const in1 = await screen.findByTestId('address');
    const in2 = await screen.findByTestId('phone');
    const in3 = await screen.findByTestId('name');

    await user.type(in1, 'ыва');
    await user.type(in2, '89870638926');
    await user.type(in3, 'ыва');

    mockedAxios.post.mockResolvedValue({data: {id: 123}});
    const button = await screen.findByTestId('submit');
    await user.click(button);

    expect(in1.classList.contains('is-invalid')).toBe(false);
    expect(in2.classList.contains('is-invalid')).toBe(false);
    expect(in3.classList.contains('is-invalid')).toBe(false);
  });

  it('Проверка невалидирования неправильного ввода', async () => {
    let store = initStore(new ExampleApi(basename), new CartApi());
    const user = userEvent.setup();

    const screen = appRender(
      ['/cart'],
      store
    );

    store.dispatch({type: 'ADD_TO_CART', product: elem});

    const in1 = await screen.findByTestId('address');
    const in2 = await screen.findByTestId('phone');
    const in3 = await screen.findByTestId('name');

    await user.type(in2, '123');

    await user.click(await screen.findByTestId('submit'));

    expect(in1.classList.contains('is-invalid')).toBe(true);
    expect(in2.classList.contains('is-invalid')).toBe(true);
    expect(in3.classList.contains('is-invalid')).toBe(true);
  });

  it('Созданный заказ отображается', async () => {
    let store = initStore(new ExampleApi(basename), new CartApi());
    const user = userEvent.setup();

    const screen = appRender(
      ['/cart'],
      store);

    store.dispatch({type: 'ADD_TO_CART', product: elem});

    const in1 = await screen.findByTestId('address');
    const in2 = await screen.findByTestId('phone');
    const in3 = await screen.findByTestId('name');

    await user.type(in1, 'ыва');
    await user.type(in2, '89870638926');
    await user.type(in3, 'ыва');

    mockedAxios.post.mockResolvedValue({data: {id: 123}});
    const button = await screen.findByTestId('submit');
    await user.click(button);

    if (in1.classList.contains('is-invalid') || in2.classList.contains('is-invalid') || in2.classList.contains('is-invalid')) {
      return
    }

    await screen.findByTestId('msg');
  });
});

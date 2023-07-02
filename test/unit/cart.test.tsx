import {initStore} from '../../src/client/store';
import {CartApi, ExampleApi} from '../../src/client/api';
import {elem, mockArray} from '../helper/mockData';
import axios from 'axios';
import mocked = jest.mocked;
import {appRender} from '../helper/appRender';
import userEvent from '@testing-library/user-event';

const basename = '/hw/store';
jest.mock('axios');

const mockedAxios = mocked(axios);

describe('Тесты корзины', () => {
  afterEach(() => {
    mockedAxios.mockClear();
  });

  it('Обновление не сбрасывает корзину', async function () {
    let store = initStore(new ExampleApi(basename), new CartApi());

    store.dispatch({type: 'ADD_TO_CART', product: elem});

    location.reload();

    store = initStore(new ExampleApi(basename), new CartApi());

    expect(store.getState().cart[elem.id].count).toBe(1);
  });

  it('Количество уникальных элементов показывается в навигации', async function () {
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

  it('Ссылка в каталог на пустой корзине', async function () {
    const screen = appRender(
      ['/cart'],
    );

    const link = await screen.findByText('catalog');
    // @ts-ignore
    expect(link.href).toBe(`${window.location}catalog`);
  });

  it('Верность данных в таблице', async function () {
    let store = initStore(new ExampleApi(basename), new CartApi());

    const screen = appRender(
      ['/cart'],
      store
    );

    store.dispatch({type: 'ADD_TO_CART', product: elem});
    store.dispatch({type: 'ADD_TO_CART', product: elem});
    store.dispatch({type: 'ADD_TO_CART', product: elem});
    store.dispatch({type: 'ADD_TO_CART', product: elem});

    await screen.findAllByText('$' + elem.price * 4)
    await screen.findByText(4)
    await screen.findByText(elem.name)
    await screen.findByText(1)

    store.dispatch({type: 'ADD_TO_CART', product: mockArray[1]});

    await screen.findByText('$' + (elem.price * 4 + mockArray[1].price))
  });

  it('Проверка невалидирования неправильного ввода', async function () {
    let store = initStore(new ExampleApi(basename), new CartApi());
    const user = userEvent.setup();

    const screen = appRender(
      ['/cart'],
      store
    );

    store.dispatch({type: 'ADD_TO_CART', product: elem});

    await user.type(await screen.findByTestId('phone'), '123')

    await user.click(await screen.findByTestId('submit'))

    await screen.findByText('Please provide a valid phone')
    await screen.findByText('Please provide your name')
    await screen.findByText('Please provide a valid address')
  });

  it('Проверка валидирования правильного ввода', async function () {
    mockedAxios.get.mockResolvedValue({data: 123});
    let store = initStore(new ExampleApi(basename), new CartApi());
    const user = userEvent.setup();

    const screen = appRender(
      ['/cart'],
      store
    );

    store.dispatch({type: 'ADD_TO_CART', product: elem});

    await user.type(await screen.findByTestId('address'), 'ыва')
    await user.type(await screen.findByTestId('phone'), '89870638926')
    await user.type(await screen.findByTestId('name'), 'ыва')

    await user.click(await screen.findByTestId('submit'))

    await screen.findByTestId('msg');
  });
});

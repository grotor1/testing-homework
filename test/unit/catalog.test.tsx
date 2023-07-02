import React from 'react';
import userEvent from '@testing-library/user-event';
import axios from 'axios';
import {appRender} from '../helper/appRender';
import mocked = jest.mocked;
import {initStore} from '../../src/client/store';
import {CartApi, ExampleApi} from '../../src/client/api';
import {elem, mockArray} from '../helper/mockData';

const basename = '/hw/store';
jest.mock('axios');

const mockedAxios = mocked(axios);

describe('Тесты каталога', () => {
  afterEach(() => {
    mockedAxios.mockClear();
  });

  it('Товары с сервера отображаются', async function () {
    mockedAxios.get.mockResolvedValue({data: mockArray});
    jest.mock('../../src/client/components/ProductItem');

    const screen = appRender(
      ['/catalog'],
    );

    const el = await screen.findByTestId(1);
    const elems = (await screen.findByTestId('card-container')).children;

    jest.unmock('../../src/client/components/ProductItem');
    expect(elems.length).toBe(5);
  });

  // @ts-ignore
  it('Карточка товара коректно отображается', async function () {
    mockedAxios.get.mockResolvedValue({data: mockArray});
    const screen = appRender(
      ['/catalog'],
    );

    const title = await screen.findByText(elem.name);
    const price = await screen.findByText('$' + elem.price);
    const link = await screen.findByTestId('0-link-card');
    // @ts-ignore
    expect(link.href).toBe(`${window.location}catalog/${elem.id}`);
  });

  it('Страница товара коректно отображается', async function () {
    mockedAxios.get.mockResolvedValue({data: elem});

    const screen = appRender(
      ['/catalog/0'],
    );

    await screen.findByText(elem.name);
    await screen.findByText('$' + elem.price);
    await screen.findByText(elem.description);
    await screen.findByText(elem.color);
    await screen.findByText(elem.material);
    await screen.findByText('Add to Cart');
  });

  it('Бейдж о наличии в корзине существует на карточке товара', async function () {
    mockedAxios.get.mockResolvedValue({data: mockArray});

    const store = initStore(new ExampleApi(basename), new CartApi());

    store.dispatch({type: 'ADD_TO_CART', product: elem});

    const screen = appRender(
      ['/catalog'],
      store
    );

    await screen.findByTestId('cart-badge');
  });

  it('Бейдж о наличии в корзине существует на странице товара', async function () {
    mockedAxios.get.mockResolvedValue({data: elem});

    const store = initStore(new ExampleApi(basename), new CartApi());

    store.dispatch({type: 'ADD_TO_CART', product: elem});

    const screen = appRender(
      ['/catalog/0'],
      store
    );

    await screen.findByTestId('cart-badge');
  });

  it('Кнопка добавляет в корзину', async function () {
    mockedAxios.get.mockResolvedValue({data: elem});
    const user = userEvent.setup();

    const store = initStore(new ExampleApi(basename), new CartApi());

    const screen = appRender(
      ['/catalog/0'],
      store
    );

    const button = await screen.findByTestId('add-button');

    await user.click(button);
    await user.click(button);

    expect(store.getState().cart[elem.id].count).toBe(2);
  });
});

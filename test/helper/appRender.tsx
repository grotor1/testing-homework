import {MemoryRouter} from 'react-router-dom';
import {Provider} from 'react-redux';
import {initStore} from '../../src/client/store';
import React from 'react';
import {Application} from '../../src/client/Application';
import {render} from '@testing-library/react';
import {CartApi, ExampleApi} from '../../src/client/api';

// @ts-ignore
export const appRender = (entries, store?) => {
  store = store ?? initStore(
    new ExampleApi('/hw/store'),
    new CartApi()
  );

  const application = (
    <MemoryRouter initialEntries={entries} initialIndex={0}>
      <Provider store={store}>
        <Application />
      </Provider>
    </MemoryRouter>
  );

  return {
    ...render(application)
  };
};

import {appRender} from '../helper/appRender';
import {elem} from '../helper/mockData';

describe('Тесты элементов навигации', () => {
  it('Название - ссылка на главную', async function () {
    const screen = appRender(
      ['/catalog'],
    );

    const link = await screen.findByText('Example store');
    // @ts-ignore
    expect(link.href).toBe(`${window.location}`);
  });
})

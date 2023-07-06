const {assert} = require('chai');

const basename = '/hw/store';

describe('Тесты каталога', async function () {
  it('Верстка адаптируется 575px', async function ({browser}) {
    const puppeteer = await browser.getPuppeteer();
    const [page] = await puppeteer.pages();
    await page.goto('http://localhost:3000/hw/store/catalog/0');
    await page.setViewport({
      width: 575,
      height: 1000,
    });
    await browser.assertView('plain', '.Product', {
      ignoreElements: [
        '.ProductDetails-Name',
        '.ProductDetails-Description',
        '.ProductDetails-Price',
        '.ProductDetails-Color',
        '.ProductDetails-Material',
      ]
    });
  });

  it('Верстка адаптируется 1000px', async function ({browser}) {
    const puppeteer = await browser.getPuppeteer();
    const [page] = await puppeteer.pages();
    await page.goto('http://localhost:3000/hw/store/catalog/0');
    await page.setViewport({
      width: 1000,
      height: 1000,
    });
    await browser.assertView('plain', '.Product', {
      ignoreElements: [
        '.ProductDetails-Name',
        '.ProductDetails-Description',
        '.ProductDetails-Price',
        '.ProductDetails-Color',
        '.ProductDetails-Material',
      ]
    });
  });

  it('Верстка адаптируется 1920px', async function ({browser}) {
    const puppeteer = await browser.getPuppeteer();
    const [page] = await puppeteer.pages();
    await page.goto('http://localhost:3000/hw/store/catalog/0');

    await browser.assertView('plain', '.Product', {
      ignoreElements: [
        '.ProductDetails-Name',
        '.ProductDetails-Description',
        '.ProductDetails-Price',
        '.ProductDetails-Color',
        '.ProductDetails-Material',
      ]
    });
  });

  it('Карточка товара корректонно отображается - сервер', async function ({browser}) {
    const puppeteer = await browser.getPuppeteer();
    const [page] = await puppeteer.pages();
    await page.goto('http://localhost:3000/hw/store/catalog');

    await browser.assertView('plain', '.ProductItem', {
      ignoreElements: [
        '.ProductItem-Name',
        '.ProductItem-Price',
      ]
    });
  })

  it('Карточка совпадает со страницой', async ({ browser }) => {
    await browser.url(`http://localhost:3000/hw/store/catalog`);

    const itemCard = await browser.$('div[data-testid=\'1\']').$('.ProductItem');

    const name = await itemCard.$('.card-body').$('.ProductItem-Name').getText();
    const price = await itemCard.$('.card-body').$('.ProductItem-Price').getText();

    if (!name || !price) {
      return;
    }

    await browser.url(`http://localhost:3000/hw/store/catalog/1`);

    await expect(await browser.$('.ProductDetails-Name')).toExist();
    await expect(await browser.$('.ProductDetails-Price')).toExist();
    await expect(await browser.$('.ProductDetails-Name')).toHaveText(name);
    await expect(await browser.$('.ProductDetails-Price')).toHaveText(price);
  });
});


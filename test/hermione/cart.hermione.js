const {assert} = require('chai');

const basename = '/hw/store';

describe('Тесты корзины', async function () {
  it('Уведомление о заказе сверстанно правильно', async function ({browser}) {
    const puppeteer = await browser.getPuppeteer();
    const [page] = await puppeteer.pages();
    await page.goto('http://localhost:3000/hw/store/catalog/1');
    await page.click('.ProductDetails-AddToCart')

    await page.goto('http://localhost:3000/hw/store/cart')

    await page.click('#f-name')
    await page.keyboard.type('asd')
    await page.click('#f-phone')
    await page.keyboard.type('89098768910')
    await page.click('#f-address')
    await page.keyboard.type('asd')

    await page.click('.Form-Submit')

    await browser.assertView('plain', '.Cart-SuccessMessage', {
      ignoreElements: [
        '.Cart-Number'
      ]
    });
  });
});


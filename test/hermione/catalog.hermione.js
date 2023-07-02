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
});


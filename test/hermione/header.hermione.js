const {assert} = require('chai');

const basename = '/hw/store';

describe('Тесты навигации', async function () {
  it('Бургер меню на 576px', async function ({browser}) {
    const puppeteer = await browser.getPuppeteer();
    const [page] = await puppeteer.pages();
    await page.goto('http://localhost:3000/hw/store')
    await page.setViewport({
      width: 575,
      height: 1000,
    })
    await browser.assertView("plain", ".navbar")
  });

  it('Бургер меню закрывается при клике', async function ({browser}) {
    const puppeteer = await browser.getPuppeteer();
    const [page] = await puppeteer.pages()
    await page.goto('http://localhost:3000/hw/store')
    await page.setViewport({
      width: 575,
      height: 1000,
    })
    await page.click(".Application-Toggler")
    await page.click(".nav-link")
    await browser.assertView("plain", ".navbar")
  });
});


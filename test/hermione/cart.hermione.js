const axios = require('axios');

const {assert} = require('chai');
const basename = '/hw/store';

describe('Тесты каталога', async function () {
  it('Заказ создается на сервере', async () => {
    await axios.post(`http://localhost:3000/hw/store/api/checkout`, {
        form: {
          name: '',
          address: '',
          phone: '',
        }, cart:
          {
            5: {
              name: '',
              price: 0,
              count: 0,
            }
          }
      },
    );
    const res = await axios.get(`http://localhost:3000/hw/store/api/orders`);
    assert.notEqual(res.data.length, 0);
  });
});


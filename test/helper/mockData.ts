import {commerce} from 'faker';

export const mockArray = [1, 1, 1, 1, 1].map((item, index) => {
  return {
    id: index,
    name: `${commerce.productAdjective()} ${commerce.product()}`,
    description: commerce.productDescription(),
    price: Number(commerce.price()),
    color: commerce.color(),
    material: commerce.productMaterial(),
  };
});

export const elem = mockArray[0];

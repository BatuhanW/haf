import Haf from '../src';
import { DogSchema } from './types';

describe('Type tests', () => {
  describe('get', () => {
    const haf: Haf<DogSchema> = new Haf({
      name: 'pop',
      defaultSchema: {
        name: 'Pop',
        age: 2,
        appearance: {
          eyeColor: 'brown',
          hairColor: {
            primary: 'white',
            otherColors: ['pink'],
          },
          birthMarks: ['head'],
        },
        favoriteToys: ['socks', 'toilet_paper'],
        hasPuppies: false,
        luckyNumbers: [4, 2],
        vaccines: [
          { name: 'rabies', date: '2020-01-22', next: { date: '2020-07-22' } },
          { name: 'parasite', date: '2020-01-22' },
        ],
        sterilizedAt: undefined,
      },
    });

    // $ExpectTypeSnapshot name
    haf.get('name');

    // $ExpectTypeSnapshot age
    haf.get('age');

    // $ExpectTypeSnapshot appearance
    haf.get('appearance');

    // $ExpectTypeSnapshot birthMarks
    haf.get('appearance.birthMarks');

    // $ExpectTypeSnapshot eyeColor
    haf.get('appearance.eyeColor');

    // $ExpectTypeSnapshot hairColor
    haf.get('appearance.hairColor');

    // $ExpectTypeSnapshot otherColors
    haf.get('appearance.hairColor.otherColors');

    // $ExpectTypeSnapshot primary
    haf.get('appearance.hairColor.primary');

    // $ExpectTypeSnapshot secondary
    haf.get('appearance.hairColor.secondary');

    // $ExpectTypeSnapshot noseColor
    haf.get('appearance.noseColor');

    // $ExpectTypeSnapshot favoriteToys
    haf.get('favoriteToys');

    // $ExpectTypeSnapshot hasPuppies
    haf.get('hasPuppies');

    // $ExpectTypeSnapshot luckNumbers
    haf.get('luckyNumbers');

    // $ExpectTypeSnapshot sterilizedAt
    haf.get('sterilizedAt');

    // $ExpectTypeSnapshot vaccines
    haf.get('vaccines');

    // $ExpectTypeSnapshot vaccines[0]
    haf.get('vaccines')[0];
  });
});

import Haf from '../src';
import { DogSchema } from './types';

describe('Type tests', () => {
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

  describe('get', () => {
    // $ExpectTypeSnapshot getName
    haf.get('name');

    // $ExpectTypeSnapshot getAge
    haf.get('age');

    // $ExpectTypeSnapshot getAppearance
    haf.get('appearance');

    // $ExpectTypeSnapshot getBirthMarks
    haf.get('appearance.birthMarks');

    // $ExpectTypeSnapshot getEyeColor
    haf.get('appearance.eyeColor');

    // $ExpectTypeSnapshot getHairColor
    haf.get('appearance.hairColor');

    // $ExpectTypeSnapshot getOtherColors
    haf.get('appearance.hairColor.otherColors');

    // $ExpectTypeSnapshot getPrimary
    haf.get('appearance.hairColor.primary');

    // $ExpectTypeSnapshot getSecondary
    haf.get('appearance.hairColor.secondary');

    // $ExpectTypeSnapshot getNoseColor
    haf.get('appearance.noseColor');

    // $ExpectTypeSnapshot getFavoriteToys
    haf.get('favoriteToys');

    // $ExpectTypeSnapshot getHasPuppies
    haf.get('hasPuppies');

    // $ExpectTypeSnapshot getLuckNumbers
    haf.get('luckyNumbers');

    // $ExpectTypeSnapshot getSterilizedAt
    haf.get('sterilizedAt');

    // $ExpectTypeSnapshot getVaccines
    haf.get('vaccines');

    // $ExpectTypeSnapshot getVaccines[0]
    haf.get('vaccines')[0];

    // @ts-expect-error: Getting a key that doesn't exist
    // $ExpectTypeSnapshot getError
    haf.get('non-existent');
  });
});

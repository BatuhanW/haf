import Haf from '../src';
import { DogSchema } from './types';

describe('Haf', () => {
  let haf: Haf<DogSchema>;

  afterEach(() => {
    haf.nuke();
  });

  describe('when Haf initiated for the second time', () => {
    it('shouldnt overwrite existing config', () => {
      haf = new Haf({ name: 'pop', defaultSchema: { name: 'pop' } });

      expect(haf.get('name')).toEqual('pop');

      haf.set('name', 'pop2');

      expect(haf.get('name')).toEqual('pop2');

      haf = new Haf({ name: 'pop', defaultSchema: { name: 'pop' } });

      expect(haf.get('name')).toEqual('pop2');
    });
  });

  describe('get()', () => {
    beforeEach(() => {
      haf = new Haf({
        name: 'pop',
        defaultSchema: {
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
          name: 'Pop',
          vaccines: [
            { name: 'rabies', date: '2020-01-22', next: { date: '2020-07-22' } },
            { name: 'parasite', date: '2020-01-22' },
          ],
          sterilizedAt: undefined,
        },
      });
    });

    it('number', async () => {
      expect(haf.get('age')).toEqual(2);
    });

    describe('object', () => {
      it('itself', () => {
        expect(haf.get('appearance')).toEqual({
          eyeColor: 'brown',
          hairColor: {
            primary: 'white',
            otherColors: ['pink'],
          },
          birthMarks: ['head'],
        });
      });

      it('string', () => {
        expect(haf.get('appearance.eyeColor')).toEqual('brown');
      });

      it('undefined', () => {
        expect(haf.get('appearance.noseColor')).toBeUndefined();
      });

      it('string[]', () => {
        expect(haf.get('appearance.birthMarks')).toEqual(['head']);
      });

      describe('object level 2', () => {
        it('itself', () => {
          expect(haf.get('appearance.hairColor')).toEqual({
            primary: 'white',
            otherColors: ['pink'],
          });
        });

        it('string', () => {
          expect(haf.get('appearance.hairColor.primary')).toEqual('white');
        });

        it('undefined', () => {
          expect(haf.get('appearance.hairColor.secondary')).toBeUndefined();
        });

        it('string[]', () => {
          expect(haf.get('appearance.hairColor.otherColors')).toEqual(['pink']);
        });
      });
    });

    it('boolean', () => {
      expect(haf.get('hasPuppies')).toEqual(false);
    });

    it('string array', () => {
      expect(haf.get('favoriteToys')).toEqual(['socks', 'toilet_paper']);
    });

    it('number array', () => {
      expect(haf.get('luckyNumbers')).toEqual([4, 2]);
    });

    it('string', () => {
      expect(haf.get('name')).toEqual('Pop');
    });

    it('object array', () => {
      expect(haf.get('vaccines')).toEqual([
        { name: 'rabies', date: '2020-01-22', next: { date: '2020-07-22' } },
        { name: 'parasite', date: '2020-01-22', next: undefined },
      ]);
    });

    it('undefined', () => {
      expect(haf.get('sterilizedAt')).toBeUndefined();
    });
  });

  describe('set()', () => {
    beforeEach(() => {
      haf = new Haf({
        name: 'pop',
      });
    });

    it('string', () => {
      haf.set('name', 'Popita');

      expect(haf.get('name')).toEqual('Popita');
    });

    it('number', () => {
      haf.set('age', 2);

      expect(haf.get('age')).toEqual(2);
    });

    it('boolean', () => {
      haf.set('hasPuppies', true);

      expect(haf.get('hasPuppies')).toEqual(true);
    });

    it('undefined', () => {
      haf.set('sterilizedAt', undefined);

      expect(haf.get('sterilizedAt')).toBeUndefined();
    });

    it('string array', () => {
      haf.set('favoriteToys', ['socks']);

      expect(haf.get('favoriteToys')).toEqual(['socks']);
    });

    it('number array', () => {
      haf.set('luckyNumbers', [42]);

      expect(haf.get('luckyNumbers')).toEqual([42]);
    });

    describe('object', () => {
      const appearance = {
        eyeColor: 'brown',
        hairColor: { primary: 'white', otherColors: ['pink'] },
        birthMarks: ['head'],
      };

      it('itself', () => {
        haf.set('appearance', appearance);

        expect(haf.get('appearance')).toEqual({
          eyeColor: 'brown',
          hairColor: { primary: 'white', otherColors: ['pink'] },
          birthMarks: ['head'],
        });
      });

      describe('object level 2', () => {
        it('itself', () => {
          haf.set('appearance', appearance);

          haf.set('appearance.hairColor', {
            primary: 'orange',
            secondary: 'black',
            otherColors: ['red'],
          });

          expect(haf.get('appearance.hairColor')).toEqual({
            primary: 'orange',
            secondary: 'black',
            otherColors: ['red'],
          });
        });

        it('string', () => {
          haf.set('appearance', appearance);

          haf.set('appearance.hairColor.primary', 'black');

          expect(haf.get('appearance.hairColor.primary')).toEqual('black');
        });

        it('string[]', () => {
          haf.set('appearance', appearance);

          haf.set('appearance.hairColor.otherColors', ['blue']);

          expect(haf.get('appearance.hairColor.otherColors')).toEqual(['blue']);
        });
      });
    });
  });

  describe('append()', () => {
    beforeEach(() => {
      haf = new Haf({
        name: 'pop',
        defaultSchema: {
          favoriteToys: ['toilet paper'],
          luckyNumbers: [4],
          vaccines: [{ name: 'rabies', date: '2020-01-22', next: { date: '2020-07-22' } }],
          appearance: {
            eyeColor: 'brown',
            hairColor: {
              primary: 'white',
              otherColors: ['pink'],
            },
            birthMarks: ['head'],
          },
        },
      });
    });

    it('appends string', () => {
      haf.append('favoriteToys', 'socks', 'ball');

      expect(haf.get('favoriteToys')).toEqual(['toilet paper', 'socks', 'ball']);
    });

    it('appends number', () => {
      haf.append('luckyNumbers', 2);

      expect(haf.get('luckyNumbers')).toEqual([4, 2]);
    });

    it('appends object', () => {
      haf.append('vaccines', { name: 'parasite', date: '2020-01-22' });

      expect(haf.get('vaccines')).toEqual([
        { name: 'rabies', date: '2020-01-22', next: { date: '2020-07-22' } },
        { name: 'parasite', date: '2020-01-22' },
      ]);
    });

    describe('object level 1', () => {
      it('appends string', () => {
        haf.append('appearance.birthMarks', 'tail');

        expect(haf.get('appearance.birthMarks')).toEqual(['head', 'tail']);
      });

      describe('object level 2', () => {
        it('appends string', () => {
          haf.append('appearance.hairColor.otherColors', 'blue');

          expect(haf.get('appearance.hairColor.otherColors')).toEqual(['pink', 'blue']);
        });
      });
    });
  });

  describe('delete()', () => {
    const defaultSchema = {
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
      name: 'Pop',
      vaccines: [
        { name: 'rabies', date: '2020-01-22', next: { date: '2020-07-22' } },
        { name: 'parasite', date: '2020-01-22' },
      ],
    };

    beforeEach(() => {
      haf = new Haf({
        name: 'pop',
        defaultSchema,
      });
    });

    it('undefined', () => {
      haf.delete('sterilizedAt');

      expect(haf.store).toEqual({ ...defaultSchema, sterilizedAt: undefined });
    });
  });

  describe('reset()', () => {
    describe('when default schema provided', () => {
      const defaultSchema = {
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
        name: 'Pop',
        vaccines: [
          { name: 'rabies', date: '2020-01-22', next: { date: '2020-07-22' } },
          { name: 'parasite', date: '2020-01-22' },
        ],
      };

      beforeEach(() => {
        haf = new Haf({
          name: 'pop',
          defaultSchema,
        });
      });

      describe('when path *is not* provided', () => {
        it('resets schema to default values', () => {
          haf.set('name', 'Pop2');
          haf.set('favoriteToys', ['human hands']);
          haf.set('hasPuppies', true);
          haf.set('luckyNumbers', [42]);
          haf.set('vaccines', []);
          haf.set('appearance.noseColor', 'face');
          haf.set('appearance.eyeColor', 'blue');
          haf.set('appearance.hairColor.primary', 'orange');
          haf.set('appearance.hairColor.secondary', 'black');

          expect(haf.store).not.toEqual(defaultSchema);

          haf.reset();

          expect(haf.store).toEqual(defaultSchema);
        });
      });

      describe('when path provided', () => {
        it('resets **only** given path to its default value', () => {
          haf.set('name', 'Popita');
          haf.set('age', 3);

          haf.reset('name');

          expect(haf.store).toEqual({ ...defaultSchema, age: 3 });
        });
      });
    });

    describe('when default schema *is not* provided', () => {
      beforeEach(() => {
        haf = new Haf({
          name: 'pop',
        });
      });

      describe('when path *is not* provided', () => {
        it('resets to an empty object', () => {
          haf.set('name', 'popita');
          haf.set('age', 2);

          haf.reset();

          expect(haf.store).toEqual({});
        });
      });

      describe('when path provided', () => {
        it('resets to undefined', () => {
          haf.set('name', 'popitarella');
          haf.set('age', 2);
          haf.set('appearance', {
            eyeColor: 'orange',
            hairColor: { primary: 'orange', secondary: 'black', otherColors: ['pink'] },
            noseColor: 'face',
            birthMarks: ['head'],
          });

          haf.reset('name');
          haf.reset('appearance.noseColor');
          haf.reset('appearance.hairColor.secondary');

          expect(haf.get('name')).toBeUndefined();
          expect(haf.get('appearance.noseColor')).toBeUndefined();
          expect(haf.get('appearance.hairColor.secondary')).toBeUndefined();
        });
      });
    });
  });
});

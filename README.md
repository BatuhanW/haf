# 🧠 🔒 Haf 🦺 ✏️

![CI](https://github.com/BatuhanW/haf/workflows/main/badge.svg)
[![Maintainability](https://api.codeclimate.com/v1/badges/4315aa36678fe4181b77/maintainability)](https://codeclimate.com/github/BatuhanW/haf/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/4315aa36678fe4181b77/test_coverage)](https://codeclimate.com/github/BatuhanW/haf/test_coverage)
[![Dependencies](https://status.david-dm.org/gh/batuhanw/haf.svg)](https://status.david-dm.org/gh/batuhanw/haf)
[![Dev Dependencies](https://status.david-dm.org/gh/batuhanw/haf.svg?type=dev)](https://status.david-dm.org/gh/batuhanw/haf)


Haf is a fully typed 🔒, cross-platform, persistent 💾 config ⚙️ solution for your NodeJS projects with a great developer experience!

- ✏️ Auto-completed dot-notation suggestions as you type when you try to get()/set()/delete()/reset() data from the store.
- ✅ The type of the value you get() from the store is correctly inferred. So you always know what you'll get().
- ❌ Non-nullable values aren't suggested on delete(). Trying to delete() a non-nullable field will throw a type error.

> [Go to gifs section to see it in action!](###Gifs)

## Installation

```
npm i @batuhanw/haf

OR

yarn add @batuhanw/haf
```

## 🏃 Getting Started

### 1. Define Your Schema

```typescript
interface DogSchema {
  name: string;
  age: number;
  toys: string[];
  vaccines: { name: string; date: string; nextDate?: string }[];
  sterilizedAt?: string;
  hasPuppies: boolean;
}
```

### 2. Initiate Haf

```typescript
import Haf from '@batuhanw/haf'

const haf = new Haf<DogSchema>(
  {
    name: 'myDog',
    defaultSchema: {
      name: 'Pop',
      age: 2,
      toys: ['socks', 'toilet paper'],
      vaccines: [
        { name: 'rabbies', date: '2020-01-01' },
        { name: 'parasite', date: '2020-01-01', next: '2020-01-03' }
      ],
      hasPuppies: false,
      appearance: {
        eyeColor: string;
        hairColor: {
          primary: string;
          secondary?: string;
        }
      }
      sterilizedAt?: string;
    }
  }
)
```

### 3. Enjoy

#### Get

```typescript
  const name = haf.get('name') // string
  const age = haf.get('age') // number
  const hasPuppies = haf.get('hasPuppies') // boolean
  const vaccines = haf.get('vaccines') // { name: string; date: string; nextDate?: string }[]
  const hairColor: haf.get('appearance.haircolor') // { primary: string; secondary?: string }
  const secondaryHairColor: haf.get('appearance.hairColor.secondary') // string | undefined

  const invalid = haf.get('non-existent') // type error
```

#### Set

```typescript
  haf.set('name', 'Pop');
  haf.set('appearance.hairColor', { primary: 'white' });
  haf.set('appearance.hairColor.secondary', 'brown');
  haf.set('appearance.hairColor.secondary', undefined);

  haf.set('name', 1); // type error
  haf.set('toys', [1, 2]); // type error
  haf.set('appearance.haircolor', { primary: 1 }); //type error
  haf.set('appearance.hairColor.primary', 1); // type error
  haf.set('appearance.haircolor', { notExist: 'white' }); //type error
```

#### Delete

```typescript
  haf.delete('sterilizedAt')
  haf.delete('appearance.hairColor.secondary')

  haf.delete('name') // type error
  haf.delete('appearance.hairColor.primary') // type error
```

### Gifs

#### Get
![](https://github.com/BatuhanW/Haf/blob/master/get.gif)

#### Set

![](https://github.com/BatuhanW/Haf/blob/master/set.gif)

#### Delete

![](https://github.com/BatuhanW/Haf/blob/master/delete.gif)

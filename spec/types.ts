interface Vaccine {
  name: string;
  date: string;
  next?: { date: string };
}

interface Appearance {
  eyeColor: string;
  hairColor: {
    primary: string;
    secondary?: string;
    otherColors: string[];
  };
  noseColor?: string;
  birthMarks: string[];
}

export interface DogSchema {
  name: string;
  age: number;
  favoriteToys: string[];
  luckyNumbers: number[];
  vaccines: Vaccine[];
  appearance: Appearance;
  sterilizedAt?: string;
  hasPuppies: boolean;
}

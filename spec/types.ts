interface Vaccine {
  name: string;
  date: string;
  next?: { date: string };
}

export interface DogSchema {
  name: string;
  age: number;
  favoriteToys: string[];
  luckyNumbers: number[];
  vaccines: Vaccine[];
  appearance: {
    eyeColor: string;
    hairColor: {
      primary: string;
      secondary?: string;
      otherColors: string[];
    };
    noseColor?: string;
    birthMarks: string[];
  };
  sterilizedAt?: string;
  hasPuppies: boolean;
}

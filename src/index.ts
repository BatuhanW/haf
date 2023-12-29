import { pathExistsSync, readJsonSync, writeJsonSync, removeSync } from 'fs-extra';

import { getConfigPath } from './get-config-path';
import type { FlattenedWithDotNotation, OptionalKeysOf, StringKeysOf, ArrayKeysOf } from './types';

interface Options<Schema> {
  name: string;
  extension?: string;
  defaultSchema?: Partial<Schema>;
}

class Haf<Schema, FlattenedSchema = FlattenedWithDotNotation<Schema>> {
  readonly #options: Readonly<Options<Schema>>;
  private configPath: string;

  readonly #defaultOptions: Readonly<Options<Schema>> = {
    name: 'haf',
    extension: '',
    defaultSchema: {},
  };

  constructor(options: Options<Schema>) {
    this.#options = Object.assign(this.#defaultOptions, options);
    this.configPath = getConfigPath(this.#options.name, this.#options.extension);

    this.initializeStore();
  }

  private initializeStore() {
    if (pathExistsSync(this.configPath)) return;

    writeJsonSync(this.configPath, this.#options.defaultSchema);
  }

  get store(): Schema | Partial<Schema> {
    return readJsonSync(this.configPath);
  }

  set store(schema: Schema | Partial<Schema>) {
    writeJsonSync(this.configPath, schema);
  }

  get<Path extends StringKeysOf<FlattenedSchema>>(path: Path): FlattenedSchema[Path] {
    return this._get(path);
  }

  set<Path extends StringKeysOf<FlattenedSchema>>(path: Path, value: FlattenedSchema[Path]): void {
    this._set(path, value);
  }

  append<
    Path extends ArrayKeysOf<FlattenedSchema>,
    Values extends Extract<FlattenedSchema[Path], unknown[]>,
  >(path: Path, ...values: Values): void {
    const existingValues = this._get<Path, Values>(path);

    existingValues.push(...values);

    this._set(path, existingValues);
  }

  delete(path: OptionalKeysOf<FlattenedSchema>): void {
    this._set(path, undefined);
  }

  reset(path?: StringKeysOf<FlattenedSchema>): void {
    if (typeof path === 'undefined') {
      this.store = this.#defaultOptions.defaultSchema || {};

      return;
    }

    const defaultValue = this._get(path, this.#defaultOptions.defaultSchema);

    this._set(path, defaultValue);
  }

  nuke(): void {
    removeSync(this.configPath);
  }

  private _get<Path extends StringKeysOf<FlattenedSchema>, Returns = FlattenedSchema[Path]>(
    path: Path,
    source?: Partial<Schema>,
  ): Returns {
    const keys = path.split('.');

    let result: any = source ? source : this.store;

    for (let i = 0; i < keys.length; i++) {
      result = result?.[keys[i]];
    }

    return result as Returns;
  }

  private _set<Path extends StringKeysOf<FlattenedSchema>>(
    path: Path,
    value?: FlattenedSchema[Path],
  ) {
    const keys = path.split('.');

    const result = this.store;

    keys.reduce((obj, key) => {
      if (keys.findIndex((k) => k === key) === keys.length - 1) {
        (obj as any)[key] = value;
      } else {
        return (obj as any)[key];
      }
    }, result);

    this.store = result;
  }
}

export default Haf;

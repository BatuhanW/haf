import { pathExistsSync, readJsonSync, writeJsonSync, removeSync } from 'fs-extra';

import { getStorePath } from './get-store-path';
import type { FlattenedWithDotNotation, OptionalKeysOf, StringKeysOf, ArrayKeysOf } from './types';

interface HafConfig<Schema> {
  /**
   * @description name of the store file.
   * @required
   */
  name: string;
  /**
   * @description extension of the store file.
   * @optional
   * @default haf
   * @file /path/to/store/storeName.**haf**
   */
  extension?: string;
  /**
   * @description default JSON object to use when initializing the store.
   * @optional
   * @default {}
   */
  defaultSchema?: Partial<Schema>;
  /**
   * @description directory for the store file.
   * @default checks the environment variables in the following order:
   * - process.env.CONFIG_DIR // unix
   * - process.env.XDG_CONFIG_HOME // unix
   * - process.env.LOCALAPPDATA // windows
   * fallback:
   * - os.homedir() + '/.config'
   * @optional
   */
  storeDir?: string;
}

class Haf<Schema, FlattenedSchema = FlattenedWithDotNotation<Schema>> {
  private storePath: string;
  private defaultSchema: Partial<Schema>;

  constructor(config: HafConfig<Schema>) {
    this.storePath = getStorePath(config.name, config.extension, config.storeDir);
    this.defaultSchema = config.defaultSchema ?? {};

    this.initializeStore();
  }

  private initializeStore() {
    if (pathExistsSync(this.storePath)) return;

    writeJsonSync(this.storePath, this.defaultSchema);
  }

  get store(): Schema | Partial<Schema> {
    return readJsonSync(this.storePath);
  }

  set store(schema: Schema | Partial<Schema>) {
    writeJsonSync(this.storePath, schema);
  }

  /**
   * @description returns the value at the provided path.
   * @param path
   * @example
   * ```typescript
   *  const haf = new Haf<DogSchema>({
   *    name: 'dog',
   *    defaultSchema: {
   *      name: 'Popita'
   *    }
   *  })
   *
   * haf.get('name') // Popita
   * ```
   */
  get<Path extends StringKeysOf<FlattenedSchema>>(path: Path): FlattenedSchema[Path] {
    return this._get(path);
  }

  /**
   * @description sets the value to the provided path.
   * @param path
   * @param value
   * @example
   * ```typescript
   * const haf = new Haf<DogSchema>({
   *  name: 'dog',
   * })
   *
   * haf.set('name', 'Popita')
   * ```
   */
  set<Path extends StringKeysOf<FlattenedSchema>>(path: Path, value: FlattenedSchema[Path]): void {
    this._set(path, value);
  }

  /**
   * @description appends the provided values to the array at the provided path.
   * @param path
   * @param ...values
   * @example
   * ```typescript
   * const haf = new Haf<DogSchema>({
   *   name: 'dog',
   * })
   *
   * haf.set('favoriteToys', ['ball', 'bone'])
   *
   * haf.append('favoriteToys', 'socks', 'toilet paper')
   *
   * haf.get('favoriteToys') // ['ball', 'bone', 'socks', 'toilet paper']
   * ```
   */
  append<
    Path extends ArrayKeysOf<FlattenedSchema>,
    Values extends Extract<FlattenedSchema[Path], unknown[]>,
  >(path: Path, ...values: Values): void {
    const existingValues = this._get<Path, Values>(path);

    existingValues.push(...values);

    this._set(path, existingValues);
  }

  /**
   * @description sets the value of the provided path to undefined.
   */
  delete(path: OptionalKeysOf<FlattenedSchema>): void {
    this._set(path, undefined);
  }

  /**
   * @description resets the store to defaultSchema values. Sets fields to undefined if not provided in defaultSchema.
   * @param path optional path to reset. if not provided, the entire store will be reset.
   * @example
   * ```typescript
   * const haf = new Haf<DogSchema>({
   * name: 'dog',
   * defaultSchema: {
   *  name: 'pop',
   * });
   *
   * haf.set('name', 'pup');
   *
   * haf.reset('name');
   *
   * haf.get('name'); // pop
   *
   * haf.set('age', 3)
   *
   * haf.reset('age')
   *
   * haf.get('age') // undefined
   * ```
   */
  reset(path?: StringKeysOf<FlattenedSchema>): void {
    if (typeof path === 'undefined') {
      this.store = this.defaultSchema;

      return;
    }

    const defaultValue = this._get(path, this.defaultSchema);

    this._set(path, defaultValue);
  }

  /**
   * @description removes the store file from the file system.
   */
  nuke(): void {
    removeSync(this.storePath);
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

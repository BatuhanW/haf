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

    this.upsertSchema();
  }

  private upsertSchema() {
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

  append<Path extends ArrayKeysOf<FlattenedSchema>>(
    path: Path,
    ...values: FlattenedSchema[Path]
  ): void {
    const existingValues = this._get(path);

    const result = [...existingValues, ...values];

    this._set(path, result as FlattenedSchema[Path]);
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

  private _get<Path extends StringKeysOf<FlattenedSchema>>(
    path: Path,
    source?: Partial<Schema>
  ): FlattenedSchema[Path] {
    const keys = path.split('.');

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let result: any = source ? source : this.store;

    for (let i = 0; i < keys.length; i++) {
      result = result?.[keys[i]];
    }

    return result as FlattenedSchema[Path];
  }

  private _set<Path extends StringKeysOf<FlattenedSchema>>(
    path: Path,
    value?: FlattenedSchema[Path]
  ) {
    const keys = path.split('.');

    const result = this.store;

    keys.reduce((obj, key) => {
      if (keys.findIndex((k) => k === key) === keys.length - 1) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (obj as any)[key] = value;
      } else {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return (obj as any)[key];
      }
    }, result);

    this.store = result;
  }
}

export default Haf;

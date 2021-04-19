// eslint-disable-next-line @typescript-eslint/no-explicit-any
type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (k: infer I) => void
  ? I
  : never;

/**
 * Returns the intersection of all values of the object T. Example:
 * ```
 * IntersectValuesOf<{ foo: Foo, bar: Bar }> = Foo & Bar
 * ```
 */
type IntersectValuesOf<T> = UnionToIntersection<T[keyof T]>;

type AddPrefix<TKey extends string, Prefix> = Prefix extends string ? `${Prefix}.${TKey}` : TKey;

/**
 * Flattens an object type to a single object with dot notation for keys. Example:
 * ```
 * DotNotationMap<{ foo: { bar: number }, foo2: string }> = { foo: { bar: number }, "foo.bar": number, foo2: string }
 * ```
 */
export type FlattenedWithDotNotation<Schema, Prefix = null> =
  /* first, simply output the keys with prefix and their types: */
  { [K in string & keyof Schema as AddPrefix<K, Prefix>]: Schema[K] } & // see https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-1.html#key-remapping-in-mapped-types
    /* then, for each sub-object, recurse */
    IntersectValuesOf<
      {
        [K in string & keyof Schema as AddPrefix<K, Prefix>]: Schema[K] extends Record<
          string,
          // eslint-disable-next-line
          any
        >
          ? FlattenedWithDotNotation<Schema[K], AddPrefix<K, Prefix>>
          : never;
      }
    >;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type PrimitiveTypes = string | number | boolean | any[] | Record<string, unknown>;

export type StringKeysOf<Schema> = keyof Schema & string;

type ExtractKeysIn<Schema, Type> = keyof Pick<
  Schema,
  {
    [K in keyof Schema]: Schema[K] extends Type ? K : never;
  }[keyof Schema]
>;

export type OptionalKeysOf<Schema> = Exclude<
  StringKeysOf<Schema>,
  ExtractKeysIn<Schema, PrimitiveTypes>
>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ArrayKeysOf<Schema> = Extract<StringKeysOf<Schema>, ExtractKeysIn<Schema, any[]>>;

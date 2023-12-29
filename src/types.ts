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
  {
    [K in string & keyof Schema as AddPrefix<K, Prefix>]: Schema[K];
  } /* then, for each sub-object, recurse */ & IntersectValuesOf<{
    // see https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-1.html#key-remapping-in-mapped-types
    // Since Array type also satisfies `object`, excluding it before starting recursion for `object` type.
    [K in string & keyof Schema as AddPrefix<K, Prefix>]: Schema[K] extends Array<any>
      ? never
      : Schema[K] extends object
        ? FlattenedWithDotNotation<Schema[K], AddPrefix<K, Prefix>>
        : never;
  }>;

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

export type ArrayKeysOf<Schema> = StringKeysOf<Schema> & ExtractKeysIn<Schema, any[]>;

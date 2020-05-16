export type Primitive = string | number | boolean | bigint | symbol | undefined | null;
export type Builtin = Primitive | Function | Date | Error | RegExp;

export type DeepReadonly<T> =
  T extends Builtin ? T
  : T extends Map<infer K, infer V> ? ReadonlyMap<DeepReadonly<K>, DeepReadonly<V>>
  : T extends ReadonlyMap<infer K, infer V> ? ReadonlyMap<DeepReadonly<K>, DeepReadonly<V>>
  : T extends Set<infer U> ? ReadonlySet<DeepReadonly<U>>
  : T extends ReadonlySet<infer U> ? ReadonlySet<DeepReadonly<U>>
  : T extends Promise<infer U> ? Promise<DeepReadonly<U>>
  : T extends {} ? { readonly [K in keyof T]: DeepReadonly<T[K]> }
  : Readonly<T>;

export type Writable<T> = { -readonly [P in keyof T]: T[P] };

export type DeepWritable<T> =
  T extends Builtin ? T
  : T extends Map<infer K, infer V> ? Map<DeepWritable<K>, DeepWritable<V>>
  : T extends ReadonlyMap<infer K, infer V> ? Map<DeepWritable<K>, DeepWritable<V>>
  : T extends Set<infer U> ? Set<DeepWritable<U>>
  : T extends ReadonlySet<infer U> ? Set<DeepWritable<U>>
  : T extends Promise<infer U> ? Promise<DeepWritable<U>>
  : T extends {} ? { -readonly [K in keyof T]: DeepWritable<T[K]> }
  : T;
/* eslint-disable import/no-unused-modules */
export type MaybePromise<T> = T | Promise<T>

export type ValueOf<Type> = Type extends ReadonlyArray<infer Value>
  ? Value
  : Type[keyof Type]

export type UnknownRecord = Record<PropertyKey, unknown>

export type LoosePick<Shape, Keys extends PropertyKey> = {
  [Key in Keys]: Shape extends Record<Key, infer Value> ? Value : never
}

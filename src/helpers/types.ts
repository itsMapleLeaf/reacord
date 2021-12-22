/* eslint-disable import/no-unused-modules */
export type MaybePromise<T> = T | Promise<T>

export type ValueOf<Type> = Type extends ReadonlyArray<infer Value>
  ? Value
  : Type[keyof Type]

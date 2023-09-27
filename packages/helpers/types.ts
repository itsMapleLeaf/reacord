import { raise } from "./raise.ts"

export type MaybePromise<T> = T | PromiseLike<T>

export type ValueOf<Type> = Type extends ReadonlyArray<infer Value>
	? Value
	: Type[keyof Type]

export type LoosePick<Shape, Keys extends PropertyKey> = Simplify<{
	[Key in Extract<Keys, keyof Shape>]: Shape[Key]
}>

export type LooseOmit<Shape, Keys extends PropertyKey> = Simplify<{
	[Key in Exclude<keyof Shape, Keys>]: Shape[Key]
}>

export type Simplify<T> = { [Key in keyof T]: T[Key] } & NonNullable<unknown>

export const typeEquals = <A, B>(
	_result: A extends B ? (B extends A ? true : false) : false,
) => raise("typeEquals() should not be called at runtime")

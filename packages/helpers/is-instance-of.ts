/** For narrowing instance types with array.filter */
export const isInstanceOf =
	<Instance, Args extends unknown[]>(
		constructor: new (...args: Args) => Instance,
	) =>
	(value: unknown): value is Instance =>
		value instanceof constructor

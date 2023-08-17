/** A typesafe version of toUpperCase */
export function toUpper<S extends string>(string: S) {
	return string.toUpperCase() as Uppercase<S>
}

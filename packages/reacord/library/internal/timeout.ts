export class Timeout {
	private timeoutId?: NodeJS.Timeout

	constructor(
		private readonly time: number,
		private readonly callback: () => void,
	) {}

	run() {
		this.cancel()
		this.timeoutId = setTimeout(this.callback, this.time)
	}

	cancel() {
		if (this.timeoutId) {
			clearTimeout(this.timeoutId)
			this.timeoutId = undefined
		}
	}
}

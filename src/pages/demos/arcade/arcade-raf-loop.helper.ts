export type IArcadeFrameCallback = (deltaMs: number) => void;

/** Single-owner RAF loop: components start it explicitly and stop it on reset/destroy. */
export class ArcadeRafLoop {
	private _frameId: number | null = null;
	private _lastTimestamp: number | null = null;

	constructor(private readonly _onFrame: IArcadeFrameCallback) {}

	start(): void {
		if (this.running() || typeof globalThis.requestAnimationFrame !== 'function') return;
		this._lastTimestamp = null;
		this._frameId = globalThis.requestAnimationFrame(this._frame);
	}

	stop(): void {
		if (this._frameId !== null && typeof globalThis.cancelAnimationFrame === 'function')
			globalThis.cancelAnimationFrame(this._frameId);
		this._frameId = null;
		this._lastTimestamp = null;
	}

	running(): boolean {
		return this._frameId !== null;
	}

	private readonly _frame = (timestamp: number): void => {
		if (this._frameId === null) return;
		const deltaMs = this._lastTimestamp === null
			? 0
			: Math.max(0, timestamp - this._lastTimestamp);
		this._lastTimestamp = timestamp;
		this._onFrame(deltaMs);
		if (this._frameId !== null)
			this._frameId = globalThis.requestAnimationFrame(this._frame);
	};
}

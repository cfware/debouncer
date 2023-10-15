export default class Debouncer {
    _lastRun = 0;
    _firstRequest = 0;
    _lastRequest = 0;

    constructor(callback, delay = 100, maxDelays = 2) {
        if (typeof callback !== 'function') {
            throw new TypeError('Function is required');
        }

        this._cb = callback;
        this._delay = delay;
        this._maxDelays = maxDelays;
    }

    _now() {
        this._lastRun = Date.now();
        this._cb();
        this.clear();
    }

    _later() {
        const now = Date.now();
        const delta = now - this._lastRequest;
        const totalDelta = now - this._firstRequest;
        const maxDelay = this._delay * this._maxDelays;
        const maxTimeout = Math.min(maxDelay - totalDelta, this._delay - delta);

        if (this._lastRun && maxTimeout > 0) {
            this._timeout = setTimeout(() => this._later(), maxTimeout);
        } else {
            this._now();
        }
    }

    run(immediately = false) {
        const now = Date.now();

        this._lastRequest = now;
        if (!this._firstRequest) {
            this._firstRequest = now;
        }

        if (immediately) {
            this._now();
        } else if (!this._timeout) {
            this._timeout = setTimeout(() => this._later(), this._delay);
        }
    }

    flush() {
        if (this._timeout) {
            this._now();
        }
    }

    clear() {
        this._firstRequest = 0;
        this._lastRequest = 0;
        this._timeout = clearTimeout(this._timeout);
    }
}

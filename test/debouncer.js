import test from 'ava';
import {Debouncer} from '..';

class TestObject {
	constructor(t, ...args) {
		this.runs = 0;
		this.t = t;
		this.d = new Debouncer(() => {
			this.runs++;
		}, ...args);
	}

	run() {
		this.d.run();
	}

	flush() {
		this.d.flush();
	}

	clear() {
		this.d.clear();
	}

	checkAfter(delay, expected) {
		return new Promise(resolve => {
			setTimeout(() => {
				this.t.is(this.runs, expected, `after ${delay}ms delay`);
				resolve();
			}, delay);
		});
	}
}

test('exports constructor', t => {
	t.is(typeof Debouncer, 'function');
	t.throws(() => new Debouncer(), 'Function is required');
	t.true(new Debouncer(() => {}) instanceof Debouncer);
});

test('single call to .run', t => {
	const d = new TestObject(t);

	d.run();

	return Promise.all([
		d.checkAfter(80, 0),
		d.checkAfter(120, 1),
		d.checkAfter(250, 1)
	]);
});

test('two calls to .run within first delay', t => {
	const d = new TestObject(t, 100);

	d.run();
	setTimeout(() => d.run(), 5);

	return Promise.all([
		d.checkAfter(80, 0),
		d.checkAfter(120, 1),
		d.checkAfter(250, 1)
	]);
});

test('two calls after first run', t => {
	const d = new TestObject(t);

	d.run();
	setTimeout(() => d.run(), 110);
	setTimeout(() => d.run(), 150);

	return Promise.all([
		d.checkAfter(80, 0),
		d.checkAfter(120, 1),
		d.checkAfter(230, 1),
		d.checkAfter(270, 2),
		d.checkAfter(370, 2)
	]);
});

test('flush without run', t => {
	const d = new TestObject(t);

	d.flush();

	return d.checkAfter(150, 0);
});

test('flush after run', t => {
	const d = new TestObject(t);

	d.run();
	setTimeout(() => d.flush(), 50);

	return Promise.all([
		d.checkAfter(30, 0),
		d.checkAfter(70, 1),
		d.checkAfter(150, 1)
	]);
});

test('clear without run', t => {
	const d = new TestObject(t);

	d.clear();

	return d.checkAfter(150, 0);
});

test('clear during delay', t => {
	const d = new TestObject(t);

	d.run();
	setTimeout(() => d.clear(), 50);

	return d.checkAfter(150, 0);
});

test('maximum delays', t => {
	const d = new TestObject(t, 100, 2);

	d.run();
	d.flush();
	d.run();
	// 1st delay to now + 160ms
	setTimeout(() => d.run(), 60);
	// 2nd delay to now + 240ms
	setTimeout(() => d.run(), 140);
	// The next two do not cause any further delay
	setTimeout(() => d.run(), 200);
	setTimeout(() => d.run(), 220);

	// Normal run at now + 360ms
	setTimeout(() => d.run(), 260);

	return Promise.all([
		d.checkAfter(220, 1),
		d.checkAfter(260, 2),
		d.checkAfter(340, 2),
		d.checkAfter(380, 3),
		d.checkAfter(500, 3)
	]);
});

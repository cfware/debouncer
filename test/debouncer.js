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
		d.checkAfter(75, 0),
		d.checkAfter(125, 1),
		d.checkAfter(250, 1)
	]);
});

test('two calls to .run within first delay', t => {
	const d = new TestObject(t, 100);

	d.run();
	setTimeout(() => d.run(), 5);

	return Promise.all([
		d.checkAfter(75, 0),
		d.checkAfter(125, 1),
		d.checkAfter(250, 1)
	]);
});

test('two calls after first run', t => {
	const d = new TestObject(t);

	d.run();
	setTimeout(() => d.run(), 110);
	setTimeout(() => d.run(), 150);

	return Promise.all([
		d.checkAfter(75, 0),
		d.checkAfter(125, 1),
		d.checkAfter(225, 1),
		d.checkAfter(275, 2),
		d.checkAfter(375, 2)
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
		d.checkAfter(25, 0),
		d.checkAfter(75, 1),
		d.checkAfter(250, 1)
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

	return d.checkAfter(175, 0);
});

test('maximum delays', t => {
	const d = new TestObject(t, 100, 2);

	d.run();
	d.flush();
	d.run();
	// 1st delay to now + 175ms
	setTimeout(() => d.run(), 75);
	// 2nd delay to now + 250ms
	setTimeout(() => d.run(), 150);
	// The next two do not cause any further delay
	setTimeout(() => d.run(), 200);
	setTimeout(() => d.run(), 225);

	// Normal run at now + 375ms
	setTimeout(() => d.run(), 275);

	return Promise.all([
		d.checkAfter(225, 1),
		d.checkAfter(275, 2),
		d.checkAfter(350, 2),
		d.checkAfter(400, 3),
		d.checkAfter(500, 3)
	]);
});

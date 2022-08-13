import {promisify} from 'node:util';
import t from 'libtap';

import Debouncer from '@cfware/debouncer';

const delay = promisify(setTimeout);

class TestObject {
	constructor(t, ...args) {
		this.runs = 0;
		this.start = Date.now() + 2;
		this.t = t;
		this.d = new Debouncer(() => {
			this.runs++;
		}, ...args);
	}

	run(immediately) {
		this.d.run(immediately);
	}

	flush() {
		this.d.flush();
	}

	clear() {
		this.d.clear();
	}

	async checkAfter(ms, expected) {
		await delay(ms);

		this.t.equal(this.runs, expected, `after ${ms}ms delay`);
	}
}

t.test('exports constructor', async t => {
	t.type(Debouncer, 'function');
	t.throws(() => new Debouncer(), 'Function is required');
	t.type(new Debouncer(() => {}), Debouncer);
});

t.test('single call to .run', async t => {
	const d = new TestObject(t);

	d.run();

	return Promise.all([
		d.checkAfter(75, 0),
		d.checkAfter(125, 1),
		d.checkAfter(250, 1)
	]);
});

t.test('two calls to .run within first delay', async t => {
	const d = new TestObject(t, 100);

	d.run();
	setTimeout(() => d.run(), 5);

	return Promise.all([
		d.checkAfter(75, 0),
		d.checkAfter(125, 1),
		d.checkAfter(250, 1)
	]);
});

t.test('two calls after first run', async t => {
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

t.test('flush without run', async t => {
	const d = new TestObject(t);

	d.flush();

	return d.checkAfter(150, 0);
});

t.test('flush after run', async t => {
	const d = new TestObject(t);

	d.run();
	setTimeout(() => d.flush(), 50);

	return Promise.all([
		d.checkAfter(25, 0),
		d.checkAfter(75, 1),
		d.checkAfter(250, 1)
	]);
});

t.test('immediate flush', async t => {
	const d = new TestObject(t);

	d.run(true);

	return Promise.all([
		d.checkAfter(0, 1),
		d.checkAfter(250, 1)
	]);
});

t.test('clear without run', async t => {
	const d = new TestObject(t);

	d.clear();

	return d.checkAfter(150, 0);
});

t.test('clear during delay', async t => {
	const d = new TestObject(t);

	d.run();
	setTimeout(() => d.clear(), 50);

	return d.checkAfter(175, 0);
});

t.test('maximum delays', async t => {
	// 100ms minimum delay, 200ms maximum.
	const d = new TestObject(t, 100, 2);

	d.run();
	d.flush();

	// Initial schedule is for +100ms
	d.run();

	// This will defer to 160ms
	setTimeout(() => d.run(), 60);
	// This will defer to 200ms
	setTimeout(() => d.run(), 140);
	// The will not defer, already scheduled at 200ms / maximum delay.
	setTimeout(() => d.run(), 180);

	// This schedules for 320ms
	setTimeout(() => d.run(), 220);

	// This will defer to 380ms
	setTimeout(() => d.run(), 280);

	return Promise.all([
		d.checkAfter(180, 1),
		d.checkAfter(220, 2),
		d.checkAfter(360, 2),
		d.checkAfter(400, 3),
		d.checkAfter(500, 3)
	]);
});

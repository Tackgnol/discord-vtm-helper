import { expect } from 'chai';
import { checkArray, checkType } from './utils';

describe('Services >> Mappers >> utils >> checkType', () => {
	const obj = {
		number: 3,
		string: 'test',
		none: undefined,
	};

	it('does nothing when the type matches the expected type', () => {
		expect(() => {
			checkType(obj, 'number', 'number');
		}).to.not.throw(Error);
	});

	it('throws an error if there is a type mismatch', () => {
		expect(() => {
			checkType(obj, 'string', 'number');
		}).to.throw(Error);
	});

	it('throws an error if a propert is undefined', () => {
		expect(() => {
			checkType(obj, 'none', 'number');
		}).to.throw(Error);
	});

	it('throws an error on an non existing property', () => {
		expect(() => {
			checkType(obj, 'missing', 'number');
		}).to.throw(Error);
	});
});

describe('Services >> Mappers >> utils >> checkArray', () => {
	const arr = ['test1', 'test2', 'test3'];
	it('does nothing when object is an array of matching type', () => {
		expect(() => {
			checkArray(arr, 'string');
		}).to.not.throw(Error);
	});

	it('throws an error when object is an array of mismatched type', () => {
		expect(() => {
			checkArray(arr, 'number');
		}).to.throw(Error);
	});

	it('throws an error if object is not an array', () => {
		expect(() => {
			checkArray(3, 'number');
		}).to.throw(Error);
	});

	it('throws an error if object is a string', () => {
		expect(() => {
			checkArray('I should throw', 'string');
		}).to.throw(Error);
	});
});

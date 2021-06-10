export function checkType<T>(object: any, property: keyof T, expectedType: string) {
	if (typeof object[property] !== expectedType) {
		throw new Error(`Invalid ${property} property`);
	}
}

export const checkArray = (array: any, type: string) => {
	isArray(array);

	for (let i = 0; i < array.length; i++) {
		const item = array[i];
		if (typeof item !== type) {
			throw new Error(`Element of array ${array.toString()} on position ${i} has a unexpected type`);
		}
	}
};

export function mapArray<T>(array: any, mapper: (object: any) => T, required: boolean): T[] {
	if (required) {
		isArray(array);
		return array.map(mapper);
	}

	return array ? array.map(mapper) : array;
}

const isArray = (array: any) => {
	const isArray = Array.isArray(array);
	if (!isArray) {
		throw new Error(`Expected and array the item supplied was not an array`);
	}
};

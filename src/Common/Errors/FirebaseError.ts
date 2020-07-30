const errorName = 'FirebaseError';

class FirebaseError extends Error {
	constructor(args?: string) {
		super(args);
		this.name = errorName;
	}
}

export { FirebaseError, errorName };

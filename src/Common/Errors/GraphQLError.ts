const errorName = 'GraphQLError';

class GraphQLError extends Error {
	constructor(args?: string) {
		super(args);
		this.name = errorName;
	}
}

export { GraphQLError, errorName };

export class InvalidInputError extends Error {
	constructor(args? : string){
		super(args);
		this.name = "Invalid user input"
	}
}

export default InvalidInputError;

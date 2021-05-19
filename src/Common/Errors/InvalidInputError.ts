export class InvalidInputError extends Error {
	botMessage: string;
	constructor(botMessage: string, args?: string) {
		super(args);
		this.name = 'Invalid user input';
		this.botMessage = botMessage;
		this.message = botMessage;
	}
}

export default InvalidInputError;

const LocalFileService = require('./localFileService');
const GraphqlService = require('./graphqlService');

const initializeService = (serviceType) => {
	switch (serviceType) {
	case 'offline':
		return new LocalFileService();
	case 'graphql':
		return new GraphqlService();
	default:
		throw new Error('Invalid service type in config!');
	}
};

module.exports = initializeService;

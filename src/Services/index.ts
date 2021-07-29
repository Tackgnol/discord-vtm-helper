import LocalFileService from './localFileService';
import FirebaseService from './firebaseService';
import { IService } from './IService';

const initializeService = (serviceType: string): IService => {
	switch (serviceType) {
		case 'offline':
			return new LocalFileService();
		case 'firestore':
			return new FirebaseService();
		default:
			throw new Error('Invalid service type in config!');
	}
};

export default initializeService;

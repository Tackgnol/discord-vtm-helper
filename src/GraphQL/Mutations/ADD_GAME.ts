import gql from 'graphql-tag';

const ADD_GAME = gql`
	mutation AddGame($inputAdminId: String, $inputChannelId: String) {
		mutateGame(inputAdminId: $inputAdminId, inputChannelId: $inputChannelId) {
			game {
				activeChannel
				adminId
				current
				id
			}
		}
	}
`;

export default ADD_GAME;

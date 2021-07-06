import gql from 'graphql-tag';

const REMOVE_PLAYER = gql`
	mutation RemovePlayer($inputPlayerId: String, $inputGame: String) {
		removePlayer(inputPlayerId: $inputPlayerId, inputGame: $inputGame)
	}
`;

export default REMOVE_PLAYER;

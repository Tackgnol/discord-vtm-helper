import gql from 'graphql-tag';

const ADD_PLAYER = gql`
	mutation AddPlayer($discordId: Int, $name: String, $stats: [StatInput]) {
		createPlayer(discordId: $discordId, name: $name, stats: $stats) {
			player {
				name
				statisticsSet {
					name
					value
				}
				discordId
			}
		}
	}
`;

export default ADD_PLAYER;

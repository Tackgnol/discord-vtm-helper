import gql from 'graphql-tag';

const GET_PLAYER = gql`
	query getPlayer($playerId: String) {
		player(discordId: $playerId) {
			id
			discordUserName
			name
			filteredFacts {
				npc {
					name
					description
					image
					callName
				}
				facts
			}
		}
	}
`;
export default GET_PLAYER;

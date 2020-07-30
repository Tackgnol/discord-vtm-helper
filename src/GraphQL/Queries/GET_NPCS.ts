import gql from 'graphql-tag';

const GET_NPCS = gql`
	query getPlayerFacts($discordId: String) {
		player(discordId: $discordId) {
			filteredFacts {
				npc {
					name
					callName
					description
					image
				}
				facts
			}
		}
	}
`;
export default GET_NPCS;

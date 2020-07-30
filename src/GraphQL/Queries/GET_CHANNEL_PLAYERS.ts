import gql from 'graphql-tag';

const GET_CHANNEL_PLAYERS = gql`
	{
		allChannels {
			id
			discordId
			game {
				playerSet {
					name
					discordUserName
					statisticsSet {
						name
						value
					}
				}
			}
		}
	}
`;
export default GET_CHANNEL_PLAYERS;

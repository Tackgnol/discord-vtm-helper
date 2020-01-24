const gql = require('graphql-tag');

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
`
module.exports = GET_CHANNEL_PLAYERS;

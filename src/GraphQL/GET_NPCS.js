const gql = require('graphql-tag');

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

`
module.exports = GET_NPCS;

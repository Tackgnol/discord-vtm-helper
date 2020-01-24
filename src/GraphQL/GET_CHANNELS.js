const gql = require('graphql-tag');

const ALL_CHANNELS = gql`
    {
        allChannels {
            id
            discordId
            statinsightSet {
                name
                statName
                successMessage
                minValue
            }
            globaltestSet {
								name
                shortCircuit
                globaltestoptionSet {
                    minResult
                    resultMessage
                }
                testMessage
                replyPrefix
            }
            narrationeventSet {
                name
                narrationText
                image
            }
        }
    }
`
module.exports = ALL_CHANNELS;

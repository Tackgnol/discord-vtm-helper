import gql from 'graphql-tag';

const ADD_NPC = gql`
	mutation AddNPC($npcInput: NPCInput) {
		mutateNpc(npc: $npcInput) {
			npc {
				name
				description
				image
			}
		}
	}
`;

export default ADD_NPC;

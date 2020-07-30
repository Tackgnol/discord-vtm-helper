import gql from 'graphql-tag';

const ADD_NARRATION = gql`
	mutation AddNarration($inputNarration: NarrationEventInput) {
		mutateNarrationEvent(narrationEvent: $inputNarration) {
			event {
				name
				image
				narrationText
			}
		}
	}
`;

export default ADD_NARRATION;

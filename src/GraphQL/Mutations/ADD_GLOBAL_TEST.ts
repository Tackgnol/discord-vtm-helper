import gql from 'graphql-tag';

const ADD_GLOBAL_TEST = gql`
	mutation AddGlobalTestInput($inputTest: GlobalTestInput) {
		mutateGlobalTest(inputTest: $inputTest) {
			test {
				name
				testMessage
				shortCircuit
				replyPrefix
				optionList {
					resultMessage
					minResult
				}
			}
		}
	}
`;

export default ADD_GLOBAL_TEST;

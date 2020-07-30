import gql from 'graphql-tag';

const ADD_STAT_INSIGHT = gql`
	mutation AddStatInsight($testData: StatInsightInput) {
		mutateStatInsight(testData: $testData) {
			test {
				name
				successMessage
				minValue
			}
		}
	}
`;

export default ADD_STAT_INSIGHT;

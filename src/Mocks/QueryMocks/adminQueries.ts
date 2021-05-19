import { IEvent } from '../../Models/GameData';
import { settings } from '../../config/settings';

const {
	addPlayer,
	addNPC,
	addFact,
	addGlobalTest,
	addStatInsight,
	addNarration,
	assignAdmin,
} = settings.subPrefixes.adminSubCommands;

const adminCommand: Partial<IEvent> = {
	type: 'a',
	prefix: 'vtm',
};

export const successfulAddPlayerQueryList: Partial<IEvent> = {
	eventName: addPlayer,
	value: '[Dudette][409408071601881089][1,2,3,4,5,6]',
	...adminCommand,
};

export const successfulAddPlayerQueryObject: Partial<IEvent> = {
	eventName: addPlayer,
	value: '[Dudette][409408071601881089][{Occult:1,Investigation:2,Brawl:3}]',
	...adminCommand,
};

export const failedAddPlayerQuery: Partial<IEvent> = {
	eventName: addPlayer,
	value: 'I should fail',
	...adminCommand,
};

export const failedAddPlayerMissingQuery: Partial<IEvent> = {
	eventName: addPlayer,
	value: '[Dudette][409408071601881089]',
	...adminCommand,
};

export const faileAddPlayerNameOnlyQuery: Partial<IEvent> = {
	eventName: addPlayer,
	value: '[Dudette]',
	...adminCommand,
};

export const successfullAddNPC: Partial<IEvent> = {
	eventName: addNPC,
	value: '[Test][test][http://test.com/][this is a description]',
	...adminCommand,
};

export const failedAddNPC: Partial<IEvent> = {
	eventName: addNPC,
	value: 'I should fail',
	...adminCommand,
};

export const failedAddNPCMissingDescription: Partial<IEvent> = {
	eventName: addNPC,
	value: '[Test][test][http://test.com/]',
	...adminCommand,
};

export const failedAddNPCMissingDescriptionAndImage: Partial<IEvent> = {
	eventName: addNPC,
	value: '[Test][test]',
	...adminCommand,
};

export const failedAddNPCNameOnly: Partial<IEvent> = {
	eventName: addNPC,
	value: '[Test]',
	...adminCommand,
};

export const successfulAddFact: Partial<IEvent> = {
	eventName: addFact,
	value: '[test][0][test, test2]',
	...adminCommand,
};

export const failedAddFact: Partial<IEvent> = {
	eventName: addFact,
	value: 'I should fail',
	...adminCommand,
};

export const failedAddFactMissingFact: Partial<IEvent> = {
	eventName: addFact,
	value: '[test][0]',
	...adminCommand,
};

export const failedAddFactNameOnly: Partial<IEvent> = {
	eventName: addFact,
	value: '[test]',
	...adminCommand,
};

export const successfullyAddPlayer: Partial<IEvent> = {
	eventName: addPlayer,
	value: '',
	...adminCommand,
};

export const successfullyAddGlobalTest: Partial<IEvent> = {
	eventName: addGlobalTest,
	value:
		'[newTest][this is a new test][true][prefix][{minResult:0, resultMessage: "message qwr"}, {minResult:3, resultMessage: "message rqw"}, {minResult:5, resultMessage: "message qrwr"}]',
	...adminCommand,
};

export const failedAddGlobalTest: Partial<IEvent> = {
	eventName: addGlobalTest,
	value: 'I should fail',
	...adminCommand,
};

export const failedAddGlobalTestMissingOptions: Partial<IEvent> = {
	eventName: addGlobalTest,
	value: '[newTest][this is a new test][true][prefix]',
	...adminCommand,
};

export const failedAddGlobalTestMissingOptionsAndPrefix: Partial<IEvent> = {
	eventName: addGlobalTest,
	value: '[newTest][this is a new test][true]',
	...adminCommand,
};

export const failedAddGlobalTestNameOnly: Partial<IEvent> = {
	eventName: addGlobalTest,
	value: '[newTest]',
	...adminCommand,
};

export const successfullyAddStatInsight: Partial<IEvent> = {
	eventName: addStatInsight,
	value: '[weird][Occult][4][This feels funny but you dont know what causes this yet]',
	...adminCommand,
};

export const failedAddStatInsight: Partial<IEvent> = {
	eventName: addStatInsight,
	value: 'I should fail',
	...adminCommand,
};

export const failedAddStatInsightMissingMessage: Partial<IEvent> = {
	eventName: addStatInsight,
	value: '[weird][Occult][4]',
	...adminCommand,
};

export const failedAddStatInsightMissingStat: Partial<IEvent> = {
	eventName: addStatInsight,
	value: '[weird][Occult][4]',
	...adminCommand,
};

export const failedAddStatInsightNameOnly: Partial<IEvent> = {
	eventName: addStatInsight,
	value: '[weird][Occult][4]',
	...adminCommand,
};

export const successfullyAddNarration: Partial<IEvent> = {
	eventName: addNarration,
	value: '[test][https://test.com/test.jpg][test message]',
	...adminCommand,
};

export const failedAddNarration: Partial<IEvent> = {
	eventName: addNarration,
	value: 'I should fail',
	...adminCommand,
};

export const failedAddNarrationMissingMessage: Partial<IEvent> = {
	eventName: addNarration,
	value: '[test][https://test.com]',
	...adminCommand,
};

export const failedAddNarrationNameOnly: Partial<IEvent> = {
	eventName: addNarration,
	value: '[test]',
	...adminCommand,
};

export const successfulAssignAdmin: Partial<IEvent> = {
	eventName: assignAdmin,
	...adminCommand,
};

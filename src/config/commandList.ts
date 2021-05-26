import { narrationCommand } from '../Commands/narration.command';
import { BaseCommand } from '../Models/CommandModels';
import { globalTestInitCommand, globalTestValueCommand } from '../Commands/globalTest.command';
import { statInsightCommand } from '../Commands/statInsight.commands';
import { npcCommand } from '../Commands/npc.command';
import {
	addFactsCommand,
	addGlobalTestCommand,
	addNarrationCommand,
	addNPCCommand,
	addPlayerCommand,
	addStatInsightCommand,
	assignAdminCommand,
} from '../Commands/admin.command';

export const commandList: BaseCommand[] = [
	narrationCommand,
	globalTestInitCommand,
	globalTestValueCommand,
	statInsightCommand,
	npcCommand,
	addNPCCommand,
	addFactsCommand,
	addGlobalTestCommand,
	addStatInsightCommand,
	addNarrationCommand,
	assignAdminCommand,
	addPlayerCommand,
];

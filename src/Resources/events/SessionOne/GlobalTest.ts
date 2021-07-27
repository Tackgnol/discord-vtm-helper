export const GlobalTest: any[] = [
	{
		name: 'oldHouse',
		testMessage:
			'The corridor seems significantly longer the rooms attached to it.You can examine the walls using Intelligence + Investigation, or Wits + Academics (Architecture)',
		shortCircuit: false,
		replyPrefix: 'You examine the walls',
		globaltestoptionSet: [
			{
				minResult: 0,
				resultMessage: 'Nothing out of the ordinary according to you',
			},
			{
				minResult: 1,
				resultMessage: 'The back wall looks like it was made from a different material',
			},
			{
				minResult: 3,
				resultMessage: 'This is an old building it should not use that much space for piping, something must be here',
			},
			{
				minResult: 5,
				resultMessage:
					'While knocking in the places you deducted can be hollow, you indeed confirm that this wall is very thin and something is behind it',
			},
		],
	},
	{
		name: 'staffBedrooms',
		testMessage:
			'The staff bedrooms are very busy someone is continuously going in and out, searching will require a bit of finesse (DEX + Larceny)',
		shortCircuit: true,
		replyPrefix: 'You try to search the rooms',
		globaltestoptionSet: [
			{
				minResult: 0,
				resultMessage: 'Someone spotted you searching the room (play out being spotted)',
			},
			{
				minResult: 3,
				resultMessage:
					"You find a maids journal, she writes a lot about 'John' from the willage near by, they are probably young lovers. A couple of pages are ripped out, however you were almost spotted and could not investigate further",
			},

			{
				minResult: 5,
				resultMessage:
					"You find a maids journal, she writes a lot about 'John' from the willage near by, they are probably young lovers. A couple of pages are ripped out. \n You quickly discard the diary and search for the missing pages \n The describe a quarrel between the master and the butler.",
			},
		],
	},
];

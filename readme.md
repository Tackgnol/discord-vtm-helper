# Vampire Discord Helper

## Features
The current build supports

### Global Tests
A channel wide test for the players to roll and report their score to the bot to receive information

![alt text](https://i.imgur.com/7JIvf5z.png "Global test initialization")

You can 'react' using the buttons or type in `!test{your score}` to receive a message:

![alt text](https://i.imgur.com/MNe4e4G.png "Global test result")

These tests can 'short circuit' meaning that it will only display the closes result or like in the above example show everything leading up to the score.

![alt text](https://i.imgur.com/uZ7VTBm.png "Global test intialization")

The first message is what they player sees after pressing `0`, the second after `7` 

![alt text](https://i.imgur.com/7JwBO3z.png "Global test result")

### Narration Events
A channel wide narration event displaying a pre-set message and a image stimulus: 

![alt text](https://i.imgur.com/0upM9OO.png "Narration result")


### Stat Insights
A channel wide event that will prompt player with certain information with a message that their statistic allows them to be privy to.
**This is not a test, if a player has Occult of 4 and the requirement is 4 he will just see the message.**
The event called on the channel: 

![alt text](https://i.imgur.com/Rbur1vl.png  "Stat insight call")

The message the player with the stat sees: 

![alt text](https://i.imgur.com/PXOplKi.png  "Stat insight result")

### NPCs
The bot can store npc info to later present to the players, you can DM the bot with `!vtm-npcs-all` to see a list o NPCS available to you: 

![alt text](https://i.imgur.com/jz3IQQf.png  "All npcs")

The list provides all the messages you need to see the nps details:

![alt text](https://i.imgur.com/3Mv42vT.png   "npc details")

The details can contains:
* Name 
* An image
* A description
* A set of NPC facts known to that player


## Requirements
* NodeJS [installing node](https://nodejs.org/en/download/)
* Basic understanding of JSON
## Installing 
1. `git clone https://github.com/Tackgnol/discord-vtm-helper.git` (or alternatively click the download zip button above)
2. In the directory where you cloned / unzipped the repo run command `npm install`
3. After all libraries have been installed run `npm run watch`
4. You need to [setup your won bot](https://discordpy.readthedocs.io/en/latest/discord.html)
5.  Paste the bot token into the `auth.json` file like so:
`{
	"token": "your token"
}`


## Managing you games
### Config file
The app will run on the default `settings.json` however to run the bot you need an discord auth key [obtaining a discord auth key](https://www.writebots.com/discord-bot-token/)

Paste the bot token into the `auth.json` file like so:
`{
	"token": "your token"
}`

Located in the `/config` directory the `settings.json` file consists of the following configs:

- `prefix`: The prefix to which the bot will respond
- `subPrefixes`: The list of subprefixes for different event types (it is advised to main the the defaults).
- `prefixStructure`: Determines the structure if the command the default is: `!vtm-{eventType}-{eventName}`
- `soundCommands`: In development do not use
- `eventSource`: Determines the source of the events accepts `online` / `offline`
- `onlineSourceUrl`: You can connect the bot to a graphql api that will serve (for the schema check the `schema.json` file)
- `colors`: You can determine the colors of  the rich embed for the bot
- `Lines`: this determines the messages that the bot will send (headlines, flavour texts etc.)

## Resources
Here all your events and players are stored: 

### players.json
A file containing the information of your players, the structure is a follows: 

    "discordUserName": "Discord display name of the player",
    "statisticsSet": [
        {
            "name": "Statistic name",
            "value": the value that the player has
        },
    ],
    "npcSet": [
        {
            "npc": {
                "name": "name of the npc",
                "description": "npcs description",
                "image": "url to the npc image",
                "callName": "a unique no spaces or special characters name (this is used to call your event) ex. angel"
            },
            "facts": [
                "facts that the player knows about this npc",
                "this will be unique to the player and you can put in as many as you want"
            ]
        },
    ]


### Events
This folder stores your sessions, in the two defaults are: `Session-Dev` for development purposes, and `SessionOne` for your ready to go events. 

#### GlobalTest.json
These files contain the Global Tests the strucutre is as follows: 

    "name": "a unique no spaces or special characters name (this is used to call your event) ex. disgustingCorpse",  
    "testMessage": "The message that will be shown at the start of the test ex. 'You found a half rotten body on the street you can examine it using Medicine + Intelligence'",  
    "shortCircut": true/false this tells whether all options leading to the player score should be shown or just the greatest one,  
    "replyPrefix": "A prefix of the message sent to the players",  
    "optionArray": [ this is an array of options for the test it consists of `minResult` the minimal value to see the message and `resultMessage` the message itself
        {
            "minResult": 0, 
            "resultMessage": "Wygląda na samobójstwo"
        },
        {
            "minResult": 2,
            "resultMessage": "Hmmm... Natomiast widzę krew pod paznokciami, osoby trzecie?"
        },
        {
            "minResult": 5,
            "resultMessage": "Ofiara ma obite podbrzusze, kto bije się po brzuchu zanim się powiesi?"
        },
        {
            "minResult": 7,
            "resultMessage": "Twoje lata doświadczenia pozwalają Ci ocenić na podstawie rozbyzgu krwi że nie mogła ona pochodzić od jednej osoby"
        }
        You can put as many of those as you want as long as they are from 0 to 9
    ]


#### StatInsights.json
These files contain your stat insights for the characters the structure is as follows:
	
    "name": "a unique no spaces or special characters name (this is used to call your event) ex. theSmell",
    "statName": "Statistic that is to be compared to in players.json",
    "minValue": minimal value to receive a message,
    "successMessage": "The information the player receives thanks to his stats"
	

#### Narration.json
These files contain your narration events, a preset message and an image the strucute is a follows:

    "name": "a unique no spaces or special characters name (this is used to call your event) ex. theSmell",
    "narrationText": "Text to display to players",
    "image": "url to the image to be displayed to the players"

### channelToSession.json
The file contains a json array of discord channel ids and events for those channels: 

`[{ "id": X, "session": "sessionOne" }]`

The format is `id` the id of your channel [obtaining the channel id](https://support.discordapp.com/hc/en-us/articles/206346498-Where-can-I-find-my-User-Server-Message-ID-), `session` the folder withing the `events` directory where you store your events. 

You can add more folders by adding them to `index.js` in the `/events` directory

## Roadmap
### Considered essential
1. Making it possible to launch global events from a DM
2. Allowing to add events from the the bot
3. Firebase integration 
### Nice to have 
1. Making the music player work...
2. Electron app to simplify event creation

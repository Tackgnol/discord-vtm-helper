const Play = (connection, url) => {
	return connection.playFile(url);
}

const Stop = (connection) => {
	connection.player.dispatcher.destroy();
}

module.exports = { Play, Stop };

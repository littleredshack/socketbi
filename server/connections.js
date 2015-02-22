var fs    = require('fs');

/*****************************************************
NCONF is not dynamic so if new databases are added
to file then they are not picked up
So writing something to read config file into object
******************************************************/
exports.readConfig = function (filename,callback) {
	fs.readFile(filename, 'utf8', function (err,contents) {
		if (err) {
			return logger.debug("Error reading config " +err);
	  	}
	  	cfg = JSON.parse(contents);
	  	callback(cfg);
	});
}

/************************************************************/


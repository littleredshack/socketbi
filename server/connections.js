var fs    = require('fs');
var mysql = require('mysql');
// cfg object containing config of all datasources. 
// Read from file 
var cfg   = {};

/***************************************************
PRIVATE FUNCTION: connections.readConfig
Reads config from json file
Returns config object in a callback
Used at startup and when dblist is requested
****************************************************/
var readConfig = function(filename, callback){
	fs.readFile(filename, 'utf8', function (err,contents) {
		if (err) {
			return logger.debug("Error reading config " +err);
		 	}
		c = JSON.parse(contents);
		// TODO: Validate config against a template
		// Send the config object back in the callback
		callback(c);
	});	
}

// Call readConfig at inital startup
readConfig('config.json', function(config) {
	cfg = config;
	logger.debug("Config read");
});

/*****************************************************
EXPORTS FUNCTION: connections.dblist
Returns a list of datasource names in a callback
******************************************************/
exports.dblist = function dblist(callback) {
	var dblist = [];
	readConfig('config.json', function(config) {
		cfg = config;
	  	cfg.datasources.forEach(function(entry) {
	  		dblist.push(entry.name);
			if (dblist.length === cfg.datasources.length)
				callback(null,dblist);
		});
	})
}


/*************************************************
CONNECTIONS.QUERY
The main database query routine
Expects to receive an object: 
{"dataSourceName":"xxx":"query":"xxxx"}
Returns a callback with
an error code (or null) and a dbresponse object
**************************************************/
exports.query = function query(q,callback) {
	logger.debug("connections.query: " +JSON.stringify(q));
	// Get the index of this datasource so that can use it later
	var indexOfDataSource = cfg.datasources.map(function(e) { return e.name; }).indexOf(q.dataSourceName) ;
	// Check that we have a valid connection config for this connection
	if(!cfg.datasources[indexOfDataSource].connection) { 
		callback("Invalid connection settings") ;
		return;
	}
	// Check if this datasource is already connected
	if (cfg.datasources[indexOfDataSource].state != "connected") {
		// if it's not connected then connect it and store the connection as this.'db' to use for making future db calls
		cfg.datasources[indexOfDataSource].db = mysql.createPool(cfg.datasources[indexOfDataSource].connection);
		// TODO: Check that the connection was successful
		// set the state of this connection to connected
		cfg.datasources[indexOfDataSource].state = "connected";
	}
    cfg.datasources[indexOfDataSource].db.query(q.query, function (error, rows, fields) {
    	if (error) {
    		logger.debug(error);
    		callback("Invalid query",error);
    		return;
    	}
    	logger.debug(rows);
    	callback(null,rows);
    	return;
    })
}


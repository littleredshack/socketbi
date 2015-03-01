var fs    = require('fs');
var mysql = require('mysql');
// cfg object containing config of all datasources. 
// Read from file 
global.cfg   = {};

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


/****************************************************************************************
MYSQL QUERY HANDLER
The main mysql database query routine
Takes a query object e.g.
{"dataSourceName":"mysql1","queryid":"queryresults2","query":"select count(*) FROM DUAL"}

Returns a callback with an error code (or null) and a dbresponse object
****************************************************************************************/
exports.mysql = {};
exports.mysql.query = function query(q,callback) {
	logger.debug("connections.mysql.query: " +JSON.stringify(q));
	// Check for illegal SQL statements and return immediately if there are any
	var qx = q.query.toUpperCase();
	var found = qx.match(/DELETE|INSERT|UPDATE/g); 
	if( found ) {
		callback("Error","Illegal query") ;
		//socket.emit("dataresponse",{"queryid":request.data.queryid,"result":"Illegal query"})
		return;
	}
	// Get the index of this datasource so that can use it to get config settings
	var indexOfDataSource = cfg.datasources.map(function(e) { return e.name; }).indexOf(q.dataSourceName) ;
	// Check if this datasource is already connected
	if (cfg.datasources[indexOfDataSource].state != "connected") {
		// if it's not connected then connect it and store the connection as this.'db' to use for making future db calls
		cfg.datasources[indexOfDataSource].db = mysql.createPool(cfg.datasources[indexOfDataSource].connection);
		// TODO: Check that the connection was successful
		// set the state of this connection to connected
		cfg.datasources[indexOfDataSource].state = "connected";
	}
	// Check that we have a valid connection config for this connection
	if(!cfg.datasources[indexOfDataSource].connection) { 
		logger.debug("Missing connection settings");
		callback("Error","Missing connection settings") ;
		return;
	}
	// Run the query
    cfg.datasources[indexOfDataSource].db.query(q.query, function (error, rows, fields) {
    	if (error) {
    		logger.debug(error);
    		callback(error,"Invalid query");
    		return;
    	}
    	logger.debug(rows);
    	callback(null,rows);
    	return;
    })
}


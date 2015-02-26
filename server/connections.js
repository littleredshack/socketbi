var fs    = require('fs');
var mysql = require('mysql');

/*****************************************************
NCONF is not dynamic so if new databases are added
to file then they are not picked up
So writing something to read config file into object
This means we can dynamically add new datasources
******************************************************/
exports.dblist = function dblist(cfgfile,callback) {
	var dblist = [];
	fs.readFile(cfgfile, 'utf8', function (err,contents) {
		if (err) {
			return logger.debug("Error reading config " +err);
	  	}
	  	cfg = JSON.parse(contents);
	  	cfg.datasources.forEach(function(entry){
		dblist.push(entry.name);
		if (dblist.length === cfg.datasources.length)
			callback(null,dblist);
		});
	})
}

/************************************************************/
var cfg = {};

// Read config at inital startup
fs.readFile('datasources.json', 'utf8', function (err,contents) {
	if (err) {
		return logger.debug("Error reading datasources " +err);
	 	}
	cfg = JSON.parse(contents);
});	

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
	// Check if this datasource is already connected
	if(cfg.datasources[indexOfDataSource].state != "connected") {
		// if it's not connected then connect it and store the connection in the cfg object to use for making future db calls
		cfg.datasources[indexOfDataSource].db = mysql.createConnection(cfg.datasources[indexOfDataSource].connection);
		// set the state of this connection to connected
		cfg.datasources[indexOfDataSource].state = "connected";
	}
	// use the index to get the stored data connection and run the query 
	cfg.datasources[indexOfDataSource].db.query(q.query) 
        .on('result', function(dbresponse){
        	logger.debug(dbresponse);
        	// send back the query result
            callback(null,dbresponse);
        })
        .on('end', function(){
            logger.debug("DB END");
        })	
}


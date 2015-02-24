var fs    = require('fs');
var mysql = require('mysql');

/*****************************************************
NCONF is not dynamic so if new databases are added
to file then they are not picked up
So writing something to read config file into object
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

var createDBConnection = function(dbname) {
 	var db = mysql.createConnection({
		"host": "localhost",
		"user": "root",
		"password": "password",
		"database": "test",
	});
	return db;
}

exports.db1 = createDBConnection("mysql1");


/*
module.exports = function User(data) {

    //this properly private stuff.

    var privateVar;
    var username = data.username;
    var pass = data.pass; //etc

    function privateFunc() {
    }

    return {
        login: function(cb) {
            db.doStuff(username, pass, cb);
        }
    };
};
*/


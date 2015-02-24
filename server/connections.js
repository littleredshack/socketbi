var fs    = require('fs');
var mysql = require('mysql');

/*****************************************************
NCONF is not dynamic so if new databases are added
to file then they are not picked up
So writing something to read config file into object
******************************************************/

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

/*
exports.bread = function bread() {
  return ['bread: 2'];
};
*/

async = require("async");

exports.dblist = function dblist(cfgfile,socket) {
	var dblist = [];
	fs.readFile(cfgfile, 'utf8', function (err,contents) {
		if (err) {
			return logger.debug("Error reading config " +err);
	  	}
	  	cfg = JSON.parse(contents);
		async.each(cfg.datasources,
			function(entry){
				dblist.push(entry.name);
			},
			function(err) {
				console.log(err);	
			})
		socket.emit('dblist',dblist);
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
readConfig('datasources.json' , function(c) {
	var dblist = [];
	c.datasources.forEach(function(entry){
		dblist.push(entry.name);
	});
	console.log(dblist);
}
*/
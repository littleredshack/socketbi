/**************************************************************/
// Setup to use nconf for application config
global.fs    = require('fs'),
    path  = require('path'),
	nconf = require('nconf');

// First consider commandline arguments and environment variables, respectively.
nconf.argv().env();

// Setup nconf to use the 'file' store
nconf.use('file', { file: path.join(__dirname, 'config.json') });

// Provide default values for settings not provided above.
nconf.defaults({
    'app': {
        'port': 3080,
		'secret': 'secret'
    }
});

/************************************************************/
// Set up logging
var winston = require('winston');

global.logger = new (winston.Logger)({
    transports: [
      new (winston.transports.Console)({ level: nconf.get('app:logging:console:loglevel') }),
      new (winston.transports.File)({ filename: nconf.get('app:logging:file:filename'), level: nconf.get('app:logging:file:loglevel') , json: false})
    ]
  });
  
/**************************************************************/

/*************************************************************/
// Use nconf.get to get settings
global.secret = nconf.get('app:secret');

// Show the entire app config object from nconf
logger.debug('Settings: \n' + JSON.stringify(nconf.get('app'),null, 3));


#!/usr/local/bin/node
'use strict';
/**
* @file js-get.js
* @brief Simple, reusable functions for HTTP-Get'ing url and the likes. Mainly an idiomatic wrapper around Request.
* @author Anadian
* @copyright 	Copyright 2019 Canosw
	Permission is hereby granted, free of charge, to any person obtaining a copy of this 
software and associated documentation files (the "Software"), to deal in the Software 
without restriction, including without limitation the rights to use, copy, modify, 
merge, publish, distribute, sublicense, and/or sell copies of the Software, and to 
permit persons to whom the Software is furnished to do so, subject to the following 
conditions:
	The above copyright notice and this permission notice shall be included in all copies 
or substantial portions of the Software.
	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, 
INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A 
PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT 
HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF 
CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE 
OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

//Dependencies
	//Internal
	//Standard
	const FileSystem = require('fs');
	const Utility = require('util');
	//External
	const RequestPromiseNative = require('request-promise-native');

//Constants
const FILENAME = 'js-get.js';
const MODULE_NAME = 'JSGet';
var PROCESS_NAME = '';
if(require.main === module){
	PROCESS_NAME = 'js-get';
} else{
	PROCESS_NAME = process.argv0;
}

//Global Variables
var Logger = { 
	log: () => {
		return null;
	}
};
//Functions
function Logger_Set( logger ){
	var _return = [1,null];
	const FUNCTION_NAME = 'Logger_Set';
	//Variables
	var function_return = [1,null];

	//Parametre checks
	if( typeof(logger) === 'object' ){
		if( logger === null ){
			logger = { 
				log: () => {
					return null;
				}
			};
		}
	} else{
		_return = [-2,'Error: param "logger" is not an object.'];
	}

	//Function
	if( _return[0] === 1 ){
		Logger = logger;
		_return = [0,null];
	}

	//Return
	return _return;
}

/**
* @fn Request_Async
* @brief Asynchronous use of request module.
* @async true
* @param request_options
*	@type Request_Options:Object|URL:String
*	@brief The Request-Options object to be passed to request-promise-native; if it's a string, it's interpreted as the URL of the request.
*	@default 
* @return <ARRAY>
*	@entry 0 
*		@retval 1 premature return.
*		@retval 0 on success.
*		@retval <0 on failure.
*	@entry 1
*		@retval <object> on success
*		@retval <error_message> on failure.
*/
async function Request_Async( request_options ){
	var _return = [1,null];
	const FUNCTION_NAME = 'Request_Async';
	Logger.log({process: PROCESS_NAME, module: MODULE_NAME, file: FILENAME, function: FUNCTION_NAME, level: 'debug', message: Utility.format('received: %o', arguments)});
	//Variables
	var function_return = null;

	//Log.log(PROCESS_NAME,MODULE_NAME,FILENAME,FUNCTION_NAME,'debug','received: '+arguments.toString());
	//Parametre checks
	if( request_options == null || (typeof(request_options) !== 'string' && typeof(request_options) !== 'object')){
		_return = [-2, 'Error: param "request_options" is either null or not a string and not an object.'];
	}
	
	//Function
	if( _return[0] === 1 ){
		try{
			function_return = await RequestPromiseNative( request_options );
			_return = [0,function_return];
		} catch(error){
			_return = [-4,'RequestPromiseNative threw: '+error];
		}
	}
	//Return
	Logger.log({process: PROCESS_NAME, module: MODULE_NAME, file: FILENAME, function: FUNCTION_NAME, level: 'debug', message: Utility.format('returned: %o', _return)});
	//Log.log(PROCESS_NAME,MODULE_NAME,FILENAME,FUNCTION_NAME,'debug','returned: '+_return.toString());
	return _return;
}

async function URL_To_File_Async( url, filepath ){
	var _return = [1,null];
	const FUNCTION_NAME = 'URL_To_File';
	//Variables
	var function_return = [1,null];
	//Parametre checks
	if( url == null || typeof(url) !== 'string' ){
		_return = [-2, 'Error: parametre "url" is either null or not a string.'];
	}
	if( filepath == null || typeof(filepath) !== 'string' ){
		_return = [-3, 'Error: parametre "filepath" is either null or not a string.'];
	}
	if( _return[0] === 1 ){
		function_return = await Request_Async(url);
		if( function_return[0] === 0 ){
			try{
				FileSystem.writeFileSync(filepath, function_return[1], 'utf8');
				_return = [0,null];
			} catch(error){
				_return = [-8, 'FileSystem.writeFileSync threw: '+error];
			}
		} else{
			_return = function_return;
		}
	}
	//Return
	Logger.log({process: PROCESS_NAME, module: MODULE_NAME, file: FILENAME, function: FUNCTION_NAME, level: 'debug', message: Utility.format('returned: %o', _return)});
	return _return;
}

async function URLArray_To_Files_Async( url_array ){
	var _return = [1,null];
	const FUNCTION_NAME = 'URLArray_To_Files';
	//Variables
	var function_return = [1,null];
	//Parametre checks
	if( url_array == null || Array.isArray(url_array) !== true ){
		_return = [-2, 'Error: parametre "url_array" is either null or not an array.'];
	}
	if( _return[0] === 1 ){
		for(var i = 0; i < url_array.length; i++){
			function_return = await URL_To_File_Async( url_array[i], 'request_'+i+'.html');
			if( function_return[0] !== 0 ){
				console.error('%d: URL_To_File: %s', i, function_return[1]);
			}
		}
	}
	//Return
	Logger.log({process: PROCESS_NAME, module: MODULE_NAME, file: FILENAME, function: FUNCTION_NAME, level: 'debug', message: Utility.format('returned: %o', _return)});
	return _return;
}

//Exports and Execution
if(require.main === module){
	var _return = [1,null];
	const FUNCTION_NAME = 'MainExecutionFunction';
	//Dependencies
		//Internal
		//Standard
		//External
		const ApplicationLogWinstonInterface = require('application-log-winston-interface');
		const EnvPaths = require('env-paths');
	//Constants
	const EnvironmentPaths = EnvPaths(PROCESS_NAME);
	//Variables
	var function_return = [1,null];
	//Logger
	function_return = ApplicationLogWinstonInterface.InitLogger( 'debug.log', EnvironmentPaths.log );
	if( function_return[0] === 0 ){
		Logger_Set(function_return[1]);
	}
	Logger.log({process: PROCESS_NAME, module: MODULE_NAME, file: FILENAME, function: FUNCTION_NAME, level: 'debug', message: 'Start of execution block.'});
	//Options
	if( process.argv.length > 2 ){
		var url_array = process.argv.slice(2);
		URLArray_To_Files_Async( url_array );
	}
	//Config
	//Main
	Logger.log({process: PROCESS_NAME, module: MODULE_NAME, file: FILENAME, function: FUNCTION_NAME, level: 'debug', message: 'End of execution block.'});
} else{
	exports.SetLogger = Logger_Set;
	exports.RequestAsync = Request_Async;
	exports.URLToFileAsync = URL_To_File_Async; 
}


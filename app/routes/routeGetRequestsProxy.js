module.exports = function(app) {

	var request = require('request');
	var http = require('http');

	app.get('/api/proxy/auth', isAuthorized, function(req, res) {

		res.send(200);

	});

	app.get('/api/proxy/:server', isAuthorized, function(req, res) {

		var server = req.params.server;

		var hosts = {
			'nlpserver': 'http://nlp.scasefp7.eu:8010',
			'assetregistry': 'http://109.231.121.125:8080/s-case'
		};

		var options = {
			uri: hosts[server] + '/' + server,
			method: 'GET'
		};

		request(options, function(error, response, body) {

			if (!error && response.statusCode == 200) {
				console.log(response.statusCode);
				res.send(response);
			}
			else {
				console.log(response.statusCode);
				res.send(response.statusCode);
			}

		});
	});

	app.get('/api/proxy/:server/*', isAuthorized, function(req, res) {

		var server = req.params.server;
		var path = req.params[0];

		var hosts = {
			'nlpserver': 'http://nlp.scasefp7.eu:8010',
			'assetregistry': 'http://109.231.121.125:8080/s-case',
			'SCServer': 'http://109.231.127.61:8080',
			'ontologies': 'http://109.231.126.165:8080'
		};

		var querystring = '',
			i = 0;
		for (var key in req.query) {
			if (i === 0) {
				querystring = '?' + key + '=' + req.query[key];
			} else {
				querystring += '&' + key + '=' + req.query[key];
			}

			i++;
		}

		var options = {
			uri: hosts[server] + '/' + server + '/' + path + querystring,
			method: 'GET'
		};

		request(options, function(error, response, body) {

			if (!error && response.statusCode == 200) {
				console.log(response.statusCode);
				res.send(response);
			}
			else {
				console.log(response.statusCode);
				res.send(response.statusCode);
			}

		});

	});

};

var isAuthorized = function(req, res, next) {

	var mysql = require('mysql');
	var dbconfig = require('../../config/database');
	var connConstant = require('../../config/ConnectConstant');
	var jwt = require('jsonwebtoken');

	var auth = req.headers['authorization'];

	if(!auth) { // No Authorization header was passed in
		res.send(401);
	}
	else if(auth) { // The Authorization was passed in so now we validate it

		var authParts = auth.split(' ');
		var buffer = new Buffer(authParts[1]).toString();
		var creds = buffer.split(':');
	  var token = creds[0];
	  var signature = creds[1];

		connection = connConstant.connection;
		connection.query('USE ' + dbconfig.database);

		// Query to get the secret of the user
		var getSecretQuery = "SELECT " + dbconfig.users_table + ".`scase_secret` AS scaseSecret, " + dbconfig.users_table + ".`scase_token` AS scaseToken FROM "+ dbconfig.users_table + " WHERE " + dbconfig.users_table + ".`scase_token`= '"+ token + "'";

		connection.query(getSecretQuery, function(error, rows) {
			if (error || rows.length < 1) { // Authorization failed
				res.send(401);
			}

			if(rows.length > 0) {
				var decoded = jwt.verify(signature, rows[0].scaseSecret);
				if(decoded.token == rows[0].scaseToken) { // Authorization succeeded
					next();
				}
				else { // Authorization failed
					res.send(401);
				}

			}

		});

	}

}

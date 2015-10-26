module.exports = function(app, passport) {

	var request = require('request');
	var http = require('http');
	var needle = require('needle');
	var mysql = require('mysql');
	var querystring = require('querystring');
	var dbconfig = require('../../config/database');
	var connConstant = require('../../config/ConnectConstant');
	// =============================================================================
	// Go to QA ======================================
	// =============================================================================
	app.get('/QA', isLoggedIn, function(req, res) {
		res.render('QA.html')
	});

	app.post('/QAfree', isLoggedIn, function(req,res){
		quest=req.body.question;
		console.log(quest);
		var headers = {
			'Content-Type': 'application/json'
		}
		var options={
			headers: headers,
			host: 'http://nlp.scasefp7.eu',
			port: '8010',
			path : '/nlpserver/question',
			method: 'POST'
		}
		var post_data={
			'question': quest

		}
		request({
			url: 'http://nlp.scasefp7.eu:8010/nlpserver/question',
			method: 'POST',
			json: post_data,
			headers: headers,
			//body: JSON.stringify(post_data)

		}, function(error, respon, body){
			if (respon.statusCode==200 && !error){
				console.log(body.query_terms);
				res.send(body.query_terms);
			}
			else{
				console.log(respon.statusCode)
				res.send('')
			}
			//console.log(body);
		});
		

	});
	app.get('/QAsearch', isLoggedIn, function(req,res){
		//console.log(req.query)
		q=req.query.q
		domain=req.query.domain;
		subdomain=req.query.subdomain;
		if (domain!=undefined && subdomain!=undefined){
			request.get('http://109.231.121.125:8080/s-case/assetregistry/artefact/search?query='+q+'&subdomain='+subdomain+'&domain='+domain,{timeout:15000},function(err,respon){
				//console.log('skata');
				res.send(respon);
			});
		}
		else if (subdomain!=undefined){
			request.get('http://109.231.121.125:8080/s-case/assetregistry/artefact/search?query='+q+'&domain='+domain,{timeout:15000},function(err,respon){
				//console.log('skata2');
				res.send(respon);
			});
		}
		else{
			request.get('http://109.231.121.125:8080/s-case/assetregistry/artefact/search?query='+q,{timeout:15000},function(err,respon){
				//console.log('skata3');
				res.send(respon);
			});
		}

	});
};
// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
	var connConstant = require('../../config/ConnectConstant');
	var connection;
	connection = connConstant.connection;
	if (req.isAuthenticated())
		return next();

	res.redirect('/');
}

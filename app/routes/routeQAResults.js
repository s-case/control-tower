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
		//console.log(req.query);
		var totalrespon = {};
		q=req.query.q
		domain=req.query.domain;
		subdomain=req.query.subdomain;
		// At first, I execute a request to the assets registry.
		// Upon receiving a response for this request, I issue a new request to the OSRF.\
		// Then I combine the two responses in the object "totalrespon" and send them to the client.
		if (domain!=undefined && subdomain!=undefined){
			request.get('http://109.231.121.125:8080/s-case/assetregistry/artefact/search?query='+q+'&subdomain='+subdomain+'&domain='+domain,{timeout:15000},function(err,respon){
				totalrespon.QA = respon;
				/*request({
					uri: 'http://109.231.121.244:8080/OSRF/assets/snippet?code=' + q,
  					method: "GET",
  					headers: {'Accept': 'application/json'}
				}, function(theerr, therespon, thebod) {
					totalrespon.OSRF = therespon;
					res.send(totalrespon);
				});*/

				//to be deleted
				totalrespon.OSRF = {};
				res.send(totalrespon);
			});
		}
		else if (domain!=undefined){
			request.get('http://109.231.121.125:8080/s-case/assetregistry/artefact/search?query='+q+'&domain='+domain,{timeout:15000},function(err,respon){
				totalrespon.QA = respon;
				/*request({
					uri: 'http://109.231.121.244:8080/OSRF/assets/snippet?code=' + q,
  					method: "GET",
  					headers: {'Accept': 'application/json'}
				}, function(theerr, therespon, thebod) {
					totalrespon.OSRF = therespon;
					res.send(totalrespon);
				});*/
				
				//to be deleted
				totalrespon.OSRF = {};
				res.send(totalrespon);
			});
		}
		else{
			request.get('http://109.231.121.125:8080/s-case/assetregistry/artefact/search?query='+q,{timeout:15000},function(err,respon){
				totalrespon.QA = respon;
				/*request({
					uri: 'http://109.231.121.244:8080/OSRF/assets/snippet?code=' + q,
  					method: "GET",
  					headers: {'Accept': 'application/json'}
				}, function(theerr, therespon, thebod) {
					totalrespon.OSRF = therespon;
					res.send(totalrespon);
				});*/

				//to be deleted
				totalrespon.OSRF = {};
				res.send(totalrespon);
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

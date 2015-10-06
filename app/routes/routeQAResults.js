module.exports = function(app, passport) {

	var request = require('request');
	var mysql = require('mysql');
	var dbconfig = require('../../config/database');
	var connConstant = require('../../config/ConnectConstant');
	// =============================================================================
	// Go to QA ======================================
	// =============================================================================
	app.get('/QA', isLoggedIn, function(req, res) {
		res.render('QA.html')
	});

	app.post('/QAfree', isLoggedIn, function(req,res){
		question=req.body.question;

	});
	app.get('/QAsearch', isLoggedIn, function(req,res){
		//console.log(req.query)
		q=req.query.q
		domain=req.query.domain;
		subdomain=req.query.subdomain;
		console.log(q);
		console.log(domain)
		console.log(subdomain)
		if (domain!=undefined && subdomain!=undefined){
			request.get('http://109.231.121.125:8080/s-case/assetregistry/artefact/search?q='+q+'&subdomain='+subdomain+'&domain='+domain,{timeout:1500},function(err,respon){
				console.log('skata');
				res.send(respon.data);
			});
		}
		else if (subdomain!=undefined){
			request.get('http://109.231.121.125:8080/s-case/assetregistry/artefact/search?q='+q+'&domain='+domain,{timeout:1500},function(err,respon){
				console.log('skata2');
				res.send(respon.data);
			});
		}
		else{
			request.get('http://109.231.121.125:8080/s-case/assetregistry/artefact/search?q='+q,{timeout:15000},function(err,respon){
				console.log('skata3');
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

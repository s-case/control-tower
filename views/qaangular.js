(function(){
	var app = angular.module('qaApp', []);
//module.exports = function(app, passport) {
	var domains = [];//all the domains that exist in the S-CASE artefacts repo
	var subdomains = [];//all the subdomains that exist in the S-CASE artefacts repo
	var projects = []; //projects of S-CASE artefacts repo
	  /* Project detals
	    domain: value picked out of a pre-specified list of domains
	    sub-domains: ["sub1", "sub2", ...]
	  */
  	var requirements = []; //requirements of S-CASE artefacts repo
	  /*Requirement details
	    type: "textual"
	  belongsTo: projectId
	  link: link to file (file may contain multiple reqs)
	  language : ISO-639-3 language code (always eng) 
	  text: "The user must be able to ..."
	  requirement: "functional" or "non-functional"
	  */
  	var usecasediagrams = [];//usecase diagrams of S-CASE artefacts repo
	  /* Use case diagrams details
	  type: "use case"
	  format: "image" or "xmi"
	  link: link to file
	  relation: relation to xmi if image and viceversa
	  belongsTo: projectId
	  actors: ["actor1", "actor2", ...]
	  use cases: ["use case 1", "use case 2", ...]
	  */
  	var activitydiagrams = [];//activity diagrams of S-CASE artefacts repo
	  /*Activity diagrams details
	  type: "activity diagram"
	  format: "image" or "xmi"
	  link: link to file
	  relation: relation to xmi if image and viceversa
	  belongsTo: projectId
	  actions: ["action1", "action2", ...]
	  */
  	var classdiagrams = [];//analysis class diagramms of S-CASE artefacts repo
	  /* Analysis Class diagrams details
	  type: "analysis class diagram"
	  format: "image" or "xmi"
	  link: link to file
	  relation: relation to xmi if image and viceversa
	  belongsTo: projectId
	  classes: [{name: "class1", properties: [{name: "prop1", type: "string"}], relatedTo: ["class2", "class3"]}]
	  */
  	var storyboards = [];//storyboards of S-CASE artefacts repo
	  /* Storyboards details
	  type: "storyboard"
	  format: "image" or "xmi"
	  link: link to file
	  relation: relation to xmi if image and viceversa
	  belongsTo: projectId
	  actions: ["action1", "action2", ...]
	  */
	var sourcecodes = [];//sourcecodes of S-CASE artefacts repo
	  /* Source code details
	  type: "code"
	  belongsTo: projectId
	  link: link to zip
	  */
	var scaseservices = [];// scase services of S-CASE artefacts repo
	  /* S-CASE services details
	  type: "service description"
	  belongsTo: projectId
	  link: link to file
	  domainOntology: link to domain ontology residing in the ontology repo
	  */
  	

  	//controloller to perform the search to the S-CASE artefacts repo
  	app.controller('SearchController',['http',function($http){

  		var SearchPage  = this;//we set this to a variable in order to use it in http
	  	SearchPage.domains=[];//we are going to save the domains here
	  	SearchPage.subdomains=[];//we are going to save the subdomains here
	  	$http.get('/api/ArtsRepo/Domains').
		  	success(function(data){
		  		SearchPage.domains=data;
		  	}).
		  	error(function(status){
		  		console.log(status);
		  	});
	  	$http.get('/api/ArtsRepo/Subdomains').
		  	success(function(data){
		  		SearchPage.subdomains=data;
		  	}).
		  	error(function(status){
		  		console.log(status);
		  	});
	  	domains=SearchPage.domains;//we set the global variable of domains equal to the domains that we got from S-CASE artefacts repo
	  	subdomains=SearchPage.subdomains;//we set the global variable of subdomains equal to the subdomains that we got from S-CASE artefacts repo

	  	this.searchQuery = {};//it will contain the query to perform to the S-CASE artefacts repo
	  	//it will contain the following:
	  	//searchQuery.domainQuery the domain of interest of the user
	  	//searchQuery.subdomainQuery the subdomain of interest of the use
	  	//searchQuery.requirementsClass the classification of the requirements (functional,non-functional,both)
	  	//searchQuery.operations (the operations in free text)

	    SearchPage.searchResults=[];//it will include the results for the specific search

	    //function to perform the search to S-CASE artefacts repo
	    this.doSearch = function(){
	    	//it will contain the current query because inside http "this" refers to http and not to the controller
	    	var currentQuery = this.searchQuery;
	    	$http({
	   			url: 'api/ArtsRepo/Results',
	   			method: "GET",
	   			params: {
	   				domain: currentQuery.domainQuery,
	   				subdomain: currentQuery.subdomainQuery,
	   				requirements: currentQuery.requirementsClass,
	   				operations: currentQuery.operations
	   			}
	   		})
	   		.success(function(data){
		  		SearchPage.searchResults=data;//we get the data to the searchResults
		  		//we set every different result to the corresponding global variable
		  		SearchPage.requirements=SearchPage.searchResults.requirements;
		  		SearchPage.usecasediagrams=SearchPage.searchResults.usecasediagrams;
		  		SearchPage.activitydiagrams=SearchPage.searchResults.activitydiagrams;
		  		SearchPage.classdiagrams=SearchPage.searchResults.classdiagrams
		  		SearchPage.storyboards=SearchPage.searchResults.storyboards;
		  		SearchPage.sourcecodes=SearchPage.searchResults.sourcecodes;
		  		SearchPage.scaseservices=SearchPage.searchResults.scaseservices;
		  		SearchPage.searchResults=[];//we reset the search results
		  	})
		  	.error(function(status){
		  		console.log(status);
		  	});
	    };
  	}]);

	
  	//controller to display the data that we got from the S-CASE artefacts repo
  	app.controller('ResultsController', function(){
	  	this.requirements = requirements;
	  	this.usecasediagrams = usecasediagrams;
	  	this.activitydiagrams = activitydiagrams;
	  	this.classdiagrams = classdiagrams;
	  	this.storyboards = storyboards;
	  	this.sourcecodes = sourcecodes;
	  	this.scaseservices = scaseservices;
  	});
  	
	//controller to set the default tab value and to check if it is active
  	app.controller('TabController',function(){
	    this.tab=1;//default tab to be active
	    //set the tab active on click
	    this.setTab = function(setTab){
	      this.tab=setTab;
	    };
	    //returns true/false checking if the tab is active
	    this.isSet = function(checkTab){
	      return this.tab===checkTab;
	    };
  	});


 

  






}

/*function isLoggedIn(req, res, next) {
	var connConstant = require('../../config/ConnectConstant');
	var connection;
	connection = connConstant.connection;
	if (req.isAuthenticated())
		return next();

	res.redirect('/');
}*/

)();

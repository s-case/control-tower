(function(){
	var app = angular.module('qaApp', ['ngSanitize', 'ui.select']);
  	var requirementsClasses = [{name: 'Functional'},{name: 'Quality'},{name: 'Both'}];
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
    //==we use Google verticals for domains and subdomains
    //https://developers.google.com/adwords/api/docs/appendix/verticals
    //Domains with no parent are the domains in our case (var parentDomains below)
    //Domains with parents the domains with no parent are the subdomains in our case (var subdomains below)
    
  	//controloller to perform the search to the S-CASE artefacts repo
  	app.controller('SearchController',['$http',function($http){

  		var SearchPage  = this;//we set this to a variable in order to use it in http
	  	SearchPage.domains=[];//we are going to save the domains here
	  	SearchPage.subdomains=[];//we are going to save the subdomains here
	  	$http.get('parentDomains.json').then(function(res){
	        SearchPage.domains=res.data;
      	});
      	SearchPage.subdomainsTotal = [];
      	$http.get('subDomains.json').then(function(res){
	        SearchPage.subdomainsTotal=res.data;
      	});
	  	SearchPage.requirementsClasses=requirementsClasses;
	  	//domains=SearchPage.domains;//we set the global variable of domains equal to the domains that we got from S-CASE artefacts repo
	  	//subdomains=SearchPage.subdomains;//we set the global variable of subdomains equal to the subdomains that we got from S-CASE artefacts repo
	  	
	  	
	  	SearchPage.searchQuery = {};//it will contain the query to perform to the S-CASE artefacts repo
	  	//it will contain the following:
	  	//searchQuery.domainQuery the domain of interest of the user
	  	//searchQuery.subdomainQuery the subdomain of interest of the use
	  	//searchQuery.requirementsClass the classification of the requirements (functional,non-functional,both)
	  	//searchQuery.operations (the operations in free text)

	    SearchPage.searchResults=[];//it will include the results for the specific search
	    
	    //function to perform the search to S-CASE artefacts repo
	    this.doSearch = function(){
	    	//it will contain the current query because inside http "this" refers to http and not to the controller
	    	var currentQuery = SearchPage.searchQuery;
	    	var domainString="";
	    	if(currentQuery.domainQuery){
	    		domainString=currentQuery.domainQuery.Category;
	    	}
	    	if(domainString==undefined||domainString===""){
	    		domainString="All";
	    	}	    	
	    	var subdomainString="";
	    	if(currentQuery.subdomainQuery){
	    		subdomainString=currentQuery.subdomainQuery.Category;
	    	}
	    	if(subdomainString==undefined||subdomainString===""){
	    		subdomainString="All";
	    	}	  
	    	var requirementsClass = currentQuery.requirementsClass.name;
	    	var operations =  currentQuery.operations;
	    	var query;
	    	if(domainString!="All"&&subdomainString!="All"){
	    		query = {
					  "filtered": {
					    "query": {
					      "match": {
					        "_all": operations.replace(/,/g, '')
					      }
					    },
					    "filter": {
					      "bool": {
					        "must": {
					          
					            
					              "term": {
					                "domain": domainString
					              }
					            			           
					          
					        }
					      }
					    }
					  }
					}; 
	    	}
	    	if(subdomainString=="All"){
	    		query = {
				  	"filtered": {
				    	"query": {
				      		"match": {
				        		"_all": operations.replace(/,/g, '')
				      		}
				      	},
				    	"filter": {
				      		"bool": {
				        		"must": {
					              	"term": {
					                	"domain": domainString
					              	}
					            }
				      		}
				    	}
				  	}
				}; 

	    	}
	    	if(domainString=="All"){
	    		query = {
					      "match": {
					        "_all": operations.replace(/,/g, '')
					      }
					}; 
	    	}	
	    	$http({
	   			url: 'http://109.231.121.125:8080/s-case/assetregistry/artefact/search',
	   			method: "GET",
	   			params: {
	   				q: query
	   			}
	   		})
	   		.success(function(data){
		  		SearchPage.searchResults=data;//we get the data to the searchResults
		  		//we set every different result to the corresponding global variable
		  		for(var i=0;i<SearchPage.searchResults.length;i++){
		  			//check if the project is public or if the user owns or collaborates on it
		  			if(SearchPage.searchResults[i].privacyLevel==='PUBLIC'||isOwnerCollab(SearchPage.searchResults[i].projectName,SearchPage.usersProjects)){
		  				if(SearchPage.searchResults[i].type==='TEXTUAL'){
		  					if(requirementsClass=='Functional'){
		  						if(SearchPage.searchResults[i].requirement=='functional'){
		  							SearchPage.requirements.push(SearchPage.searchResults[i]);
		  						}
		  					}
		  					if(requirementsClass=='Quality'){
		  						if(SearchPage.searchResults[i].requirement=='non-functional'){
		  							SearchPage.requirements.push(SearchPage.searchResults[i]);
		  						}
		  					}
		  					if(requirementsClass=='Both'){
		  						SearchPage.requirements.push(SearchPage.searchResults[i]);
		  					}
		  				}
		  				if(SearchPage.searchResults[i].type==='activity diagram'){
	  						SearchPage.activitydiagrams.push(SearchPage.searchResults[i]);
		  				}
		  				if(SearchPage.searchResults[i].type==='analysis class diagram'){
	  						SearchPage.analysisclassdiagrams.push(SearchPage.searchResults[i]);
		  				}
		  				if(SearchPage.searchResults[i].type==='storyboard'){
	  						SearchPage.storyboards.push(SearchPage.searchResults[i]);
		  				}
		  				if(SearchPage.searchResults[i].type==='code'){
	  						SearchPage.sourcecodes.push(SearchPage.searchResults[i]);
		  				}
		  				if(SearchPage.searchResults[i].type==='storyboard'){
	  						SearchPage.storyboards.push(SearchPage.searchResults[i]);
		  				}
		  					
		  			}
		  		}
		  		SearchPage.scaseservices=SearchPage.searchResults.scaseservices;
		  		SearchPage.searchResults=[];//we reset the search results
		  	})
		  	.error(function(status){
		  		console.log(status);
		  	});
	    };
	    this.parentFilter = function(item){
	  		if (item.Parent==="0"){
	  			console.log(item)
	  			return true;
	  		}
	  		else{
	  			return false;
	  		}
	  	};
	  	this.subdomainFilter = function(item){
	  		if(SearchPage.searchQuery.domainQuery!=undefined&&SearchPage.searchQuery.domainQuery!='undefined'){
  				if (item.Parent===SearchPage.searchQuery.domainQuery.ID){
	  				return true;
	  			}
		  		else{
	  				return false;
	  			}
	  		}
	  		else{
	  			return false;
	  		}
	  	};

	  	this.setDomain=function(domainSet){
	  		SearchPage.searchQuery.domainQuery = domainSet;
	  	}

	  	this.checkIfsubdomainActiveFilter = function(item){
	  		if(SearchPage.searchQuery.domainQuery!=undefined&&SearchPage.searchQuery.domainQuery!='undefined'){
	  			return true;
	  		}
	  		else{
	  			return false;
	  		}
	  	};
	  	var subdomainsSelected = [];
	  	this.subdomainJSON = function (domainSelected){
	  		subdomainsSelected = [];//we initialize the subdomains selected
        //we also push the all option in the subdomains
        subdomainsSelected.push({
            Category:"All",
            ID:"1234567890123456789",
            Parent: domainSelected.ID
          });
	  		if(domainSelected.Category!="All"){
	  			for(var i=0;i<this.subdomainsTotal.length;i++){
  					var flag_parent_found=0;//flag to set to 1 when we find the parent
  					for(var j=0;j<parentDomains.length;j++){
  						if(this.subdomainsTotal[i].Parent==domainSelected.ID&&flag_parent_found==0){
  							subdomainsSelected.push(this.subdomainsTotal[i]);//the subdomains is of the domain selected
  							flag_parent_found=1;
  						}
  					}
  				}
	  		}
  			SearchPage.subdomains = subdomainsSelected;
		  }

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

  	//controller to set the default tab value and to check if it is active
  	app.controller('SearchModeTabController',function(){
	    this.advancedTab=1;//default tab to be active
	    //set the tab active on click
	    this.setTab = function(setTab){
	      this.advancedTab=setTab;
	    };
	    //returns true/false checking if the tab is active
	    this.isSet = function(checkTab){
	      return this.advancedTab===checkTab;
	    };
  	});

})();

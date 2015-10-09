(function(){
	var app = angular.module('qaApp', ['ngSanitize', 'ui.select']);
  	var requirementsClasses = [{name: 'Functional'},{name: 'Quality'},{name: 'Both'}];
	  var projects = []; //projects of S-CASE artefacts repo
	  /* Project detals
	    domain: value picked out of a pre-specified list of domains
	    sub-domains: ["sub1", "sub2", ...]
	  */
  	
    //==we use Google verticals for domains and subdomains
    //https://developers.google.com/adwords/api/docs/appendix/verticals
    //Domains with no parent are the domains in our case (var parentDomains below)
    //Domains with parents the domains with no parent are the subdomains in our case (var subdomains below)
    
  	//controloller to perform the search to the S-CASE artefacts repo
  	app.controller('SearchController',['$http','$rootScope',function($http,$rootScope){
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
	    	$rootScope.requirements=[]
	    	$rootScope.activitydiagrams=[]
	    	$rootScope.analysisclassdiagrams=[]
	    	$rootScope.storyboards=[]
	    	$rootScope.sourcecodes=[]
	    	$rootScope.scaseservices=[]
	    	if(domainString!="All"&&subdomainString!="All"){
	    		query = operations.replace(/,/g, '')
	    		$http({
		   			url: '/QAsearch',
		   			method: "GET",
		   			params: {
		   				q: query,
		   				domain: domainString,
		   				subdomain: subdomainString
		   			}
	   			})
		   		.success(function(data){
		   			//console.log(data.body)
		   			reqs=[]
		   			acts=[]
		   			anas=[]
		   			stos=[]
		   			sous=[]
		   			sers=[]
		   			if (data.body){
			  		SearchPage.searchResults=JSON.parse(data.body);//we get the data to the searchResults
			  		//we set every different result to the corresponding global variable
			  		//console.log(SearchPage.searchResults)
			  		for(var i=0;i<SearchPage.searchResults.length;i++){
			  			//check if the project is public or if the user owns or collaborates on it
			  			//console.log(SearchPage.searchResults[i].artefact);
			  			if(SearchPage.searchResults[i].artefact.privacyLevel==='PUBLIC'||SearchPage.searchResults[i].artefact.privacyLevel==null){//||isOwnerCollab(SearchPage.searchResults[i].artefact.projectName,SearchPage.usersProjects)){
			  				if(SearchPage.searchResults[i].artefact.type==='TEXTUAL'){
			  					if(requirementsClass=='Functional'){
			  						if(SearchPage.searchResults[i].artefact.payload[0].name=='functional'){
			  							reqs.push(SearchPage.searchResults[i]);
			  						}
			  					}
			  					else if(requirementsClass=='Quality'){
			  						if(SearchPage.searchResults[i].artefact.payload[0].name=='non-functional'){
			  							reqs.push(SearchPage.searchResults[i]);
			  						}
			  					}
			  					else if(requirementsClass=='Both'){
			  						reqs.push(SearchPage.searchResults[i]);
			  					}
			  				}
			  				if(SearchPage.searchResults[i].type==='activity diagram'){
		  						acts.push(SearchPage.searchResults[i]);
			  				}
			  				if(SearchPage.searchResults[i].type==='analysis class diagram'){
		  						anas.push(SearchPage.searchResults[i]);
			  				}
			  				if(SearchPage.searchResults[i].type==='storyboard'){
		  						stospush(SearchPage.searchResults[i]);
			  				}
			  				if(SearchPage.searchResults[i].type==='code'){
		  						sous.push(SearchPage.searchResults[i]);
			  				}
			  				if(SearchPage.searchResults[i].type==='service'){
		  						sers.push(SearchPage.searchResults[i]);
			  				}
			  					
			  			}
			  		}
			  	}
			  		SearchPage.searchResults=[];//we reset the search results
			  		$rootScope.requirements=reqs
			  		$rootScope.analysisclassdiagrams=anas;
			  		$rootScope.activitydiagrams=acts;
			  		$rootScope.storyboards=stos;
			  		$rootScope.sourcecodes=sous;
			  		$rootScope.scaseservices=sers;

			  	})
			  	.error(function(status){
			  		console.log(status);
			  	});
	    	}
	    	if(subdomainString=="All" && domainString!='All'){
	    		query = operations.replace(/,/g, '');
	    		//console.log(domainString)
	    		$http({
		   			url: '/QAsearch',
		   			method: "GET",
		   			params: {
		   				q: query,
		   				domain: domainString
		   			}
	   			})
		   		.success(function(data){
		   			//console.log(data.body)
		   			reqs=[]
		   			acts=[]
		   			anas=[]
		   			stos=[]
		   			sous=[]
		   			sers=[]
		   			if (data.body){
			  		SearchPage.searchResults=JSON.parse(data.body);//we get the data to the searchResults
			  		//we set every different result to the corresponding global variable
			  		//console.log(SearchPage.searchResults)
			  		for(var i=0;i<SearchPage.searchResults.length;i++){
			  			//check if the project is public or if the user owns or collaborates on it
			  			//console.log(SearchPage.searchResults[i].artefact);
			  			if(SearchPage.searchResults[i].artefact.privacyLevel==='PUBLIC'||SearchPage.searchResults[i].artefact.privacyLevel==null){//||isOwnerCollab(SearchPage.searchResults[i].artefact.projectName,SearchPage.usersProjects)){
			  				if(SearchPage.searchResults[i].artefact.type==='TEXTUAL'){
			  					if(requirementsClass=='Functional'){
			  						if(SearchPage.searchResults[i].artefact.payload[0].name=='functional'){
			  							reqs.push(SearchPage.searchResults[i]);
			  						}
			  					}
			  					else if(requirementsClass=='Quality'){
			  						if(SearchPage.searchResults[i].artefact.payload[0].name=='non-functional'){
			  							reqs.push(SearchPage.searchResults[i]);
			  						}
			  					}
			  					else if(requirementsClass=='Both'){
			  						reqs.push(SearchPage.searchResults[i]);
			  					}
			  				}
			  				if(SearchPage.searchResults[i].type==='activity diagram'){
		  						acts.push(SearchPage.searchResults[i]);
			  				}
			  				if(SearchPage.searchResults[i].type==='analysis class diagram'){
		  						anas.push(SearchPage.searchResults[i]);
			  				}
			  				if(SearchPage.searchResults[i].type==='storyboard'){
		  						stospush(SearchPage.searchResults[i]);
			  				}
			  				if(SearchPage.searchResults[i].type==='code'){
		  						sous.push(SearchPage.searchResults[i]);
			  				}
			  				if(SearchPage.searchResults[i].type==='service'){
		  						sers.push(SearchPage.searchResults[i]);
			  				}
			  					
			  			}
			  		}
			  	}
			  		SearchPage.searchResults=[];//we reset the search results
			  		$rootScope.requirements=reqs
			  		$rootScope.analysisclassdiagrams=anas;
			  		$rootScope.activitydiagrams=acts;
			  		$rootScope.storyboards=stos;
			  		$rootScope.sourcecodes=sous;
			  		$rootScope.scaseservices=sers;

			  	})
			  	
			  	.error(function(status){
			  		console.log(status);
			  	});

	    	}
	    	if(domainString=="All"){
	    		query = operations.replace(/,/g, '')
	    		$http({
		   			url: '/QAsearch',
		   			method: "GET",
					headers: {
						'Content-Type':'application/x-www-form-urlencoded'						
					},
					params: {
		   				q: query
		   			}
	   			})
		   		.success(function(data){
		   			//console.log(data.body)
		   			reqs=[]
		   			acts=[]
		   			anas=[]
		   			stos=[]
		   			sous=[]
		   			sers=[]
		   			if(data.body){
			  		SearchPage.searchResults=JSON.parse(data.body);//we get the data to the searchResults
			  		//we set every different result to the corresponding global variable
			  		//console.log(SearchPage.searchResults)
			  		for(var i=0;i<SearchPage.searchResults.length;i++){
			  			//check if the project is public or if the user owns or collaborates on it
			  			//console.log(SearchPage.searchResults[i].artefact);
			  			if(SearchPage.searchResults[i].artefact.privacyLevel==='PUBLIC'||SearchPage.searchResults[i].artefact.privacyLevel==null){//||isOwnerCollab(SearchPage.searchResults[i].artefact.projectName,SearchPage.usersProjects)){
			  				if(SearchPage.searchResults[i].artefact.type==='TEXTUAL'){
			  					if(requirementsClass=='Functional'){
			  						if(SearchPage.searchResults[i].artefact.payload[0].name=='functional'){
			  							reqs.push(SearchPage.searchResults[i]);
			  						}
			  					}
			  					else if(requirementsClass=='Quality'){
			  						if(SearchPage.searchResults[i].artefact.payload[0].name=='non-functional'){
			  							reqs.push(SearchPage.searchResults[i]);
			  						}
			  					}
			  					else if(requirementsClass=='Both'){
			  						reqs.push(SearchPage.searchResults[i]);
			  					}
			  				}
			  				if(SearchPage.searchResults[i].type==='activity diagram'){
		  						acts.push(SearchPage.searchResults[i]);
			  				}
			  				if(SearchPage.searchResults[i].type==='analysis class diagram'){
		  						anas.push(SearchPage.searchResults[i]);
			  				}
			  				if(SearchPage.searchResults[i].type==='storyboard'){
		  						stospush(SearchPage.searchResults[i]);
			  				}
			  				if(SearchPage.searchResults[i].type==='code'){
		  						sous.push(SearchPage.searchResults[i]);
			  				}
			  				if(SearchPage.searchResults[i].type==='service'){
		  						sers.push(SearchPage.searchResults[i]);
			  				}
			  					
			  			}
			  		}
			  	}
			  		SearchPage.searchResults=[];//we reset the search results
			  		$rootScope.requirements=reqs
			  		$rootScope.analysisclassdiagrams=anas;
			  		$rootScope.activitydiagrams=acts;
			  		$rootScope.storyboards=stos;
			  		$rootScope.sourcecodes=sous;
			  		$rootScope.scaseservices=sers;

			  	})
			  	.error(function(status){
			  		console.log(status);
			  	}); 
	    	}	
	    	
	    };

	    this.TransformFreeText = function(){
	    	var currentQuery = SearchPage.searchQuery;
	    	var quest = currentQuery.question;
	    	$rootScope.requirements=[]
	    	$rootScope.activitydiagrams=[]
	    	$rootScope.analysisclassdiagrams=[]
	    	$rootScope.storyboards=[]
	    	$rootScope.sourcecodes=[]
	    	$rootScope.scaseservices=[]
	    	$http.post('/QAfree', {question: quest}).
		   		then(function(response){
		   			data=response.data;
		   			query_terms=data.query_terms;
		   			for(var j=0;j<query_terms.length;j++){
		   				query=query_terms[i]+' ';
		   			}
		   			$http({
			   			url: '/QAsearch',
			   			method: "GET",
			   			headers: {
							'Content-Type':'application/x-www-form-urlencoded'						
						},
			   			params: {
			   				q: query
			   			}
		   			})
			   		.success(function(data){
		   			//console.log(data.body)
		   			reqs=[]
		   			acts=[]
		   			anas=[]
		   			stos=[]
		   			sous=[]
		   			sers=[]
		   			if(data.body){
			  		SearchPage.searchResults=JSON.parse(data.body);//we get the data to the searchResults
			  		//we set every different result to the corresponding global variable
			  		//console.log(SearchPage.searchResults)
			  		for(var i=0;i<SearchPage.searchResults.length;i++){
			  			//check if the project is public or if the user owns or collaborates on it
			  			//console.log(SearchPage.searchResults[i].artefact);
			  			if(SearchPage.searchResults[i].artefact.privacyLevel==='PUBLIC'||SearchPage.searchResults[i].artefact.privacyLevel==null){//||isOwnerCollab(SearchPage.searchResults[i].artefact.projectName,SearchPage.usersProjects)){
			  				if(SearchPage.searchResults[i].artefact.type==='TEXTUAL'){
			  					if(requirementsClass=='Functional'){
			  						if(SearchPage.searchResults[i].artefact.payload[0].name=='functional'){
			  							reqs.push(SearchPage.searchResults[i]);
			  						}
			  					}
			  					else if(requirementsClass=='Quality'){
			  						if(SearchPage.searchResults[i].artefact.payload[0].name=='non-functional'){
			  							reqs.push(SearchPage.searchResults[i]);
			  						}
			  					}
			  					else if(requirementsClass=='Both'){
			  						reqs.push(SearchPage.searchResults[i]);
			  					}
			  				}
			  				if(SearchPage.searchResults[i].type==='activity diagram'){
		  						acts.push(SearchPage.searchResults[i]);
			  				}
			  				if(SearchPage.searchResults[i].type==='analysis class diagram'){
		  						anas.push(SearchPage.searchResults[i]);
			  				}
			  				if(SearchPage.searchResults[i].type==='storyboard'){
		  						stospush(SearchPage.searchResults[i]);
			  				}
			  				if(SearchPage.searchResults[i].type==='code'){
		  						sous.push(SearchPage.searchResults[i]);
			  				}
			  				if(SearchPage.searchResults[i].type==='service'){
		  						sers.push(SearchPage.searchResults[i]);
			  				}
			  					
			  			}
			  		}
			  	}
			  		SearchPage.searchResults=[];//we reset the search results
			  		$rootScope.requirements=reqs
			  		$rootScope.analysisclassdiagrams=anas;
			  		$rootScope.activitydiagrams=acts;
			  		$rootScope.storyboards=stos;
			  		$rootScope.sourcecodes=sous;
			  		$rootScope.scaseservices=sers;

			  	})
				  	.error(function(status){
				  		console.log(status);
				  	}); 

		   		}, function(response){
		   			console.log(response)
		   		})


	    }
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
  					for(var j=0;j<SearchPage.domains.length;j++){
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

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
    	loadMessage=false;
	resMessage=false;
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
	    	//alert('I am fetching results...Please close the window to get results!')
	    	$rootScope.loadMessage=true;
		$rootScope.resMessage=false;
	    	console.log($rootScope.loadMessage)
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
		$rootScope.osrfsnippets=[];
	    	if(domainString!="All"&&subdomainString!="All"){
	    		query = operations.replace(/,/g, '');
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
		   			// Now I will explain the two following lines of code since they are a little misleading..
		   			// The query used to return a single object named "data" containing the QA results
		   			// Now the data contains two objects "QA" and "OSRF" containing the QA and OSRF results respectively.
		   			// So, I set the variable "osrfdata" to have the OSRF results and the variable "data" to have the QA results.
		   			var osrfdata = data.OSRF;
		   			var data = data.QA;
		   			//console.log(data.body)
		   			reqs=[]
		   			acts=[]
		   			anas=[]
		   			stos=[]
		   			sous=[]
		   			sers=[]
		   			snippets = []
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
			  		$rootScope.resMessage=true;
					$rootScope.loadMessage=false;
			  	}	
			  	if (osrfdata!=undefined && osrfdata.body){
			  		var OSRFSearchResults=JSON.parse(osrfdata.body);//we get the data to the searchResults
			  		OSRFSearchResults = OSRFSearchResults.result;
			  		for(var i=0;i<OSRFSearchResults.length;i++){
			  			snippets.push(OSRFSearchResults[i]);
			  		}
			  	}


			  		// alert('...I got the results! Browse the tabs!')
			  		SearchPage.searchResults=[];//we reset the search results
			  		$rootScope.requirements=reqs
			  		$rootScope.analysisclassdiagrams=anas;
			  		$rootScope.activitydiagrams=acts;
			  		$rootScope.storyboards=stos;
			  		$rootScope.sourcecodes=sous;
			  		$rootScope.scaseservices=sers;
			  		$rootScope.osrfsnippets=snippets;

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
		   			// Now I will explain the two following lines of code since they are a little misleading..
		   			// The query used to return a single object named "data" containing the QA results
		   			// Now the data contains two objects "QA" and "OSRF" containing the QA and OSRF results respectively.
		   			// So, I set the variable "osrfdata" to have the OSRF results and the variable "data" to have the QA results.
		   			var osrfdata = data.OSRF;
		   			var data = data.QA;
		   			//console.log(data.body)
		   			reqs=[]
		   			acts=[]
		   			anas=[]
		   			stos=[]
		   			sous=[]
		   			sers=[]
		   			snippets = []
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
			  		$rootScope.resMessage=true;
					$rootScope.loadMessage=false;
			  	}

			  	if (osrfdata!=undefined && osrfdata.body){
			  		var OSRFSearchResults=JSON.parse(osrfdata.body);//we get the data to the searchResults
			  		OSRFSearchResults = OSRFSearchResults.result;
			  		for(var i=0;i<OSRFSearchResults.length;i++){
			  			snippets.push(OSRFSearchResults[i]);
			  		}
			  	}

			  		//alert('...I got results! Browse the tabs!')
			  		SearchPage.searchResults=[];//we reset the search results
			  		$rootScope.requirements=reqs
			  		$rootScope.analysisclassdiagrams=anas;
			  		$rootScope.activitydiagrams=acts;
			  		$rootScope.storyboards=stos;
			  		$rootScope.sourcecodes=sous;
			  		$rootScope.scaseservices=sers;
			  		$rootScope.osrfsnippets=snippets;

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
		   			//console.log(data);
		   			// Now I will explain the two following lines of code since they are a little misleading..
		   			// The query used to return a single object named "data" containing the QA results
		   			// Now the data contains two objects "QA" and "OSRF" containing the QA and OSRF results respectively.
		   			// So, I set the variable "osrfdata" to have the OSRF results and the variable "data" to have the QA results.
		   			var osrfdata = data.OSRF;
		   			var data = data.QA;
		   			//
		   			reqs=[]
		   			acts=[]
		   			anas=[]
		   			stos=[]
		   			sous=[]
		   			sers=[]
		   			snippets = []
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
			  		$rootScope.resMessage=true;
					$rootScope.loadMessage=false;
			  	}
			  	if (osrfdata!=undefined && osrfdata.body){
			  		var OSRFSearchResults=JSON.parse(osrfdata.body);//we get the data to the searchResults
			  		OSRFSearchResults = OSRFSearchResults.result;
			  		for(var i=0;i<OSRFSearchResults.length;i++){
			  			snippets.push(OSRFSearchResults[i]);
			  		}
			  	}
			  		
			  		//alert('...I got results! Browse the tabs!');
			  		SearchPage.searchResults=[];//we reset the search results
			  		$rootScope.requirements=reqs;
			  		$rootScope.analysisclassdiagrams=anas;
			  		$rootScope.activitydiagrams=acts;
			  		$rootScope.storyboards=stos;
			  		$rootScope.sourcecodes=sous;
			  		$rootScope.scaseservices=sers;
			  		$rootScope.osrfsnippets=snippets;

			  	})
			  	.error(function(status){
			  		console.log(status);
			  	}); 
	    	}	
	    	
	    };

	    this.TransformFreeText = function(){
	    	//alert('I am fetching results...please close the window to get results!')
	    	$rootScope.loadMessage=true;
		$rootScope.resMessage=false;
	    	//console.log($rootScope.loadMessage)
	    	var currentQuery = SearchPage.searchQuery;
	    	var quest = currentQuery.question;
	    	$rootScope.requirements=[]
	    	$rootScope.activitydiagrams=[]
	    	$rootScope.analysisclassdiagrams=[]
	    	$rootScope.storyboards=[]
	    	$rootScope.sourcecodes=[]
	    	$rootScope.scaseservices=[]
	    	$rootScope.osrfsnippets=[]
	    	$http.post('/QAfree', {question: quest}).
		   		then(function(response){
		   			var query_terms=response.data;
		   			console.log('i am in')
		   			console.log(query_terms);
		   			var query='';
		   			functional_flag=0
		   			quality_flag=0
		   			for(var j=0;j<query_terms.length;j++){
		   				query=query+query_terms[j]+' ';
		   			}
		   			query=query.toLowerCase();
		   			/*for(var j=0;j<query_terms.length;j++){
		   				if (query_terms[i].indexOf('requirement')>-1){
		   					if (((i-1>-1) && (query_terms[i-1]=='functional'))|| ((i+1<query_terms.length) && (query_terms[i+1]=='functional')) ){
		
			   						functional_flag=1;
			   						query=query.replace('requirements','');
			   						query=query.replace('requirement','');
			   						query=query.replace('functional','');

		   					}
		   					if (((i-1>-1) && (query_terms[i-1]=='quality'))|| ((i+1<query_terms.length) && (query_terms[i+1]=='quality')) ){
		
			   						quality_flag=1
			   						query=query.replace('requirements','');
			   						query=query.replace('requirement','');
			   						query=query.replace('quality','');

		   					}
		   					if (((i-1>-1) && (query_terms[i-1]=='non-functional'))|| ((i+1<query_terms.length) && (query_terms[i+1]=='non-functional')) ){
		
			   						quality_flag=1
			   						query=query.replace('requirements','');
			   						query=query.replace('requirement','');
			   						query=query.replace('non-functional','');

		   					}
		   					if (((i-1>-1) && (query_terms[i-1]=='non functional'))|| ((i+1<query_terms.length) && (query_terms[i+1]=='non functional')) ){
		
			   						quality_flag=1
			   						query=query.replace('requirements','');
			   						query=query.replace('requirement','');
			   						query=query.replace('non functional','');

		   					}
		   				}
		   			}
		   			console.log(query)
		   			console.log(quality_flag)
		   			console.log(functional_flag)*/
		   			console.log(query)
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
		   			//console.log(data);
		   			// Now I will explain the two following lines of code since they are a little misleading..
		   			// The query used to return a single object named "data" containing the QA results
		   			// Now the data contains two objects "QA" and "OSRF" containing the QA and OSRF results respectively.
		   			// So, I set the variable "osrfdata" to have the OSRF results and the variable "data" to have the QA results.
		   			var osrfdata = data.OSRF;
		   			var data = data.QA;
		   			//console.log(data.body);
		   			//console.log('i am in');
		   			reqs=[]
		   			acts=[]
		   			anas=[]
		   			stos=[]
		   			sous=[]
		   			sers=[]
		   			snippets=[]
		   			if(data.body){
			  		SearchPage.searchResults=JSON.parse(data.body);//we get the data to the searchResults
			  		//we set every different result to the corresponding global variable
			  		//console.log(SearchPage.searchResults)
			  		for(var i=0;i<SearchPage.searchResults.length;i++){
			  			//check if the project is public or if the user owns or collaborates on it
			  			//console.log(SearchPage.searchResults[i].artefact);
			  			if(SearchPage.searchResults[i].artefact.privacyLevel==='PUBLIC'||SearchPage.searchResults[i].artefact.privacyLevel==null){//||isOwnerCollab(SearchPage.searchResults[i].artefact.projectName,SearchPage.usersProjects)){
			  				if(SearchPage.searchResults[i].artefact.type==='TEXTUAL'){
			  					if(functional_flag==1 && quality_flag==0){
			  						if(SearchPage.searchResults[i].artefact.payload[0].name=='functional'){
			  							reqs.push(SearchPage.searchResults[i]);
			  						}
			  					}
			  					else if(quality_flag==1 && functional_flag==0){
			  						if(SearchPage.searchResults[i].artefact.payload[0].name=='non-functional'){
			  							reqs.push(SearchPage.searchResults[i]);
			  						}
			  					}
			  					else {
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
			  		$rootScope.resMessage=true;
					$rootScope.loadMessage=false;
			  	}

			  	if (osrfdata!=undefined && osrfdata.body){
			  		var OSRFSearchResults=JSON.parse(osrfdata.body);//we get the data to the searchResults
			  		OSRFSearchResults = OSRFSearchResults.result;
			  		for(var i=0;i<OSRFSearchResults.length;i++){
			  			snippets.push(OSRFSearchResults[i]);
			  		}
			  	}

			  		SearchPage.searchResults=[];//we reset the search results
			  		$rootScope.requirements=reqs
			  		$rootScope.analysisclassdiagrams=anas;
			  		$rootScope.activitydiagrams=acts;
			  		$rootScope.storyboards=stos;
			  		$rootScope.sourcecodes=sous;
			  		$rootScope.scaseservices=sers;
			  		$rootScope.osrfsnippets=snippets;
			  		//alert('...I got results! Browse the tabs!')
			  		

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
  	app.controller('TabController',['$rootScope',function($rootScope){
	    this.tab=1;//default tab to be active

	    //set the tab active on click
	    this.setTab = function(setTab){
	      this.tab=setTab;
	      if (setTab==1){
	      	$rootScope.resMessage=false;
    		$rootScope.loadMessage=false;
	      }
	    };
	    //returns true/false checking if the tab is active
	    this.isSet = function(checkTab){
	      return this.tab===checkTab;
	    };
  	}]);

  	//controller to set the default tab value and to check if it is active
  	/*app.controller('SearchModeTabController',function(){
	    this.advancedTab=1;//default tab to be active
	    //set the tab active on click
	    this.setTab = function(setTab){
	      this.advancedTab=setTab;
	    };
	    //returns true/false checking if the tab is active
	    this.isSet = function(checkTab){
	      return this.advancedTab===checkTab;
	    };
  	});*/

})();

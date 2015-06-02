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
	  	SearchPage.domains=parentDomains;
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
					        "_all": operations.replace(/,/g, '');
					      }
					    },
					    "filter": {
					      "bool": {
					        "must": {
					          [
					            {
					              "match": {
					                "domain": domainString
					              }
					            },
					            {
					              "match": {
					                "subdomain": subdomainString
					              }
					            }					           
					          ]
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
					        "_all": operations.replace(/,/g, '');
					      }
					    },
					    "filter": {
					      "bool": {
					        "must": {
					            {
					              "match": {
					                "domain": domainString
					              }
					            }
					        }
					      }
					    }
					  }
					}; 

	    	}
	    	if(domainString=="All"){
	    		query = {
					  "filtered": {
					    "query": {
					      "match": {
					        "_all": operations.replace(/,/g, '');
					      }
					    }
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
	  						SearchPage.sourcecodes.push(SearchPage.searchResults[i]);
		  				}
		  					
		  			}
		  		}
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
	  			for(var i=0;i<subdomains.length;i++){
  					var flag_parent_found=0;//flag to set to 1 when we find the parent
  					for(var j=0;j<parentDomains.length;j++){
  						if(subdomains[i].Parent==domainSelected.ID&&flag_parent_found==0){
  							subdomainsSelected.push(subdomains[i]);//the subdomains is of the domain selected
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
  	

  	var domains = [

  {
    Category:"Arts & Entertainment",
    ID:"3",
    Parent:"0"
  },
  {
    Category:"Celebrities & Entertainment News",
    ID:"184",
    Parent:"3"
  },
  {
    Category:"Comics & Animation",
    ID:"316",
    Parent:"3"
  },
  {
    Category:"Anime & Manga",
    ID:"317",
    Parent:"316"
  },
  {
    Category:"Cartoons",
    ID:"319",
    Parent:"316"
  },
  {
    Category:"Comics",
    ID:"318",
    Parent:"316"
  },
  {
    Category:"Entertainment Industry",
    ID:"612",
    Parent:"3"
  },
  {
    Category:"Film & TV Industry",
    ID:"1116",
    Parent:"612"
  },
  {
    Category:"Film & TV Awards",
    ID:"1108",
    Parent:"1116"
  },
  {
    Category:"Film & TV Production",
    ID:"1117",
    Parent:"1116"
  },
  {
    Category:"Recording Industry",
    ID:"1115",
    Parent:"612"
  },
  {
    Category:"Music Awards",
    ID:"1113",
    Parent:"1115"
  },
  {
    Category:"Record Labels",
    ID:"1114",
    Parent:"1115"
  },
  {
    Category:"Events & Listings",
    ID:"569",
    Parent:"3"
  },
  {
    Category:"Bars, Clubs & Nightlife",
    ID:"188",
    Parent:"569"
  },
  {
    Category:"Concerts & Music Festivals",
    ID:"891",
    Parent:"569"
  },
  {
    Category:"Event Ticket Sales",
    ID:"614",
    Parent:"569"
  },
  {
    Category:"Expos & Conventions",
    ID:"1531",
    Parent:"569"
  },
  {
    Category:"Film Festivals",
    ID:"1086",
    Parent:"569"
  },
  {
    Category:"Food & Beverage Events",
    ID:"1530",
    Parent:"569"
  },
  {
    Category:"Live Sporting Events",
    ID:"1273",
    Parent:"569"
  },
  {
    Category:"Movie Listings & Theater Showtimes",
    ID:"1085",
    Parent:"569"
  },
  {
    Category:"Fun & Trivia",
    ID:"539",
    Parent:"3"
  },
  {
    Category:"Flash-Based Entertainment",
    ID:"447",
    Parent:"539"
  },
  {
    Category:"Fun Tests & Silly Surveys",
    ID:"1174",
    Parent:"539"
  },
  {
    Category:"Humor",
    ID:"182",
    Parent:"3"
  },
  {
    Category:"Live Comedy",
    ID:"895",
    Parent:"182"
  },
  {
    Category:"Political Humor",
    ID:"1180",
    Parent:"182"
  },
  {
    Category:"Spoofs & Satire",
    ID:"1244",
    Parent:"182"
  },
  {
    Category:"Movies",
    ID:"34",
    Parent:"3"
  },
  {
    Category:"Action & Adventure Films",
    ID:"1097",
    Parent:"34"
  },
  {
    Category:"Martial Arts Films",
    ID:"1101",
    Parent:"1097"
  },
  {
    Category:"Superhero Films",
    ID:"1100",
    Parent:"1097"
  },
  {
    Category:"Western Films",
    ID:"1099",
    Parent:"1097"
  },
  {
    Category:"Animated Films",
    ID:"1104",
    Parent:"34"
  },
  {
    Category:"Bollywood & South Asian Film",
    ID:"360",
    Parent:"34"
  },
  {
    Category:"Classic Films",
    ID:"1102",
    Parent:"34"
  },
  {
    Category:"Silent Films",
    ID:"1098",
    Parent:"1102"
  },
  {
    Category:"Comedy Films",
    ID:"1095",
    Parent:"34"
  },
  {
    Category:"Cult & Indie Films",
    ID:"1103",
    Parent:"34"
  },
  {
    Category:"DVD & Video Shopping",
    ID:"210",
    Parent:"34"
  },
  {
    Category:"DVD & Video Rentals",
    ID:"1145",
    Parent:"210"
  },
  {
    Category:"Documentary Films",
    ID:"1072",
    Parent:"34"
  },
  {
    Category:"Drama Films",
    ID:"1094",
    Parent:"34"
  },
  {
    Category:"Family Films",
    ID:"1291",
    Parent:"34"
  },
  {
    Category:"Horror Films",
    ID:"615",
    Parent:"34"
  },
  {
    Category:"Movie Memorabilia",
    ID:"213",
    Parent:"34"
  },
  {
    Category:"Movie Reference",
    ID:"1106",
    Parent:"34"
  },
  {
    Category:"Movie Reviews & Previews",
    ID:"1107",
    Parent:"1106"
  },
  {
    Category:"Musical Films",
    ID:"1105",
    Parent:"34"
  },
  {
    Category:"Romance Films",
    ID:"1310",
    Parent:"34"
  },
  {
    Category:"Science Fiction & Fantasy Films",
    ID:"616",
    Parent:"34"
  },
  {
    Category:"Thriller, Crime & Mystery Films",
    ID:"1096",
    Parent:"34"
  },
  {
    Category:"Music & Audio",
    ID:"35",
    Parent:"3"
  },
  {
    Category:"CD & Audio Shopping",
    ID:"217",
    Parent:"35"
  },
  {
    Category:"Classical Music",
    ID:"586",
    Parent:"35"
  },
  {
    Category:"Country Music",
    ID:"587",
    Parent:"35"
  },
  {
    Category:"Dance & Electronic Music",
    ID:"588",
    Parent:"35"
  },
  {
    Category:"Experimental & Industrial Music",
    ID:"1022",
    Parent:"35"
  },
  {
    Category:"Folk & Traditional Music",
    ID:"1023",
    Parent:"35"
  },
  {
    Category:"Jazz & Blues",
    ID:"589",
    Parent:"35"
  },
  {
    Category:"Blues",
    ID:"1040",
    Parent:"589"
  },
  {
    Category:"Jazz",
    ID:"42",
    Parent:"589"
  },
  {
    Category:"Music Art & Memorabilia",
    ID:"218",
    Parent:"35"
  },
  {
    Category:"Music Education & Instruction",
    ID:"1087",
    Parent:"35"
  },
  {
    Category:"Music Equipment & Technology",
    ID:"1024",
    Parent:"35"
  },
  {
    Category:"DJ Resources & Equipment",
    ID:"1025",
    Parent:"1024"
  },
  {
    Category:"Music Recording Technology",
    ID:"1026",
    Parent:"1024"
  },
  {
    Category:"Musical Instruments",
    ID:"216",
    Parent:"1024"
  },
  {
    Category:"Drums & Percussion",
    ID:"1327",
    Parent:"216"
  },
  {
    Category:"Guitars",
    ID:"1325",
    Parent:"216"
  },
  {
    Category:"Pianos & Keyboards",
    ID:"1326",
    Parent:"216"
  },
  {
    Category:"Samples & Sound Libraries",
    ID:"1091",
    Parent:"1024"
  },
  {
    Category:"Music Reference",
    ID:"1027",
    Parent:"35"
  },
  {
    Category:"Music Composition & Theory",
    ID:"1028",
    Parent:"1027"
  },
  {
    Category:"Sheet Music",
    ID:"892",
    Parent:"1027"
  },
  {
    Category:"Song Lyrics & Tabs",
    ID:"617",
    Parent:"1027"
  },
  {
    Category:"Music Streams & Downloads",
    ID:"220",
    Parent:"35"
  },
  {
    Category:"Music Videos",
    ID:"1408",
    Parent:"35"
  },
  {
    Category:"Pop Music",
    ID:"1021",
    Parent:"35"
  },
  {
    Category:"Radio",
    ID:"215",
    Parent:"35"
  },
  {
    Category:"Podcasting",
    ID:"809",
    Parent:"215"
  },
  {
    Category:"Talk Radio",
    ID:"1186",
    Parent:"215"
  },
  {
    Category:"Religious Music",
    ID:"1020",
    Parent:"35"
  },
  {
    Category:"Christian & Gospel Music",
    ID:"585",
    Parent:"1020"
  },
  {
    Category:"Rock Music",
    ID:"590",
    Parent:"35"
  },
  {
    Category:"Classic Rock & Oldies",
    ID:"1037",
    Parent:"590"
  },
  {
    Category:"Hard Rock & Progressive",
    ID:"1035",
    Parent:"590"
  },
  {
    Category:"Indie & Alternative Music",
    ID:"1038",
    Parent:"590"
  },
  {
    Category:"Metal (Music)",
    ID:"1036",
    Parent:"590"
  },
  {
    Category:"Punk (Music)",
    ID:"1041",
    Parent:"590"
  },
  {
    Category:"Soundtracks",
    ID:"893",
    Parent:"35"
  },
  {
    Category:"Urban & Hip-Hop",
    ID:"592",
    Parent:"35"
  },
  {
    Category:"Rap & Hip-Hop",
    ID:"1030",
    Parent:"592"
  },
  {
    Category:"Reggaeton",
    ID:"1242",
    Parent:"592"
  },
  {
    Category:"Soul & R&B",
    ID:"1039",
    Parent:"592"
  },
  {
    Category:"Vocals & Show Tunes",
    ID:"618",
    Parent:"35"
  },
  {
    Category:"World Music",
    ID:"593",
    Parent:"35"
  },
  {
    Category:"African Music",
    ID:"1208",
    Parent:"593"
  },
  {
    Category:"Arab & Middle Eastern Music",
    ID:"1034",
    Parent:"593"
  },
  {
    Category:"East Asian Music",
    ID:"1033",
    Parent:"593"
  },
  {
    Category:"Latin American Music",
    ID:"591",
    Parent:"593"
  },
  {
    Category:"Brazilian Music",
    ID:"1287",
    Parent:"591"
  },
  {
    Category:"Latin Pop",
    ID:"1285",
    Parent:"591"
  },
  {
    Category:"Salsa & Tropical Music",
    ID:"1286",
    Parent:"591"
  },
  {
    Category:"Reggae & Caribbean Music",
    ID:"1031",
    Parent:"593"
  },
  {
    Category:"South Asian Music",
    ID:"1032",
    Parent:"593"
  },
  {
    Category:"Offbeat",
    ID:"33",
    Parent:"3"
  },
  {
    Category:"Edgy & Bizarre",
    ID:"538",
    Parent:"33"
  },
  {
    Category:"Occult & Paranormal",
    ID:"449",
    Parent:"33"
  },
  {
    Category:"Online Media",
    ID:"613",
    Parent:"3"
  },
  {
    Category:"Online Image Galleries",
    ID:"1222",
    Parent:"613"
  },
  {
    Category:"Webcams & Virtual Tours",
    ID:"575",
    Parent:"613"
  },
  {
    Category:"Performing Arts",
    ID:"23",
    Parent:"3"
  },
  {
    Category:"Acting & Theater",
    ID:"894",
    Parent:"23"
  },
  {
    Category:"Broadway & Musical Theater",
    ID:"1243",
    Parent:"23"
  },
  {
    Category:"Circus",
    ID:"1591",
    Parent:"23"
  },
  {
    Category:"Dance",
    ID:"581",
    Parent:"23"
  },
  {
    Category:"Magic",
    ID:"1592",
    Parent:"23"
  },
  {
    Category:"Opera",
    ID:"1185",
    Parent:"23"
  },
  {
    Category:"TV & Video",
    ID:"36",
    Parent:"3"
  },
  {
    Category:"Online Video",
    ID:"211",
    Parent:"36"
  },
  {
    Category:"Web Series",
    ID:"1409",
    Parent:"211"
  },
  {
    Category:"TV Commercials",
    ID:"1055",
    Parent:"36"
  },
  {
    Category:"TV Guides & Reference",
    ID:"1187",
    Parent:"36"
  },
  {
    Category:"TV Networks & Stations",
    ID:"359",
    Parent:"36"
  },
  {
    Category:"TV Shows & Programs",
    ID:"358",
    Parent:"36"
  },
  {
    Category:"TV Comedies",
    ID:"1047",
    Parent:"358"
  },
  {
    Category:"TV Documentary & Nonfiction",
    ID:"1411",
    Parent:"358"
  },
  {
    Category:"TV Dramas",
    ID:"1193",
    Parent:"358"
  },
  {
    Category:"TV Crime & Legal Shows",
    ID:"1111",
    Parent:"1193"
  },
  {
    Category:"TV Medical Shows",
    ID:"1194",
    Parent:"1193"
  },
  {
    Category:"TV Soap Operas",
    ID:"357",
    Parent:"1193"
  },
  {
    Category:"TV Family-Oriented Shows",
    ID:"1110",
    Parent:"358"
  },
  {
    Category:"TV Game Shows",
    ID:"1050",
    Parent:"358"
  },
  {
    Category:"TV Reality Shows",
    ID:"1049",
    Parent:"358"
  },
  {
    Category:"TV Sci-Fi & Fantasy Shows",
    ID:"1112",
    Parent:"358"
  },
  {
    Category:"TV Talent & Variety Shows",
    ID:"1410",
    Parent:"358"
  },
  {
    Category:"TV Talk Shows",
    ID:"1048",
    Parent:"358"
  },
  {
    Category:"Visual Art & Design",
    ID:"24",
    Parent:"3"
  },
  {
    Category:"Architecture",
    ID:"477",
    Parent:"24"
  },
  {
    Category:"Art & Craft Supplies",
    ID:"1361",
    Parent:"24"
  },
  {
    Category:"Art Museums & Galleries",
    ID:"1521",
    Parent:"24"
  },
  {
    Category:"Arts Education",
    ID:"1195",
    Parent:"24"
  },
  {
    Category:"Design",
    ID:"653",
    Parent:"24"
  },
  {
    Category:"Graphic Design",
    ID:"654",
    Parent:"653"
  },
  {
    Category:"Industrial & Product Design",
    ID:"655",
    Parent:"653"
  },
  {
    Category:"Interior Design",
    ID:"656",
    Parent:"653"
  },
  {
    Category:"Painting",
    ID:"1167",
    Parent:"24"
  },
  {
    Category:"Photographic & Digital Arts",
    ID:"439",
    Parent:"24"
  },
  {
    Category:"Sculpture",
    ID:"1412",
    Parent:"24"
  },
  {
    Category:"Autos & Vehicles",
    ID:"47",
    Parent:"0"
  },
  {
    Category:"Bicycles & Accessories",
    ID:"1191",
    Parent:"47"
  },
  {
    Category:"BMX Bikes",
    ID:"1402",
    Parent:"1191"
  },
  {
    Category:"Bike Accessories",
    ID:"1398",
    Parent:"1191"
  },
  {
    Category:"Bike Frames",
    ID:"1399",
    Parent:"1191"
  },
  {
    Category:"Bike Helmets & Protective Gear",
    ID:"1400",
    Parent:"1191"
  },
  {
    Category:"Bike Parts & Repair",
    ID:"1401",
    Parent:"1191"
  },
  {
    Category:"Cruiser Bikes",
    ID:"1403",
    Parent:"1191"
  },
  {
    Category:"Cycling Apparel",
    ID:"1407",
    Parent:"1191"
  },
  {
    Category:"Kid's Bikes",
    ID:"1404",
    Parent:"1191"
  },
  {
    Category:"Mountain Bikes",
    ID:"1405",
    Parent:"1191"
  },
  {
    Category:"Road Bikes",
    ID:"1406",
    Parent:"1191"
  },
  {
    Category:"Boats & Watercraft",
    ID:"1140",
    Parent:"47"
  },
  {
    Category:"Campers & RVs",
    ID:"1213",
    Parent:"47"
  },
  {
    Category:"Classic Vehicles",
    ID:"1013",
    Parent:"47"
  },
  {
    Category:"Commercial Vehicles",
    ID:"1214",
    Parent:"47"
  },
  {
    Category:"Cargo Trucks & Trailers",
    ID:"1215",
    Parent:"1214"
  },
  {
    Category:"Custom & Performance Vehicles",
    ID:"806",
    Parent:"47"
  },
  {
    Category:"Hybrid & Alternative Vehicles",
    ID:"810",
    Parent:"47"
  },
  {
    Category:"Electric & Plug-In Vehicles",
    ID:"1380",
    Parent:"810"
  },
  {
    Category:"Microcars & City Cars",
    ID:"1317",
    Parent:"47"
  },
  {
    Category:"Motorcycles",
    ID:"273",
    Parent:"47"
  },
  {
    Category:"Off-Road Vehicles",
    ID:"148",
    Parent:"47"
  },
  {
    Category:"Personal Aircraft",
    ID:"1147",
    Parent:"47"
  },
  {
    Category:"Scooters & Mopeds",
    ID:"1212",
    Parent:"47"
  },
  {
    Category:"Trucks & SUVs",
    ID:"610",
    Parent:"47"
  },
  {
    Category:"SUVs",
    ID:"1057",
    Parent:"610"
  },
  {
    Category:"Trucks",
    ID:"1056",
    Parent:"610"
  },
  {
    Category:"Vans & Minivans",
    ID:"1058",
    Parent:"610"
  },
  {
    Category:"Vehicle Brands",
    ID:"815",
    Parent:"47"
  },
  {
    Category:"Acura",
    ID:"820",
    Parent:"815"
  },
  {
    Category:"Audi",
    ID:"821",
    Parent:"815"
  },
  {
    Category:"BMW",
    ID:"822",
    Parent:"815"
  },
  {
    Category:"Bentley",
    ID:"1059",
    Parent:"815"
  },
  {
    Category:"Buick",
    ID:"1060",
    Parent:"815"
  },
  {
    Category:"Cadillac",
    ID:"823",
    Parent:"815"
  },
  {
    Category:"Chevrolet",
    ID:"826",
    Parent:"815"
  },
  {
    Category:"Chrysler",
    ID:"833",
    Parent:"815"
  },
  {
    Category:"Citroën",
    ID:"834",
    Parent:"815"
  },
  {
    Category:"Dodge",
    ID:"836",
    Parent:"815"
  },
  {
    Category:"Ferrari",
    ID:"1061",
    Parent:"815"
  },
  {
    Category:"Fiat",
    ID:"838",
    Parent:"815"
  },
  {
    Category:"Alfa Romeo",
    ID:"1413",
    Parent:"838"
  },
  {
    Category:"Ford",
    ID:"840",
    Parent:"815"
  },
  {
    Category:"GM-Daewoo",
    ID:"896",
    Parent:"815"
  },
  {
    Category:"GMC",
    ID:"842",
    Parent:"815"
  },
  {
    Category:"Honda",
    ID:"843",
    Parent:"815"
  },
  {
    Category:"Hummer",
    ID:"1062",
    Parent:"815"
  },
  {
    Category:"Hyundai",
    ID:"845",
    Parent:"815"
  },
  {
    Category:"Isuzu",
    ID:"1378",
    Parent:"815"
  },
  {
    Category:"Jaguar",
    ID:"1063",
    Parent:"815"
  },
  {
    Category:"Jeep",
    ID:"846",
    Parent:"815"
  },
  {
    Category:"Kia",
    ID:"848",
    Parent:"815"
  },
  {
    Category:"Lamborghini",
    ID:"1064",
    Parent:"815"
  },
  {
    Category:"Land Rover",
    ID:"1065",
    Parent:"815"
  },
  {
    Category:"Lexus",
    ID:"849",
    Parent:"815"
  },
  {
    Category:"Lincoln",
    ID:"850",
    Parent:"815"
  },
  {
    Category:"Maserati",
    ID:"1066",
    Parent:"815"
  },
  {
    Category:"Mazda",
    ID:"851",
    Parent:"815"
  },
  {
    Category:"Mercedes-Benz",
    ID:"852",
    Parent:"815"
  },
  {
    Category:"Mercury",
    ID:"853",
    Parent:"815"
  },
  {
    Category:"Mini",
    ID:"1067",
    Parent:"815"
  },
  {
    Category:"Mitsubishi",
    ID:"854",
    Parent:"815"
  },
  {
    Category:"Nissan",
    ID:"855",
    Parent:"815"
  },
  {
    Category:"Infiniti",
    ID:"1377",
    Parent:"855"
  },
  {
    Category:"Peugeot",
    ID:"856",
    Parent:"815"
  },
  {
    Category:"Pontiac",
    ID:"857",
    Parent:"815"
  },
  {
    Category:"Porsche",
    ID:"858",
    Parent:"815"
  },
  {
    Category:"Renault-Samsung",
    ID:"859",
    Parent:"815"
  },
  {
    Category:"Rolls-Royce",
    ID:"1068",
    Parent:"815"
  },
  {
    Category:"SEAT",
    ID:"1414",
    Parent:"815"
  },
  {
    Category:"Saab",
    ID:"897",
    Parent:"815"
  },
  {
    Category:"Saturn",
    ID:"860",
    Parent:"815"
  },
  {
    Category:"Subaru",
    ID:"861",
    Parent:"815"
  },
  {
    Category:"Suzuki",
    ID:"1070",
    Parent:"815"
  },
  {
    Category:"Toyota",
    ID:"863",
    Parent:"815"
  },
  {
    Category:"Scion",
    ID:"1069",
    Parent:"863"
  },
  {
    Category:"Vauxhall-Opel",
    ID:"898",
    Parent:"815"
  },
  {
    Category:"Volkswagen",
    ID:"865",
    Parent:"815"
  },
  {
    Category:"Volvo",
    ID:"867",
    Parent:"815"
  },
  {
    Category:"Vehicle Codes & Driving Laws",
    ID:"1294",
    Parent:"47"
  },
  {
    Category:"Drunk Driving Law",
    ID:"968",
    Parent:"1294"
  },
  {
    Category:"Vehicle & Traffic Safety",
    ID:"1416",
    Parent:"1294"
  },
  {
    Category:"Vehicle Licensing & Registration",
    ID:"170",
    Parent:"1294"
  },
  {
    Category:"Driving Instruction & Driver Education",
    ID:"1415",
    Parent:"170"
  },
  {
    Category:"Vehicle Maintenance",
    ID:"138",
    Parent:"47"
  },
  {
    Category:"Vehicle Parts & Accessories",
    ID:"89",
    Parent:"47"
  },
  {
    Category:"Auto Exterior",
    ID:"1217",
    Parent:"89"
  },
  {
    Category:"Auto Interior",
    ID:"1218",
    Parent:"89"
  },
  {
    Category:"Engine & Transmission",
    ID:"1216",
    Parent:"89"
  },
  {
    Category:"Vehicle Fuels & Lubricants",
    ID:"1269",
    Parent:"89"
  },
  {
    Category:"Vehicle Wheels & Tires",
    ID:"438",
    Parent:"89"
  },
  {
    Category:"Vehicle Shopping",
    ID:"473",
    Parent:"47"
  },
  {
    Category:"Fuel Economy & Gas Prices",
    ID:"1268",
    Parent:"473"
  },
  {
    Category:"Vehicle Specs, Reviews & Comparisons",
    ID:"1267",
    Parent:"473"
  },
  {
    Category:"Vehicle Shows",
    ID:"803",
    Parent:"47"
  },
  {
    Category:"Beauty & Fitness",
    ID:"44",
    Parent:"0"
  },
  {
    Category:"Beauty Pageants",
    ID:"1219",
    Parent:"44"
  },
  {
    Category:"Body Art",
    ID:"239",
    Parent:"44"
  },
  {
    Category:"Cosmetic Procedures",
    ID:"1220",
    Parent:"44"
  },
  {
    Category:"Cosmetic Surgery",
    ID:"238",
    Parent:"1220"
  },
  {
    Category:"Cosmetology & Beauty Professionals",
    ID:"147",
    Parent:"44"
  },
  {
    Category:"Face & Body Care",
    ID:"143",
    Parent:"44"
  },
  {
    Category:"Hygiene & Toiletries",
    ID:"244",
    Parent:"143"
  },
  {
    Category:"Make-Up & Cosmetics",
    ID:"234",
    Parent:"143"
  },
  {
    Category:"Perfumes & Fragrances",
    ID:"242",
    Parent:"143"
  },
  {
    Category:"Skin & Nail Care",
    ID:"93",
    Parent:"143"
  },
  {
    Category:"Unwanted Body & Facial Hair Removal",
    ID:"144",
    Parent:"143"
  },
  {
    Category:"Fashion & Style",
    ID:"185",
    Parent:"44"
  },
  {
    Category:"Fashion Designers & Collections",
    ID:"98",
    Parent:"185"
  },
  {
    Category:"Fashion Modeling",
    ID:"1155",
    Parent:"185"
  },
  {
    Category:"Fitness",
    ID:"94",
    Parent:"44"
  },
  {
    Category:"Bodybuilding",
    ID:"241",
    Parent:"94"
  },
  {
    Category:"Fitness Equipment & Accessories",
    ID:"1417",
    Parent:"94"
  },
  {
    Category:"Fitness Instruction & Personal Training",
    ID:"1418",
    Parent:"94"
  },
  {
    Category:"Gyms & Health Clubs",
    ID:"1419",
    Parent:"94"
  },
  {
    Category:"Yoga & Pilates",
    ID:"611",
    Parent:"94"
  },
  {
    Category:"Hair Care",
    ID:"146",
    Parent:"44"
  },
  {
    Category:"Hair Loss",
    ID:"235",
    Parent:"146"
  },
  {
    Category:"Spas & Beauty Services",
    ID:"145",
    Parent:"44"
  },
  {
    Category:"Massage Therapy",
    ID:"557",
    Parent:"145"
  },
  {
    Category:"Weight Loss",
    ID:"236",
    Parent:"44"
  },
  {
    Category:"Books & Literature",
    ID:"22",
    Parent:"0"
  },
  {
    Category:"Book Retailers",
    ID:"355",
    Parent:"22"
  },
  {
    Category:"Children's Literature",
    ID:"1183",
    Parent:"22"
  },
  {
    Category:"E-Books",
    ID:"608",
    Parent:"22"
  },
  {
    Category:"Fan Fiction",
    ID:"540",
    Parent:"22"
  },
  {
    Category:"Literary Classics",
    ID:"1184",
    Parent:"22"
  },
  {
    Category:"Magazines",
    ID:"412",
    Parent:"22"
  },
  {
    Category:"Poetry",
    ID:"565",
    Parent:"22"
  },
  {
    Category:"Writers Resources",
    ID:"1177",
    Parent:"22"
  },
  {
    Category:"Business & Industrial",
    ID:"12",
    Parent:"0"
  },
  {
    Category:"Advertising & Marketing",
    ID:"25",
    Parent:"12"
  },
  {
    Category:"Brand Management",
    ID:"1548",
    Parent:"25"
  },
  {
    Category:"Marketing",
    ID:"83",
    Parent:"25"
  },
  {
    Category:"Promotional Items & Corporate Gifts",
    ID:"1420",
    Parent:"25"
  },
  {
    Category:"Public Relations",
    ID:"327",
    Parent:"25"
  },
  {
    Category:"Sales",
    ID:"1547",
    Parent:"25"
  },
  {
    Category:"Telemarketing",
    ID:"328",
    Parent:"25"
  },
  {
    Category:"Aerospace & Defense",
    ID:"356",
    Parent:"12"
  },
  {
    Category:"Defense Industry",
    ID:"669",
    Parent:"356"
  },
  {
    Category:"Space Technology",
    ID:"668",
    Parent:"356"
  },
  {
    Category:"Agriculture & Forestry",
    ID:"46",
    Parent:"12"
  },
  {
    Category:"Agricultural Equipment",
    ID:"748",
    Parent:"46"
  },
  {
    Category:"Aquaculture",
    ID:"747",
    Parent:"46"
  },
  {
    Category:"Crops & Seed",
    ID:"749",
    Parent:"46"
  },
  {
    Category:"Farms & Ranches",
    ID:"1578",
    Parent:"46"
  },
  {
    Category:"Food Production",
    ID:"621",
    Parent:"46"
  },
  {
    Category:"Forestry",
    ID:"750",
    Parent:"46"
  },
  {
    Category:"Horticulture",
    ID:"751",
    Parent:"46"
  },
  {
    Category:"Livestock",
    ID:"752",
    Parent:"46"
  },
  {
    Category:"Automotive Industry",
    ID:"1190",
    Parent:"12"
  },
  {
    Category:"Business Education",
    ID:"799",
    Parent:"12"
  },
  {
    Category:"Business Finance",
    ID:"1138",
    Parent:"12"
  },
  {
    Category:"Commercial Lending",
    ID:"1160",
    Parent:"1138"
  },
  {
    Category:"Investment Banking",
    ID:"1139",
    Parent:"1138"
  },
  {
    Category:"Risk Management",
    ID:"620",
    Parent:"1138"
  },
  {
    Category:"Venture Capital",
    ID:"905",
    Parent:"1138"
  },
  {
    Category:"Business Operations",
    ID:"1159",
    Parent:"12"
  },
  {
    Category:"Business Plans & Presentations",
    ID:"336",
    Parent:"1159"
  },
  {
    Category:"Human Resources",
    ID:"157",
    Parent:"1159"
  },
  {
    Category:"Compensation & Benefits",
    ID:"723",
    Parent:"157"
  },
  {
    Category:"Corporate Training",
    ID:"331",
    Parent:"157"
  },
  {
    Category:"Payroll Services",
    ID:"724",
    Parent:"157"
  },
  {
    Category:"Recruitment & Staffing",
    ID:"330",
    Parent:"157"
  },
  {
    Category:"Management",
    ID:"338",
    Parent:"1159"
  },
  {
    Category:"Business Process",
    ID:"721",
    Parent:"338"
  },
  {
    Category:"Project Management",
    ID:"1360",
    Parent:"338"
  },
  {
    Category:"Strategic Planning",
    ID:"722",
    Parent:"338"
  },
  {
    Category:"Supply Chain Management",
    ID:"801",
    Parent:"338"
  },
  {
    Category:"Business Services",
    ID:"329",
    Parent:"12"
  },
  {
    Category:"Consulting",
    ID:"1162",
    Parent:"329"
  },
  {
    Category:"Corporate Events",
    ID:"334",
    Parent:"329"
  },
  {
    Category:"Trade Fairs & Industry Shows",
    ID:"335",
    Parent:"334"
  },
  {
    Category:"E-Commerce Services",
    ID:"340",
    Parent:"329"
  },
  {
    Category:"Merchant Services & Payment Systems",
    ID:"280",
    Parent:"340"
  },
  {
    Category:"Fire & Security Services",
    ID:"726",
    Parent:"329"
  },
  {
    Category:"Knowledge Management",
    ID:"800",
    Parent:"329"
  },
  {
    Category:"Office Services",
    ID:"28",
    Parent:"329"
  },
  {
    Category:"Office & Facilities Management",
    ID:"337",
    Parent:"28"
  },
  {
    Category:"Office Supplies",
    ID:"95",
    Parent:"329"
  },
  {
    Category:"Office Furniture",
    ID:"333",
    Parent:"95"
  },
  {
    Category:"Outsourcing",
    ID:"718",
    Parent:"329"
  },
  {
    Category:"Physical Asset Management",
    ID:"719",
    Parent:"329"
  },
  {
    Category:"Quality Control & Tracking",
    ID:"720",
    Parent:"329"
  },
  {
    Category:"Signage",
    ID:"1076",
    Parent:"329"
  },
  {
    Category:"Writing & Editing Services",
    ID:"725",
    Parent:"329"
  },
  {
    Category:"Chemicals Industry",
    ID:"288",
    Parent:"12"
  },
  {
    Category:"Agrochemicals",
    ID:"670",
    Parent:"288"
  },
  {
    Category:"Cleaning Agents",
    ID:"671",
    Parent:"288"
  },
  {
    Category:"Coatings & Adhesives",
    ID:"672",
    Parent:"288"
  },
  {
    Category:"Dyes & Pigments",
    ID:"673",
    Parent:"288"
  },
  {
    Category:"Plastics & Polymers",
    ID:"674",
    Parent:"288"
  },
  {
    Category:"Construction & Maintenance",
    ID:"48",
    Parent:"12"
  },
  {
    Category:"Building Materials & Supplies",
    ID:"650",
    Parent:"48"
  },
  {
    Category:"Nails Screws & Fasteners",
    ID:"829",
    Parent:"650"
  },
  {
    Category:"Plumbing Fixtures & Equipment",
    ID:"830",
    Parent:"650"
  },
  {
    Category:"Wood & Plastics",
    ID:"831",
    Parent:"650"
  },
  {
    Category:"Civil Engineering",
    ID:"651",
    Parent:"48"
  },
  {
    Category:"Construction Consulting & Contracting",
    ID:"652",
    Parent:"48"
  },
  {
    Category:"Urban & Regional Planning",
    ID:"686",
    Parent:"48"
  },
  {
    Category:"Energy & Utilities",
    ID:"233",
    Parent:"12"
  },
  {
    Category:"Electricity",
    ID:"658",
    Parent:"233"
  },
  {
    Category:"Nuclear Energy",
    ID:"954",
    Parent:"233"
  },
  {
    Category:"Oil & Gas",
    ID:"659",
    Parent:"233"
  },
  {
    Category:"Renewable & Alternative Energy",
    ID:"657",
    Parent:"233"
  },
  {
    Category:"Hydropower",
    ID:"1424",
    Parent:"657"
  },
  {
    Category:"Solar Power",
    ID:"1422",
    Parent:"657"
  },
  {
    Category:"Wind Power",
    ID:"1423",
    Parent:"657"
  },
  {
    Category:"Waste Management",
    ID:"660",
    Parent:"233"
  },
  {
    Category:"Recycling",
    ID:"1307",
    Parent:"660"
  },
  {
    Category:"Water Supply & Treatment",
    ID:"1349",
    Parent:"233"
  },
  {
    Category:"Hospitality Industry",
    ID:"955",
    Parent:"12"
  },
  {
    Category:"Event Planning",
    ID:"956",
    Parent:"955"
  },
  {
    Category:"Food Service",
    ID:"957",
    Parent:"955"
  },
  {
    Category:"Restaurant Supply",
    ID:"816",
    Parent:"957"
  },
  {
    Category:"Industrial Materials & Equipment",
    ID:"287",
    Parent:"12"
  },
  {
    Category:"Fluid Handling",
    ID:"1152",
    Parent:"287"
  },
  {
    Category:"Valves Hoses & Fittings",
    ID:"839",
    Parent:"1152"
  },
  {
    Category:"Generators",
    ID:"835",
    Parent:"287"
  },
  {
    Category:"Heavy Machinery",
    ID:"837",
    Parent:"287"
  },
  {
    Category:"Manufacturing",
    ID:"49",
    Parent:"12"
  },
  {
    Category:"Factory Automation",
    ID:"661",
    Parent:"49"
  },
  {
    Category:"Metals & Mining",
    ID:"606",
    Parent:"12"
  },
  {
    Category:"Precious Metals",
    ID:"1425",
    Parent:"606"
  },
  {
    Category:"Pharmaceuticals & Biotech",
    ID:"255",
    Parent:"12"
  },
  {
    Category:"Printing & Publishing",
    ID:"1176",
    Parent:"12"
  },
  {
    Category:"Document & Printing Services",
    ID:"332",
    Parent:"1176"
  },
  {
    Category:"Business Cards & Stationary",
    ID:"1375",
    Parent:"332"
  },
  {
    Category:"Professional & Trade Associations",
    ID:"1199",
    Parent:"12"
  },
  {
    Category:"Retail Trade",
    ID:"841",
    Parent:"12"
  },
  {
    Category:"Retail Equipment & Technology",
    ID:"844",
    Parent:"841"
  },
  {
    Category:"Small Business",
    ID:"551",
    Parent:"12"
  },
  {
    Category:"Business Formation",
    ID:"1200",
    Parent:"551"
  },
  {
    Category:"Home Office",
    ID:"727",
    Parent:"551"
  },
  {
    Category:"MLM & Business Opportunities",
    ID:"552",
    Parent:"551"
  },
  {
    Category:"Textiles & Nonwovens",
    ID:"566",
    Parent:"12"
  },
  {
    Category:"Transportation & Logistics",
    ID:"50",
    Parent:"12"
  },
  {
    Category:"Aviation",
    ID:"662",
    Parent:"50"
  },
  {
    Category:"Distribution & Logistics",
    ID:"664",
    Parent:"50"
  },
  {
    Category:"Freight & Trucking",
    ID:"289",
    Parent:"50"
  },
  {
    Category:"Import & Export",
    ID:"354",
    Parent:"50"
  },
  {
    Category:"Mail & Package Delivery",
    ID:"1150",
    Parent:"50"
  },
  {
    Category:"Couriers & Messengers",
    ID:"663",
    Parent:"1150"
  },
  {
    Category:"Maritime Transport",
    ID:"665",
    Parent:"50"
  },
  {
    Category:"Moving & Relocation",
    ID:"291",
    Parent:"50"
  },
  {
    Category:"Packaging",
    ID:"290",
    Parent:"50"
  },
  {
    Category:"Parking",
    ID:"1306",
    Parent:"50"
  },
  {
    Category:"Public Storage",
    ID:"1347",
    Parent:"50"
  },
  {
    Category:"Rail Transport",
    ID:"666",
    Parent:"50"
  },
  {
    Category:"Urban Transport",
    ID:"667",
    Parent:"50"
  },
  {
    Category:"Warehousing",
    ID:"1426",
    Parent:"50"
  },
  {
    Category:"Computers & Electronics",
    ID:"5",
    Parent:"0"
  },
  {
    Category:"CAD & CAM",
    ID:"1300",
    Parent:"5"
  },
  {
    Category:"Computer Hardware",
    ID:"30",
    Parent:"5"
  },
  {
    Category:"Computer Components",
    ID:"717",
    Parent:"30"
  },
  {
    Category:"Chips & Processors",
    ID:"741",
    Parent:"717"
  },
  {
    Category:"Computer Memory",
    ID:"226",
    Parent:"717"
  },
  {
    Category:"Sound & Video Cards",
    ID:"740",
    Parent:"717"
  },
  {
    Category:"Computer Drives & Storage",
    ID:"496",
    Parent:"30"
  },
  {
    Category:"CD & DVD Drives & Burners",
    ID:"1321",
    Parent:"496"
  },
  {
    Category:"CD & DVD Storage Media",
    ID:"1322",
    Parent:"496"
  },
  {
    Category:"Data Backup & Recovery",
    ID:"1323",
    Parent:"496"
  },
  {
    Category:"Flash Drives & Memory Cards",
    ID:"1318",
    Parent:"496"
  },
  {
    Category:"Hard Drives",
    ID:"1320",
    Parent:"496"
  },
  {
    Category:"Memory Card Readers",
    ID:"1319",
    Parent:"496"
  },
  {
    Category:"Network Storage",
    ID:"729",
    Parent:"496"
  },
  {
    Category:"Computer Peripherals",
    ID:"312",
    Parent:"30"
  },
  {
    Category:"Computer Monitors & Displays",
    ID:"487",
    Parent:"312"
  },
  {
    Category:"Input Devices",
    ID:"493",
    Parent:"312"
  },
  {
    Category:"Printers, Copiers & Fax",
    ID:"1330",
    Parent:"312"
  },
  {
    Category:"Copiers",
    ID:"1331",
    Parent:"1330"
  },
  {
    Category:"Fax Machines",
    ID:"1332",
    Parent:"1330"
  },
  {
    Category:"Ink & Toner",
    ID:"1333",
    Parent:"1330"
  },
  {
    Category:"Printers",
    ID:"494",
    Parent:"1330"
  },
  {
    Category:"Scanners",
    ID:"495",
    Parent:"1330"
  },
  {
    Category:"Computer Servers",
    ID:"728",
    Parent:"30"
  },
  {
    Category:"Desktop Computers",
    ID:"309",
    Parent:"30"
  },
  {
    Category:"Hardware Modding & Tuning",
    ID:"739",
    Parent:"30"
  },
  {
    Category:"Laptops & Notebooks",
    ID:"310",
    Parent:"30"
  },
  {
    Category:"Tablet PCs",
    ID:"1277",
    Parent:"310"
  },
  {
    Category:"Computer Security",
    ID:"314",
    Parent:"5"
  },
  {
    Category:"Antivirus & Malware",
    ID:"315",
    Parent:"314"
  },
  {
    Category:"Hacking & Cracking",
    ID:"738",
    Parent:"314"
  },
  {
    Category:"Network Security",
    ID:"344",
    Parent:"314"
  },
  {
    Category:"Consumer Electronics",
    ID:"78",
    Parent:"5"
  },
  {
    Category:"Audio Equipment",
    ID:"361",
    Parent:"78"
  },
  {
    Category:"Headphones",
    ID:"1396",
    Parent:"361"
  },
  {
    Category:"Speakers",
    ID:"1158",
    Parent:"361"
  },
  {
    Category:"Stereo Systems & Components",
    ID:"91",
    Parent:"361"
  },
  {
    Category:"Camera & Photo Equipment",
    ID:"573",
    Parent:"78"
  },
  {
    Category:"Binoculars, Telescopes & Optical Devices",
    ID:"1384",
    Parent:"573"
  },
  {
    Category:"Cameras & Camcorders",
    ID:"306",
    Parent:"573"
  },
  {
    Category:"Camcorders",
    ID:"308",
    Parent:"306"
  },
  {
    Category:"Camera Lenses",
    ID:"1383",
    Parent:"306"
  },
  {
    Category:"Cameras",
    ID:"307",
    Parent:"306"
  },
  {
    Category:"Car Electronics",
    ID:"1188",
    Parent:"78"
  },
  {
    Category:"Car Audio",
    ID:"230",
    Parent:"1188"
  },
  {
    Category:"Car Video",
    ID:"1189",
    Parent:"1188"
  },
  {
    Category:"Electronic Accessories",
    ID:"1192",
    Parent:"78"
  },
  {
    Category:"GPS & Navigation",
    ID:"794",
    Parent:"78"
  },
  {
    Category:"Gadgets & Portable Electronics",
    ID:"362",
    Parent:"78"
  },
  {
    Category:"E-Book Readers",
    ID:"1324",
    Parent:"362"
  },
  {
    Category:"MP3 & Portable Media Players",
    ID:"227",
    Parent:"362"
  },
  {
    Category:"PDAs & Handhelds",
    ID:"228",
    Parent:"362"
  },
  {
    Category:"Game Systems & Consoles",
    ID:"899",
    Parent:"78"
  },
  {
    Category:"Handheld Game Consoles",
    ID:"1046",
    Parent:"899"
  },
  {
    Category:"Nintendo",
    ID:"1043",
    Parent:"899"
  },
  {
    Category:"Sony PlayStation",
    ID:"1044",
    Parent:"899"
  },
  {
    Category:"Xbox",
    ID:"1045",
    Parent:"899"
  },
  {
    Category:"TV & Video Equipment",
    ID:"229",
    Parent:"78"
  },
  {
    Category:"DVRs & Set-Top Boxes",
    ID:"1393",
    Parent:"229"
  },
  {
    Category:"Home Theater Systems",
    ID:"1157",
    Parent:"229"
  },
  {
    Category:"Projectors & Screens",
    ID:"1334",
    Parent:"229"
  },
  {
    Category:"Televisions",
    ID:"305",
    Parent:"229"
  },
  {
    Category:"HDTVs",
    ID:"1354",
    Parent:"305"
  },
  {
    Category:"LCD TVs",
    ID:"1356",
    Parent:"305"
  },
  {
    Category:"Plasma TVs",
    ID:"1355",
    Parent:"305"
  },
  {
    Category:"Projection TVs",
    ID:"1357",
    Parent:"305"
  },
  {
    Category:"Video Players & Recorders",
    ID:"492",
    Parent:"229"
  },
  {
    Category:"Blu-Ray Players & Recorders",
    ID:"1394",
    Parent:"492"
  },
  {
    Category:"DVD Players & Recorders",
    ID:"1395",
    Parent:"492"
  },
  {
    Category:"Electronics & Electrical",
    ID:"434",
    Parent:"5"
  },
  {
    Category:"Data Sheets & Electronics Reference",
    ID:"900",
    Parent:"434"
  },
  {
    Category:"Electromechanical Devices",
    ID:"743",
    Parent:"434"
  },
  {
    Category:"Electronic Components",
    ID:"742",
    Parent:"434"
  },
  {
    Category:"Optoelectronics & Fiber",
    ID:"744",
    Parent:"434"
  },
  {
    Category:"Power Supplies",
    ID:"745",
    Parent:"434"
  },
  {
    Category:"Test & Measurement",
    ID:"746",
    Parent:"434"
  },
  {
    Category:"Enterprise Technology",
    ID:"77",
    Parent:"5"
  },
  {
    Category:"Customer Relationship Management (CRM)",
    ID:"341",
    Parent:"77"
  },
  {
    Category:"Data Management",
    ID:"343",
    Parent:"77"
  },
  {
    Category:"Enterprise Resource Planning (ERP)",
    ID:"342",
    Parent:"77"
  },
  {
    Category:"Networking",
    ID:"311",
    Parent:"5"
  },
  {
    Category:"Data Formats & Protocols",
    ID:"488",
    Parent:"311"
  },
  {
    Category:"Network Monitoring & Management",
    ID:"347",
    Parent:"311"
  },
  {
    Category:"Networking Equipment",
    ID:"346",
    Parent:"311"
  },
  {
    Category:"VPN & Remote Access",
    ID:"1279",
    Parent:"311"
  },
  {
    Category:"Programming",
    ID:"31",
    Parent:"5"
  },
  {
    Category:"C & C++",
    ID:"731",
    Parent:"31"
  },
  {
    Category:"Development Tools",
    ID:"730",
    Parent:"31"
  },
  {
    Category:"Java (Programming Language)",
    ID:"732",
    Parent:"31"
  },
  {
    Category:"Scripting Languages",
    ID:"733",
    Parent:"31"
  },
  {
    Category:"Windows & .NET",
    ID:"734",
    Parent:"31"
  },
  {
    Category:"Software",
    ID:"32",
    Parent:"5"
  },
  {
    Category:"Business & Productivity Software",
    ID:"498",
    Parent:"32"
  },
  {
    Category:"Accounting & Financial Software",
    ID:"1341",
    Parent:"498"
  },
  {
    Category:"Calendar & Scheduling Software",
    ID:"1358",
    Parent:"498"
  },
  {
    Category:"Presentation Software",
    ID:"1346",
    Parent:"498"
  },
  {
    Category:"Project Management Software",
    ID:"1359",
    Parent:"498"
  },
  {
    Category:"Spreadsheet Software",
    ID:"1344",
    Parent:"498"
  },
  {
    Category:"Word Processing Software",
    ID:"1345",
    Parent:"498"
  },
  {
    Category:"Device Drivers",
    ID:"225",
    Parent:"32"
  },
  {
    Category:"Educational Software",
    ID:"804",
    Parent:"32"
  },
  {
    Category:"Freeware & Shareware",
    ID:"901",
    Parent:"32"
  },
  {
    Category:"Internet Software",
    ID:"807",
    Parent:"32"
  },
  {
    Category:"Content Management",
    ID:"808",
    Parent:"807"
  },
  {
    Category:"Download Managers",
    ID:"1500",
    Parent:"807"
  },
  {
    Category:"Internet Clients & Browsers",
    ID:"304",
    Parent:"807"
  },
  {
    Category:"Proxying & Filtering",
    ID:"902",
    Parent:"807"
  },
  {
    Category:"Multimedia Software",
    ID:"497",
    Parent:"32"
  },
  {
    Category:"Audio & Music Software",
    ID:"1089",
    Parent:"497"
  },
  {
    Category:"Audio Files Formats & Codecs",
    ID:"1092",
    Parent:"1089"
  },
  {
    Category:"Desktop Publishing",
    ID:"1088",
    Parent:"497"
  },
  {
    Category:"Fonts",
    ID:"805",
    Parent:"1088"
  },
  {
    Category:"Graphics & Animation Software",
    ID:"486",
    Parent:"497"
  },
  {
    Category:"Media Players",
    ID:"1090",
    Parent:"497"
  },
  {
    Category:"Photo & Video Software",
    ID:"577",
    Parent:"497"
  },
  {
    Category:"Video File Formats & Codecs",
    ID:"1315",
    Parent:"577"
  },
  {
    Category:"Open Source",
    ID:"313",
    Parent:"32"
  },
  {
    Category:"Operating Systems",
    ID:"303",
    Parent:"32"
  },
  {
    Category:"Linux & Unix",
    ID:"736",
    Parent:"303"
  },
  {
    Category:"Mac OS",
    ID:"735",
    Parent:"303"
  },
  {
    Category:"Mobile OS",
    ID:"1382",
    Parent:"303"
  },
  {
    Category:"Android OS",
    ID:"1534",
    Parent:"1382"
  },
  {
    Category:"Apple iOS",
    ID:"1533",
    Parent:"1382"
  },
  {
    Category:"BlackBerry OS",
    ID:"1535",
    Parent:"1382"
  },
  {
    Category:"Symbian OS",
    ID:"1536",
    Parent:"1382"
  },
  {
    Category:"Windows Mobile OS",
    ID:"1537",
    Parent:"1382"
  },
  {
    Category:"Windows OS",
    ID:"737",
    Parent:"303"
  },
  {
    Category:"Software Utilities",
    ID:"224",
    Parent:"32"
  },
  {
    Category:"Finance",
    ID:"7",
    Parent:"0"
  },
  {
    Category:"Accounting & Auditing",
    ID:"278",
    Parent:"7"
  },
  {
    Category:"Billing & Invoicing",
    ID:"1427",
    Parent:"278"
  },
  {
    Category:"Bookkeeping",
    ID:"1428",
    Parent:"278"
  },
  {
    Category:"Tax Preparation & Planning",
    ID:"1283",
    Parent:"278"
  },
  {
    Category:"Banking",
    ID:"37",
    Parent:"7"
  },
  {
    Category:"ATMs & Branch Locations",
    ID:"1429",
    Parent:"37"
  },
  {
    Category:"Debit & Checking Services",
    ID:"1430",
    Parent:"37"
  },
  {
    Category:"Money Transfer & Wire Services",
    ID:"1432",
    Parent:"37"
  },
  {
    Category:"Savings Accounts",
    ID:"1431",
    Parent:"37"
  },
  {
    Category:"Credit & Lending",
    ID:"279",
    Parent:"7"
  },
  {
    Category:"Credit Cards",
    ID:"811",
    Parent:"279"
  },
  {
    Category:"Credit Reporting & Monitoring",
    ID:"1433",
    Parent:"279"
  },
  {
    Category:"Debt Collection & Repossession",
    ID:"1434",
    Parent:"279"
  },
  {
    Category:"Debt Management",
    ID:"812",
    Parent:"279"
  },
  {
    Category:"Loans",
    ID:"1435",
    Parent:"279"
  },
  {
    Category:"Home Financing",
    ID:"466",
    Parent:"1435"
  },
  {
    Category:"Home Equity Loans & Lines of Credit",
    ID:"1445",
    Parent:"466"
  },
  {
    Category:"Home Refinancing",
    ID:"1446",
    Parent:"466"
  },
  {
    Category:"Mortgages",
    ID:"1447",
    Parent:"466"
  },
  {
    Category:"Personal Loans",
    ID:"1436",
    Parent:"1435"
  },
  {
    Category:"Short-Term Loans & Cash Advances",
    ID:"1437",
    Parent:"1436"
  },
  {
    Category:"Student Loans & College Financing",
    ID:"813",
    Parent:"1435"
  },
  {
    Category:"Vehicle Financing",
    ID:"1448",
    Parent:"1435"
  },
  {
    Category:"Auto Financing",
    ID:"468",
    Parent:"1448"
  },
  {
    Category:"Financial Planning & Management",
    ID:"903",
    Parent:"7"
  },
  {
    Category:"Asset & Portfolio Management",
    ID:"1439",
    Parent:"903"
  },
  {
    Category:"Inheritance & Estate Planning",
    ID:"1438",
    Parent:"903"
  },
  {
    Category:"Retirement & Pension",
    ID:"619",
    Parent:"903"
  },
  {
    Category:"Grants, Scholarships & Financial Aid",
    ID:"1282",
    Parent:"7"
  },
  {
    Category:"Government Grants",
    ID:"1440",
    Parent:"1282"
  },
  {
    Category:"Study Grants & Scholarships",
    ID:"1441",
    Parent:"1282"
  },
  {
    Category:"Insurance",
    ID:"38",
    Parent:"7"
  },
  {
    Category:"Health Insurance",
    ID:"249",
    Parent:"38"
  },
  {
    Category:"Home Insurance",
    ID:"465",
    Parent:"38"
  },
  {
    Category:"Life Insurance",
    ID:"1442",
    Parent:"38"
  },
  {
    Category:"Travel Insurance",
    ID:"1443",
    Parent:"38"
  },
  {
    Category:"Vehicle Insurance",
    ID:"1444",
    Parent:"38"
  },
  {
    Category:"Auto Insurance",
    ID:"467",
    Parent:"1444"
  },
  {
    Category:"Investing",
    ID:"107",
    Parent:"7"
  },
  {
    Category:"Brokerages & Day Trading",
    ID:"1449",
    Parent:"107"
  },
  {
    Category:"Commodities & Futures Trading",
    ID:"904",
    Parent:"107"
  },
  {
    Category:"Currencies & Foreign Exchange",
    ID:"814",
    Parent:"107"
  },
  {
    Category:"Derivatives",
    ID:"1450",
    Parent:"107"
  },
  {
    Category:"Funds",
    ID:"1451",
    Parent:"107"
  },
  {
    Category:"Exchange Traded Funds",
    ID:"1452",
    Parent:"1451"
  },
  {
    Category:"Hedge Funds",
    ID:"1453",
    Parent:"1451"
  },
  {
    Category:"Mutual Funds",
    ID:"1454",
    Parent:"1451"
  },
  {
    Category:"Real Estate Investment Trusts",
    ID:"1455",
    Parent:"107"
  },
  {
    Category:"Socially Responsible Investing",
    ID:"1456",
    Parent:"107"
  },
  {
    Category:"Stocks & Bonds",
    ID:"1457",
    Parent:"107"
  },
  {
    Category:"Bonds",
    ID:"1458",
    Parent:"1457"
  },
  {
    Category:"Exchanges",
    ID:"1459",
    Parent:"1457"
  },
  {
    Category:"Food & Drink",
    ID:"71",
    Parent:"0"
  },
  {
    Category:"Beverages",
    ID:"560",
    Parent:"71"
  },
  {
    Category:"Alcoholic Beverages",
    ID:"277",
    Parent:"560"
  },
  {
    Category:"Beer",
    ID:"404",
    Parent:"277"
  },
  {
    Category:"Liquor",
    ID:"406",
    Parent:"277"
  },
  {
    Category:"Wine",
    ID:"405",
    Parent:"277"
  },
  {
    Category:"Bottled Water",
    ID:"1509",
    Parent:"560"
  },
  {
    Category:"Coffee & Tea",
    ID:"916",
    Parent:"560"
  },
  {
    Category:"Coffee",
    ID:"1527",
    Parent:"916"
  },
  {
    Category:"Tea",
    ID:"1528",
    Parent:"916"
  },
  {
    Category:"Juice",
    ID:"1510",
    Parent:"560"
  },
  {
    Category:"Soft Drinks",
    ID:"1511",
    Parent:"560"
  },
  {
    Category:"Cooking & Recipes",
    ID:"122",
    Parent:"71"
  },
  {
    Category:"BBQ & Grilling",
    ID:"1525",
    Parent:"122"
  },
  {
    Category:"Cuisines",
    ID:"911",
    Parent:"122"
  },
  {
    Category:"East Asian Cuisine",
    ID:"912",
    Parent:"911"
  },
  {
    Category:"Chinese Cuisine",
    ID:"1551",
    Parent:"912"
  },
  {
    Category:"Japanese Cuisine",
    ID:"1552",
    Parent:"912"
  },
  {
    Category:"Korean Cuisine",
    ID:"1554",
    Parent:"912"
  },
  {
    Category:"Eastern European Cuisine",
    ID:"1563",
    Parent:"911"
  },
  {
    Category:"French Cuisine",
    ID:"1556",
    Parent:"911"
  },
  {
    Category:"German Cuisine",
    ID:"1564",
    Parent:"911"
  },
  {
    Category:"Latin American Cuisine",
    ID:"913",
    Parent:"911"
  },
  {
    Category:"Caribbean Cuisine",
    ID:"1566",
    Parent:"913"
  },
  {
    Category:"Mexican Cuisine",
    ID:"1560",
    Parent:"913"
  },
  {
    Category:"South American Cuisine",
    ID:"1565",
    Parent:"913"
  },
  {
    Category:"Mediterranean Cuisine",
    ID:"914",
    Parent:"911"
  },
  {
    Category:"Greek Cuisine",
    ID:"1558",
    Parent:"914"
  },
  {
    Category:"Italian Cuisine",
    ID:"1557",
    Parent:"914"
  },
  {
    Category:"Spanish Cuisine",
    ID:"1559",
    Parent:"914"
  },
  {
    Category:"Middle Eastern Cuisine",
    ID:"1532",
    Parent:"911"
  },
  {
    Category:"North American Cuisine",
    ID:"915",
    Parent:"911"
  },
  {
    Category:"South Asian Cuisine",
    ID:"1567",
    Parent:"911"
  },
  {
    Category:"Indian Cuisine",
    ID:"1553",
    Parent:"1567"
  },
  {
    Category:"Southeast Asian Cuisine",
    ID:"1568",
    Parent:"911"
  },
  {
    Category:"Thai Cuisine",
    ID:"1555",
    Parent:"1568"
  },
  {
    Category:"Vietnamese Cuisine",
    ID:"1569",
    Parent:"1568"
  },
  {
    Category:"Vegetarian Cuisine",
    ID:"825",
    Parent:"911"
  },
  {
    Category:"Culinary Training",
    ID:"297",
    Parent:"122"
  },
  {
    Category:"Desserts",
    ID:"1526",
    Parent:"122"
  },
  {
    Category:"Healthy Eating",
    ID:"1501",
    Parent:"122"
  },
  {
    Category:"Salads",
    ID:"1529",
    Parent:"122"
  },
  {
    Category:"Soups & Stews",
    ID:"910",
    Parent:"122"
  },
  {
    Category:"Food",
    ID:"1512",
    Parent:"71"
  },
  {
    Category:"Baked Goods",
    ID:"907",
    Parent:"1512"
  },
  {
    Category:"Breakfast Foods",
    ID:"1513",
    Parent:"1512"
  },
  {
    Category:"Candy & Sweets",
    ID:"906",
    Parent:"1512"
  },
  {
    Category:"Condiments & Dressings",
    ID:"1538",
    Parent:"1512"
  },
  {
    Category:"Cooking Fats & Oils",
    ID:"1539",
    Parent:"1512"
  },
  {
    Category:"Dairy & Eggs",
    ID:"1514",
    Parent:"1512"
  },
  {
    Category:"Cheese",
    ID:"1540",
    Parent:"1514"
  },
  {
    Category:"Fruits & Vegetables",
    ID:"908",
    Parent:"1512"
  },
  {
    Category:"Gourmet & Specialty Foods",
    ID:"1541",
    Parent:"1512"
  },
  {
    Category:"Grains & Pasta",
    ID:"1515",
    Parent:"1512"
  },
  {
    Category:"Herbs & Spices",
    ID:"1516",
    Parent:"1512"
  },
  {
    Category:"Jams, Jellies & Preserves",
    ID:"1542",
    Parent:"1512"
  },
  {
    Category:"Meat & Seafood",
    ID:"909",
    Parent:"1512"
  },
  {
    Category:"Beef",
    ID:"1543",
    Parent:"909"
  },
  {
    Category:"Fish & Seafood",
    ID:"1544",
    Parent:"909"
  },
  {
    Category:"Pork",
    ID:"1545",
    Parent:"909"
  },
  {
    Category:"Poultry",
    ID:"1546",
    Parent:"909"
  },
  {
    Category:"Organic & Natural Foods",
    ID:"1517",
    Parent:"1512"
  },
  {
    Category:"Snack Foods",
    ID:"1518",
    Parent:"1512"
  },
  {
    Category:"Food & Grocery Delivery",
    ID:"1523",
    Parent:"71"
  },
  {
    Category:"Food & Grocery Retailers",
    ID:"121",
    Parent:"71"
  },
  {
    Category:"Bakeries",
    ID:"1573",
    Parent:"121"
  },
  {
    Category:"Butchers",
    ID:"1574",
    Parent:"121"
  },
  {
    Category:"Convenience Stores",
    ID:"1575",
    Parent:"121"
  },
  {
    Category:"Delicatessens",
    ID:"1576",
    Parent:"121"
  },
  {
    Category:"Farmers' Markets",
    ID:"1577",
    Parent:"121"
  },
  {
    Category:"Restaurants",
    ID:"276",
    Parent:"71"
  },
  {
    Category:"Catering",
    ID:"1524",
    Parent:"276"
  },
  {
    Category:"Dining Guides",
    ID:"917",
    Parent:"276"
  },
  {
    Category:"Fast Food",
    ID:"918",
    Parent:"276"
  },
  {
    Category:"Burgers",
    ID:"1562",
    Parent:"918"
  },
  {
    Category:"Fine Dining",
    ID:"1561",
    Parent:"276"
  },
  {
    Category:"Pizzerias",
    ID:"1550",
    Parent:"276"
  },
  {
    Category:"Games",
    ID:"8",
    Parent:"0"
  },
  {
    Category:"Arcade & Coin-Op Games",
    ID:"919",
    Parent:"8"
  },
  {
    Category:"Board Games",
    ID:"920",
    Parent:"8"
  },
  {
    Category:"Chess & Abstract Strategy Games",
    ID:"921",
    Parent:"920"
  },
  {
    Category:"Miniatures & Wargaming",
    ID:"922",
    Parent:"920"
  },
  {
    Category:"Card Games",
    ID:"39",
    Parent:"8"
  },
  {
    Category:"Collectible Card Games",
    ID:"923",
    Parent:"39"
  },
  {
    Category:"Poker & Casino Games",
    ID:"924",
    Parent:"39"
  },
  {
    Category:"Computer & Video Games",
    ID:"41",
    Parent:"8"
  },
  {
    Category:"Action & Platform Games",
    ID:"1311",
    Parent:"41"
  },
  {
    Category:"Adventure Games",
    ID:"925",
    Parent:"41"
  },
  {
    Category:"Casual Games",
    ID:"926",
    Parent:"41"
  },
  {
    Category:"Driving & Racing Games",
    ID:"927",
    Parent:"41"
  },
  {
    Category:"Fighting Games",
    ID:"928",
    Parent:"41"
  },
  {
    Category:"Gaming Media & Reference",
    ID:"1343",
    Parent:"41"
  },
  {
    Category:"Game Cheats & Hints",
    ID:"381",
    Parent:"1343"
  },
  {
    Category:"Music & Dance Games",
    ID:"929",
    Parent:"41"
  },
  {
    Category:"Shooter Games",
    ID:"930",
    Parent:"41"
  },
  {
    Category:"Simulation Games",
    ID:"931",
    Parent:"41"
  },
  {
    Category:"Business & Tycoon Games",
    ID:"1497",
    Parent:"931"
  },
  {
    Category:"City Building Games",
    ID:"1496",
    Parent:"931"
  },
  {
    Category:"Life Simulation Games",
    ID:"1498",
    Parent:"931"
  },
  {
    Category:"Vehicle Simulators",
    ID:"1495",
    Parent:"931"
  },
  {
    Category:"Sports Games",
    ID:"932",
    Parent:"41"
  },
  {
    Category:"Sports Management Games",
    ID:"1499",
    Parent:"932"
  },
  {
    Category:"Strategy Games",
    ID:"933",
    Parent:"41"
  },
  {
    Category:"Video Game Development",
    ID:"1491",
    Parent:"41"
  },
  {
    Category:"Video Game Emulation",
    ID:"1342",
    Parent:"41"
  },
  {
    Category:"Video Game Retailers",
    ID:"1146",
    Parent:"41"
  },
  {
    Category:"Dice Games",
    ID:"1492",
    Parent:"8"
  },
  {
    Category:"Educational Games",
    ID:"1493",
    Parent:"8"
  },
  {
    Category:"Family-Oriented Games & Activities",
    ID:"1290",
    Parent:"8"
  },
  {
    Category:"Drawing & Coloring",
    ID:"1397",
    Parent:"1290"
  },
  {
    Category:"Dress-Up & Fashion Games",
    ID:"1173",
    Parent:"1290"
  },
  {
    Category:"Gambling",
    ID:"637",
    Parent:"8"
  },
  {
    Category:"Horse & Dog Racing",
    ID:"698",
    Parent:"637"
  },
  {
    Category:"Lottery & Sweepstakes",
    ID:"364",
    Parent:"637"
  },
  {
    Category:"Sports Betting",
    ID:"934",
    Parent:"637"
  },
  {
    Category:"Online Games",
    ID:"105",
    Parent:"8"
  },
  {
    Category:"Massive Multiplayer",
    ID:"935",
    Parent:"105"
  },
  {
    Category:"Party Games",
    ID:"936",
    Parent:"8"
  },
  {
    Category:"Puzzles & Brainteasers",
    ID:"937",
    Parent:"8"
  },
  {
    Category:"Roleplaying Games",
    ID:"622",
    Parent:"8"
  },
  {
    Category:"Table Games",
    ID:"938",
    Parent:"8"
  },
  {
    Category:"Billiards",
    ID:"939",
    Parent:"938"
  },
  {
    Category:"Table Tennis",
    ID:"940",
    Parent:"938"
  },
  {
    Category:"Tile Games",
    ID:"1549",
    Parent:"8"
  },
  {
    Category:"Word Games",
    ID:"1494",
    Parent:"8"
  },
  {
    Category:"Health",
    ID:"45",
    Parent:"0"
  },
  {
    Category:"Aging & Geriatrics",
    ID:"623",
    Parent:"45"
  },
  {
    Category:"Alzheimer's Disease",
    ID:"624",
    Parent:"623"
  },
  {
    Category:"Alternative & Natural Medicine",
    ID:"499",
    Parent:"45"
  },
  {
    Category:"Acupuncture & Chinese Medicine",
    ID:"1239",
    Parent:"499"
  },
  {
    Category:"Cleansing & Detoxification",
    ID:"1238",
    Parent:"499"
  },
  {
    Category:"Health Conditions",
    ID:"419",
    Parent:"45"
  },
  {
    Category:"AIDS & HIV",
    ID:"625",
    Parent:"419"
  },
  {
    Category:"Allergies",
    ID:"626",
    Parent:"419"
  },
  {
    Category:"Arthritis",
    ID:"628",
    Parent:"419"
  },
  {
    Category:"Cancer",
    ID:"429",
    Parent:"419"
  },
  {
    Category:"Cold & Flu",
    ID:"629",
    Parent:"419"
  },
  {
    Category:"Diabetes",
    ID:"630",
    Parent:"419"
  },
  {
    Category:"Ear Nose & Throat",
    ID:"1211",
    Parent:"419"
  },
  {
    Category:"Eating Disorders",
    ID:"571",
    Parent:"419"
  },
  {
    Category:"Endocrine Conditions",
    ID:"1328",
    Parent:"419"
  },
  {
    Category:"Thyroid Conditions",
    ID:"1329",
    Parent:"1328"
  },
  {
    Category:"GERD & Digestive Disorders",
    ID:"638",
    Parent:"419"
  },
  {
    Category:"Genetic Disorders",
    ID:"941",
    Parent:"419"
  },
  {
    Category:"Heart & Hypertension",
    ID:"559",
    Parent:"419"
  },
  {
    Category:"Cholesterol Issues",
    ID:"643",
    Parent:"559"
  },
  {
    Category:"Infectious Diseases",
    ID:"632",
    Parent:"419"
  },
  {
    Category:"Parasites & Parasitic Diseases",
    ID:"1262",
    Parent:"632"
  },
  {
    Category:"Vaccines & Immunizations",
    ID:"1263",
    Parent:"632"
  },
  {
    Category:"Injury",
    ID:"817",
    Parent:"419"
  },
  {
    Category:"Neurological Disorders",
    ID:"942",
    Parent:"419"
  },
  {
    Category:"Obesity",
    ID:"818",
    Parent:"419"
  },
  {
    Category:"Pain Management",
    ID:"819",
    Parent:"419"
  },
  {
    Category:"Headaches & Migraines",
    ID:"631",
    Parent:"819"
  },
  {
    Category:"Respiratory Conditions",
    ID:"824",
    Parent:"419"
  },
  {
    Category:"Asthma",
    ID:"627",
    Parent:"824"
  },
  {
    Category:"Skin Conditions",
    ID:"420",
    Parent:"419"
  },
  {
    Category:"Sleep Disorders",
    ID:"633",
    Parent:"419"
  },
  {
    Category:"Health Education & Medical Training",
    ID:"254",
    Parent:"45"
  },
  {
    Category:"Health Foundations & Medical Research",
    ID:"252",
    Parent:"45"
  },
  {
    Category:"Medical Devices & Equipment",
    ID:"251",
    Parent:"45"
  },
  {
    Category:"Assistive Technology",
    ID:"1352",
    Parent:"251"
  },
  {
    Category:"Mobility Equipment & Accessories",
    ID:"1353",
    Parent:"1352"
  },
  {
    Category:"Medical Facilities & Services",
    ID:"256",
    Parent:"45"
  },
  {
    Category:"Doctors' Offices",
    ID:"634",
    Parent:"256"
  },
  {
    Category:"Hospitals & Treatment Centers",
    ID:"250",
    Parent:"256"
  },
  {
    Category:"Medical Procedures",
    ID:"635",
    Parent:"256"
  },
  {
    Category:"Medical Tests & Exams",
    ID:"943",
    Parent:"635"
  },
  {
    Category:"Surgery",
    ID:"944",
    Parent:"635"
  },
  {
    Category:"Physical Therapy",
    ID:"500",
    Parent:"256"
  },
  {
    Category:"Medical Literature & Resources",
    ID:"253",
    Parent:"45"
  },
  {
    Category:"Medical Photos & Illustration",
    ID:"945",
    Parent:"253"
  },
  {
    Category:"Men's Health",
    ID:"636",
    Parent:"45"
  },
  {
    Category:"Mental Health",
    ID:"437",
    Parent:"45"
  },
  {
    Category:"Anxiety & Stress",
    ID:"639",
    Parent:"437"
  },
  {
    Category:"Depression",
    ID:"640",
    Parent:"437"
  },
  {
    Category:"Learning & Developmental Disabilities",
    ID:"641",
    Parent:"437"
  },
  {
    Category:"ADD & ADHD",
    ID:"642",
    Parent:"641"
  },
  {
    Category:"Nursing",
    ID:"418",
    Parent:"45"
  },
  {
    Category:"Assisted Living & Long Term Care",
    ID:"649",
    Parent:"418"
  },
  {
    Category:"Nutrition",
    ID:"456",
    Parent:"45"
  },
  {
    Category:"Special & Restricted Diets",
    ID:"457",
    Parent:"456"
  },
  {
    Category:"Kosher Foods",
    ID:"1572",
    Parent:"457"
  },
  {
    Category:"Low Carbohydrate Diets",
    ID:"1570",
    Parent:"457"
  },
  {
    Category:"Low Fat & Low Cholesterol Diets",
    ID:"1571",
    Parent:"457"
  },
  {
    Category:"Vitamins & Supplements",
    ID:"237",
    Parent:"456"
  },
  {
    Category:"Oral & Dental Care",
    ID:"245",
    Parent:"45"
  },
  {
    Category:"Pediatrics",
    ID:"645",
    Parent:"45"
  },
  {
    Category:"Pharmacy",
    ID:"248",
    Parent:"45"
  },
  {
    Category:"Drugs & Medications",
    ID:"646",
    Parent:"248"
  },
  {
    Category:"Public Health",
    ID:"947",
    Parent:"45"
  },
  {
    Category:"Health Policy",
    ID:"1256",
    Parent:"947"
  },
  {
    Category:"Occupational Health & Safety",
    ID:"644",
    Parent:"947"
  },
  {
    Category:"Poisons & Overdoses",
    ID:"946",
    Parent:"947"
  },
  {
    Category:"Reproductive Health",
    ID:"195",
    Parent:"45"
  },
  {
    Category:"Birth Control",
    ID:"198",
    Parent:"195"
  },
  {
    Category:"Erectile Dysfunction",
    ID:"202",
    Parent:"195"
  },
  {
    Category:"Infertility",
    ID:"647",
    Parent:"195"
  },
  {
    Category:"OBGYN",
    ID:"558",
    Parent:"195"
  },
  {
    Category:"Sex Education & Counseling",
    ID:"536",
    Parent:"195"
  },
  {
    Category:"Sexual Enhancement",
    ID:"1236",
    Parent:"195"
  },
  {
    Category:"Sexually Transmitted Diseases",
    ID:"421",
    Parent:"195"
  },
  {
    Category:"Substance Abuse",
    ID:"257",
    Parent:"45"
  },
  {
    Category:"Drug & Alcohol Testing",
    ID:"1351",
    Parent:"257"
  },
  {
    Category:"Drug & Alcohol Treatment",
    ID:"1350",
    Parent:"257"
  },
  {
    Category:"Smoking & Smoking Cessation",
    ID:"1237",
    Parent:"257"
  },
  {
    Category:"Steroids & Performance-Enhancing Drugs",
    ID:"1235",
    Parent:"257"
  },
  {
    Category:"Vision Care",
    ID:"246",
    Parent:"45"
  },
  {
    Category:"Eye Exams & Optometry",
    ID:"1502",
    Parent:"246"
  },
  {
    Category:"Eyeglasses & Contacts",
    ID:"1224",
    Parent:"246"
  },
  {
    Category:"Laser Vision Correction",
    ID:"1503",
    Parent:"246"
  },
  {
    Category:"Women's Health",
    ID:"648",
    Parent:"45"
  },
  {
    Category:"Hobbies & Leisure",
    ID:"65",
    Parent:"0"
  },
  {
    Category:"Clubs & Organizations",
    ID:"189",
    Parent:"65"
  },
  {
    Category:"Fraternal Orders & Service Clubs",
    ID:"1468",
    Parent:"189"
  },
  {
    Category:"Youth Organizations & Resources",
    ID:"1469",
    Parent:"189"
  },
  {
    Category:"Contests, Awards & Prizes",
    ID:"1276",
    Parent:"65"
  },
  {
    Category:"Crafts",
    ID:"284",
    Parent:"65"
  },
  {
    Category:"Ceramics & Pottery",
    ID:"1470",
    Parent:"284"
  },
  {
    Category:"Fiber & Textile Arts",
    ID:"1230",
    Parent:"284"
  },
  {
    Category:"Outdoors",
    ID:"688",
    Parent:"65"
  },
  {
    Category:"Equestrian",
    ID:"568",
    Parent:"688"
  },
  {
    Category:"Fishing",
    ID:"462",
    Parent:"688"
  },
  {
    Category:"Hiking & Camping",
    ID:"542",
    Parent:"688"
  },
  {
    Category:"Hunting & Shooting",
    ID:"461",
    Parent:"688"
  },
  {
    Category:"Paintball",
    ID:"786",
    Parent:"65"
  },
  {
    Category:"Radio Control & Modeling",
    ID:"787",
    Parent:"65"
  },
  {
    Category:"Model Trains & Railroads",
    ID:"1590",
    Parent:"787"
  },
  {
    Category:"Recreational Aviation",
    ID:"999",
    Parent:"65"
  },
  {
    Category:"Special Occasions",
    ID:"977",
    Parent:"65"
  },
  {
    Category:"Holidays & Seasonal Events",
    ID:"678",
    Parent:"977"
  },
  {
    Category:"Birthdays & Name Days",
    ID:"1270",
    Parent:"678"
  },
  {
    Category:"Carnival & Mardi Gras",
    ID:"1246",
    Parent:"678"
  },
  {
    Category:"Christian Holidays",
    ID:"1274",
    Parent:"678"
  },
  {
    Category:"Christmas",
    ID:"1078",
    Parent:"1274"
  },
  {
    Category:"Easter",
    ID:"1123",
    Parent:"1274"
  },
  {
    Category:"Halloween & October 31st",
    ID:"1079",
    Parent:"678"
  },
  {
    Category:"Islamic Holidays",
    ID:"1275",
    Parent:"678"
  },
  {
    Category:"Jewish Holidays",
    ID:"1124",
    Parent:"678"
  },
  {
    Category:"New Year",
    ID:"1271",
    Parent:"678"
  },
  {
    Category:"Thanksgiving",
    ID:"1125",
    Parent:"678"
  },
  {
    Category:"Valentine's Day",
    ID:"1122",
    Parent:"678"
  },
  {
    Category:"Weddings",
    ID:"293",
    Parent:"977"
  },
  {
    Category:"Water Activities",
    ID:"1002",
    Parent:"65"
  },
  {
    Category:"Boating",
    ID:"459",
    Parent:"1002"
  },
  {
    Category:"Diving & Underwater Activities",
    ID:"1305",
    Parent:"1002"
  },
  {
    Category:"Surf & Swim",
    ID:"689",
    Parent:"1002"
  },
  {
    Category:"Home & Garden",
    ID:"11",
    Parent:"0"
  },
  {
    Category:"Bed & Bath",
    ID:"948",
    Parent:"11"
  },
  {
    Category:"Bathroom",
    ID:"1365",
    Parent:"948"
  },
  {
    Category:"Bedroom",
    ID:"1366",
    Parent:"948"
  },
  {
    Category:"Bedding & Bed Linens",
    ID:"1369",
    Parent:"1366"
  },
  {
    Category:"Beds & Headboards",
    ID:"1367",
    Parent:"1366"
  },
  {
    Category:"Mattresses",
    ID:"1368",
    Parent:"1366"
  },
  {
    Category:"Domestic Services",
    ID:"472",
    Parent:"11"
  },
  {
    Category:"Cleaning Supplies & Services",
    ID:"949",
    Parent:"472"
  },
  {
    Category:"Gardening & Landscaping",
    ID:"269",
    Parent:"11"
  },
  {
    Category:"HVAC & Climate Control",
    ID:"828",
    Parent:"11"
  },
  {
    Category:"Home Appliances",
    ID:"271",
    Parent:"11"
  },
  {
    Category:"Water Filters & Purifiers",
    ID:"1371",
    Parent:"271"
  },
  {
    Category:"Home Furnishings",
    ID:"270",
    Parent:"11"
  },
  {
    Category:"Clocks",
    ID:"1363",
    Parent:"270"
  },
  {
    Category:"Lamps & Lighting",
    ID:"272",
    Parent:"270"
  },
  {
    Category:"Rugs & Carpets",
    ID:"1362",
    Parent:"270"
  },
  {
    Category:"Sofas & Chairs",
    ID:"1370",
    Parent:"270"
  },
  {
    Category:"Home Improvement",
    ID:"158",
    Parent:"11"
  },
  {
    Category:"Construction & Power Tools",
    ID:"950",
    Parent:"158"
  },
  {
    Category:"Doors & Windows",
    ID:"827",
    Parent:"158"
  },
  {
    Category:"Flooring",
    ID:"832",
    Parent:"158"
  },
  {
    Category:"House Painting & Finishing",
    ID:"1232",
    Parent:"158"
  },
  {
    Category:"Locks & Locksmiths",
    ID:"1421",
    Parent:"158"
  },
  {
    Category:"Plumbing",
    ID:"1153",
    Parent:"158"
  },
  {
    Category:"Roofing",
    ID:"1175",
    Parent:"158"
  },
  {
    Category:"Home Storage & Shelving",
    ID:"1348",
    Parent:"11"
  },
  {
    Category:"Homemaking & Interior Decor",
    ID:"137",
    Parent:"11"
  },
  {
    Category:"Kitchen & Dining",
    ID:"951",
    Parent:"11"
  },
  {
    Category:"Cookware & Diningware",
    ID:"120",
    Parent:"951"
  },
  {
    Category:"Cutlery & Cutting Accessories",
    ID:"1373",
    Parent:"120"
  },
  {
    Category:"Major Kitchen Appliances",
    ID:"1293",
    Parent:"951"
  },
  {
    Category:"Dishwashers",
    ID:"1600",
    Parent:"1293"
  },
  {
    Category:"Kitchen Hoods & Vents",
    ID:"1604",
    Parent:"1293"
  },
  {
    Category:"Microwaves",
    ID:"1601",
    Parent:"1293"
  },
  {
    Category:"Ranges, Cooktops & Ovens",
    ID:"1602",
    Parent:"1293"
  },
  {
    Category:"Refrigerators & Freezers",
    ID:"1603",
    Parent:"1293"
  },
  {
    Category:"Small Kitchen Appliances",
    ID:"1292",
    Parent:"951"
  },
  {
    Category:"Blenders",
    ID:"1605",
    Parent:"1292"
  },
  {
    Category:"Bread Makers",
    ID:"1606",
    Parent:"1292"
  },
  {
    Category:"Coffee & Espresso Makers",
    ID:"1607",
    Parent:"1292"
  },
  {
    Category:"Food Processors",
    ID:"1608",
    Parent:"1292"
  },
  {
    Category:"Toasters & Toaster Ovens",
    ID:"1609",
    Parent:"1292"
  },
  {
    Category:"Laundry",
    ID:"1364",
    Parent:"11"
  },
  {
    Category:"Nursery & Playroom",
    ID:"1372",
    Parent:"11"
  },
  {
    Category:"Pest Control",
    ID:"471",
    Parent:"11"
  },
  {
    Category:"Swimming Pools & Spas",
    ID:"952",
    Parent:"11"
  },
  {
    Category:"Yard & Patio",
    ID:"953",
    Parent:"11"
  },
  {
    Category:"Internet & Telecom",
    ID:"13",
    Parent:"0"
  },
  {
    Category:"Communications Equipment",
    ID:"385",
    Parent:"13"
  },
  {
    Category:"Radio Equipment",
    ID:"1182",
    Parent:"385"
  },
  {
    Category:"Email & Messaging",
    ID:"394",
    Parent:"13"
  },
  {
    Category:"Spam & Email Filtering",
    ID:"1522",
    Parent:"394"
  },
  {
    Category:"Text & Instant Messaging",
    ID:"1379",
    Parent:"394"
  },
  {
    Category:"Voice & Video Chat",
    ID:"386",
    Parent:"394"
  },
  {
    Category:"Mobile & Wireless",
    ID:"382",
    Parent:"13"
  },
  {
    Category:"Mobile & Wireless Accessories",
    ID:"1171",
    Parent:"382"
  },
  {
    Category:"Bluetooth Accessories",
    ID:"1170",
    Parent:"1171"
  },
  {
    Category:"Mobile Apps & Add-Ons",
    ID:"1109",
    Parent:"382"
  },
  {
    Category:"Android Apps",
    ID:"1461",
    Parent:"1109"
  },
  {
    Category:"Ringtones & Mobile Themes",
    ID:"532",
    Parent:"1109"
  },
  {
    Category:"iOS Apps",
    ID:"1462",
    Parent:"1109"
  },
  {
    Category:"Mobile Phones",
    ID:"390",
    Parent:"382"
  },
  {
    Category:"Smart Phones",
    ID:"1071",
    Parent:"390"
  },
  {
    Category:"Search Engines",
    ID:"485",
    Parent:"13"
  },
  {
    Category:"People Search",
    ID:"1234",
    Parent:"485"
  },
  {
    Category:"Service Providers",
    ID:"383",
    Parent:"13"
  },
  {
    Category:"Cable & Satellite Providers",
    ID:"501",
    Parent:"383"
  },
  {
    Category:"ISPs",
    ID:"104",
    Parent:"383"
  },
  {
    Category:"Internet Cafes",
    ID:"1463",
    Parent:"383"
  },
  {
    Category:"Phone Service Providers",
    ID:"384",
    Parent:"383"
  },
  {
    Category:"Calling Cards",
    ID:"389",
    Parent:"384"
  },
  {
    Category:"Teleconferencing",
    ID:"392",
    Parent:"13"
  },
  {
    Category:"Web Apps & Online Tools",
    ID:"1142",
    Parent:"13"
  },
  {
    Category:"Web Portals",
    ID:"301",
    Parent:"13"
  },
  {
    Category:"Web Services",
    ID:"302",
    Parent:"13"
  },
  {
    Category:"Affiliate Programs",
    ID:"326",
    Parent:"302"
  },
  {
    Category:"Hosted Data Storage",
    ID:"1464",
    Parent:"302"
  },
  {
    Category:"Search Engine Optimization & Marketing",
    ID:"84",
    Parent:"302"
  },
  {
    Category:"Web Design & Development",
    ID:"422",
    Parent:"302"
  },
  {
    Category:"Web Hosting & Domain Registration",
    ID:"53",
    Parent:"302"
  },
  {
    Category:"Web Stats & Analytics",
    ID:"675",
    Parent:"302"
  },
  {
    Category:"Jobs & Education",
    ID:"958",
    Parent:"0"
  },
  {
    Category:"Education",
    ID:"74",
    Parent:"958"
  },
  {
    Category:"Academic Conferences & Publications",
    ID:"1289",
    Parent:"74"
  },
  {
    Category:"Alumni & Reunions",
    ID:"1015",
    Parent:"74"
  },
  {
    Category:"Colleges & Universities",
    ID:"372",
    Parent:"74"
  },
  {
    Category:"Fraternities, Sororities & Student Societies",
    ID:"1465",
    Parent:"372"
  },
  {
    Category:"Distance Learning",
    ID:"367",
    Parent:"74"
  },
  {
    Category:"Early Childhood Education",
    ID:"1012",
    Parent:"74"
  },
  {
    Category:"Preschool",
    ID:"1579",
    Parent:"1012"
  },
  {
    Category:"Homeschooling",
    ID:"791",
    Parent:"74"
  },
  {
    Category:"Primary & Secondary Schooling (K-12)",
    ID:"371",
    Parent:"74"
  },
  {
    Category:"Special Education",
    ID:"1118",
    Parent:"74"
  },
  {
    Category:"Standardized & Admissions Tests",
    ID:"373",
    Parent:"74"
  },
  {
    Category:"Study Abroad",
    ID:"1308",
    Parent:"74"
  },
  {
    Category:"Teaching & Classroom Resources",
    ID:"700",
    Parent:"74"
  },
  {
    Category:"Lesson Plans",
    ID:"1466",
    Parent:"700"
  },
  {
    Category:"School Supplies & Classroom Equipment",
    ID:"1467",
    Parent:"700"
  },
  {
    Category:"Training & Certification",
    ID:"1388",
    Parent:"74"
  },
  {
    Category:"Vocational & Continuing Education",
    ID:"369",
    Parent:"74"
  },
  {
    Category:"Computer Education",
    ID:"1229",
    Parent:"369"
  },
  {
    Category:"Internships",
    ID:"1471",
    Parent:"958"
  },
  {
    Category:"Jobs",
    ID:"60",
    Parent:"958"
  },
  {
    Category:"Career Resources & Planning",
    ID:"959",
    Parent:"60"
  },
  {
    Category:"Job Listings",
    ID:"960",
    Parent:"60"
  },
  {
    Category:"Accounting & Finance Jobs",
    ID:"1472",
    Parent:"960"
  },
  {
    Category:"Clerical & Administrative Jobs",
    ID:"1473",
    Parent:"960"
  },
  {
    Category:"Education Jobs",
    ID:"1474",
    Parent:"960"
  },
  {
    Category:"Executive & Management Jobs",
    ID:"1475",
    Parent:"960"
  },
  {
    Category:"Government & Public Sector Jobs",
    ID:"1476",
    Parent:"960"
  },
  {
    Category:"Health & Medical Jobs",
    ID:"1477",
    Parent:"960"
  },
  {
    Category:"IT & Technical Jobs",
    ID:"802",
    Parent:"960"
  },
  {
    Category:"Legal Jobs",
    ID:"1478",
    Parent:"960"
  },
  {
    Category:"Retail Jobs",
    ID:"1479",
    Parent:"960"
  },
  {
    Category:"Sales & Marketing Jobs",
    ID:"1481",
    Parent:"960"
  },
  {
    Category:"Temporary & Seasonal Jobs",
    ID:"1480",
    Parent:"960"
  },
  {
    Category:"Resumes & Portfolios",
    ID:"961",
    Parent:"60"
  },
  {
    Category:"Law & Government",
    ID:"19",
    Parent:"0"
  },
  {
    Category:"Government",
    ID:"76",
    Parent:"19"
  },
  {
    Category:"Courts & Judiciary",
    ID:"1075",
    Parent:"76"
  },
  {
    Category:"Embassies & Consulates",
    ID:"962",
    Parent:"76"
  },
  {
    Category:"Executive Branch",
    ID:"963",
    Parent:"76"
  },
  {
    Category:"Government Contracting & Procurement",
    ID:"1385",
    Parent:"76"
  },
  {
    Category:"Government Ministries",
    ID:"1387",
    Parent:"76"
  },
  {
    Category:"Intelligence & Counterterrorism",
    ID:"1221",
    Parent:"76"
  },
  {
    Category:"Legislative Branch",
    ID:"964",
    Parent:"76"
  },
  {
    Category:"Lobbying",
    ID:"1386",
    Parent:"76"
  },
  {
    Category:"Multilateral Organizations",
    ID:"965",
    Parent:"76"
  },
  {
    Category:"Public Finance",
    ID:"1161",
    Parent:"76"
  },
  {
    Category:"Public Policy",
    ID:"1316",
    Parent:"76"
  },
  {
    Category:"Royalty",
    ID:"702",
    Parent:"76"
  },
  {
    Category:"State & Local Government",
    ID:"966",
    Parent:"76"
  },
  {
    Category:"Visa & Immigration",
    ID:"555",
    Parent:"76"
  },
  {
    Category:"Legal",
    ID:"75",
    Parent:"19"
  },
  {
    Category:"Accident & Personal Injury Law",
    ID:"427",
    Parent:"75"
  },
  {
    Category:"Bankruptcy",
    ID:"423",
    Parent:"75"
  },
  {
    Category:"Business & Corporate Law",
    ID:"1272",
    Parent:"75"
  },
  {
    Category:"Constitutional Law & Civil Rights",
    ID:"967",
    Parent:"75"
  },
  {
    Category:"Criminal Law",
    ID:"424",
    Parent:"75"
  },
  {
    Category:"Family Law",
    ID:"522",
    Parent:"75"
  },
  {
    Category:"Intellectual Property",
    ID:"426",
    Parent:"75"
  },
  {
    Category:"Labor & Employment Law",
    ID:"701",
    Parent:"75"
  },
  {
    Category:"Legal Education",
    ID:"792",
    Parent:"75"
  },
  {
    Category:"Legal Services",
    ID:"969",
    Parent:"75"
  },
  {
    Category:"Product Liability",
    ID:"970",
    Parent:"75"
  },
  {
    Category:"Military",
    ID:"366",
    Parent:"19"
  },
  {
    Category:"Air Force",
    ID:"1247",
    Parent:"366"
  },
  {
    Category:"Army",
    ID:"1248",
    Parent:"366"
  },
  {
    Category:"Marines",
    ID:"1250",
    Parent:"366"
  },
  {
    Category:"Navy",
    ID:"1249",
    Parent:"366"
  },
  {
    Category:"Veterans",
    ID:"793",
    Parent:"366"
  },
  {
    Category:"Public Safety",
    ID:"166",
    Parent:"19"
  },
  {
    Category:"Crime & Justice",
    ID:"704",
    Parent:"166"
  },
  {
    Category:"Corporate & Financial Crime",
    ID:"1181",
    Parent:"704"
  },
  {
    Category:"Gangs & Organized Crime",
    ID:"1312",
    Parent:"704"
  },
  {
    Category:"Prisons & Corrections",
    ID:"1284",
    Parent:"704"
  },
  {
    Category:"Emergency Services",
    ID:"168",
    Parent:"166"
  },
  {
    Category:"Law Enforcement",
    ID:"535",
    Parent:"166"
  },
  {
    Category:"Security Products & Services",
    ID:"705",
    Parent:"166"
  },
  {
    Category:"Social Services",
    ID:"508",
    Parent:"19"
  },
  {
    Category:"Counseling Services",
    ID:"511",
    Parent:"508"
  },
  {
    Category:"Welfare & Unemployment",
    ID:"706",
    Parent:"508"
  },
  {
    Category:"News",
    ID:"16",
    Parent:"0"
  },
  {
    Category:"Broadcast & Network News",
    ID:"112",
    Parent:"16"
  },
  {
    Category:"Business News",
    ID:"784",
    Parent:"16"
  },
  {
    Category:"Company News",
    ID:"1179",
    Parent:"784"
  },
  {
    Category:"Company Earnings",
    ID:"1240",
    Parent:"1179"
  },
  {
    Category:"Mergers & Acquisitions",
    ID:"1241",
    Parent:"1179"
  },
  {
    Category:"Economy News",
    ID:"1164",
    Parent:"784"
  },
  {
    Category:"Financial Markets",
    ID:"1163",
    Parent:"784"
  },
  {
    Category:"Fiscal Policy News",
    ID:"1165",
    Parent:"784"
  },
  {
    Category:"Gossip & Tabloid News",
    ID:"507",
    Parent:"16"
  },
  {
    Category:"Scandals & Investigations",
    ID:"1259",
    Parent:"507"
  },
  {
    Category:"Health News",
    ID:"1253",
    Parent:"16"
  },
  {
    Category:"Journalism & News Industry",
    ID:"1204",
    Parent:"16"
  },
  {
    Category:"Local News",
    ID:"572",
    Parent:"16"
  },
  {
    Category:"Newspapers",
    ID:"408",
    Parent:"16"
  },
  {
    Category:"Politics",
    ID:"396",
    Parent:"16"
  },
  {
    Category:"Campaigns & Elections",
    ID:"398",
    Parent:"396"
  },
  {
    Category:"Left-Wing Politics",
    ID:"410",
    Parent:"396"
  },
  {
    Category:"Media Critics & Watchdogs",
    ID:"1203",
    Parent:"396"
  },
  {
    Category:"Opinion & Commentary",
    ID:"1201",
    Parent:"396"
  },
  {
    Category:"Political Polls & Surveys",
    ID:"1202",
    Parent:"396"
  },
  {
    Category:"Right-Wing Politics",
    ID:"409",
    Parent:"396"
  },
  {
    Category:"Sports News",
    ID:"1077",
    Parent:"16"
  },
  {
    Category:"Technology News",
    ID:"785",
    Parent:"16"
  },
  {
    Category:"Weather",
    ID:"63",
    Parent:"16"
  },
  {
    Category:"World News",
    ID:"1209",
    Parent:"16"
  },
  {
    Category:"Online Communities",
    ID:"299",
    Parent:"0"
  },
  {
    Category:"Blogging Resources & Services",
    ID:"504",
    Parent:"299"
  },
  {
    Category:"Microblogging",
    ID:"1381",
    Parent:"504"
  },
  {
    Category:"Dating & Personals",
    ID:"55",
    Parent:"299"
  },
  {
    Category:"Matrimonial Services",
    ID:"546",
    Parent:"55"
  },
  {
    Category:"Personals",
    ID:"102",
    Parent:"55"
  },
  {
    Category:"Photo Rating Sites",
    ID:"320",
    Parent:"55"
  },
  {
    Category:"Feed Aggregation & Social Bookmarking",
    ID:"1482",
    Parent:"299"
  },
  {
    Category:"File Sharing & Hosting",
    ID:"321",
    Parent:"299"
  },
  {
    Category:"Forum & Chat Providers",
    ID:"191",
    Parent:"299"
  },
  {
    Category:"Online Goodies",
    ID:"43",
    Parent:"299"
  },
  {
    Category:"Clip Art & Animated GIFs",
    ID:"1223",
    Parent:"43"
  },
  {
    Category:"Skins Themes & Wallpapers",
    ID:"578",
    Parent:"43"
  },
  {
    Category:"Social Network Apps & Add-Ons",
    ID:"847",
    Parent:"43"
  },
  {
    Category:"Online Journals & Personal Sites",
    ID:"582",
    Parent:"299"
  },
  {
    Category:"Photo & Video Sharing",
    ID:"275",
    Parent:"299"
  },
  {
    Category:"Photo & Image Sharing",
    ID:"978",
    Parent:"275"
  },
  {
    Category:"Video Sharing",
    ID:"979",
    Parent:"275"
  },
  {
    Category:"Social Networks",
    ID:"529",
    Parent:"299"
  },
  {
    Category:"Virtual Worlds",
    ID:"972",
    Parent:"299"
  },
  {
    Category:"People & Society",
    ID:"14",
    Parent:"0"
  },
  {
    Category:"Disabled & Special Needs",
    ID:"677",
    Parent:"14"
  },
  {
    Category:"Ethnic & Identity Groups",
    ID:"56",
    Parent:"14"
  },
  {
    Category:"Africans & Diaspora",
    ID:"579",
    Parent:"56"
  },
  {
    Category:"African-Americans",
    ID:"547",
    Parent:"579"
  },
  {
    Category:"Arabs & Middle Easterners",
    ID:"556",
    Parent:"56"
  },
  {
    Category:"Asians & Diaspora",
    ID:"1257",
    Parent:"56"
  },
  {
    Category:"East Asians & Diaspora",
    ID:"549",
    Parent:"1257"
  },
  {
    Category:"South Asians & Diaspora",
    ID:"528",
    Parent:"1257"
  },
  {
    Category:"Southeast Asians & Pacific Islanders",
    ID:"580",
    Parent:"1257"
  },
  {
    Category:"Eastern Europeans",
    ID:"682",
    Parent:"56"
  },
  {
    Category:"Expatriate Communities",
    ID:"973",
    Parent:"56"
  },
  {
    Category:"Gay-Lesbian-Bisexual-Transgender",
    ID:"113",
    Parent:"56"
  },
  {
    Category:"Indigenous Peoples",
    ID:"681",
    Parent:"56"
  },
  {
    Category:"Native Americans",
    ID:"171",
    Parent:"681"
  },
  {
    Category:"Jewish Culture",
    ID:"550",
    Parent:"56"
  },
  {
    Category:"Latinos & Latin-Americans",
    ID:"548",
    Parent:"56"
  },
  {
    Category:"Western Europeans",
    ID:"683",
    Parent:"56"
  },
  {
    Category:"Family & Relationships",
    ID:"1131",
    Parent:"14"
  },
  {
    Category:"Etiquette",
    ID:"1304",
    Parent:"1131"
  },
  {
    Category:"Family",
    ID:"1132",
    Parent:"1131"
  },
  {
    Category:"Ancestry & Genealogy",
    ID:"400",
    Parent:"1132"
  },
  {
    Category:"Baby & Pet Names",
    ID:"1231",
    Parent:"1132"
  },
  {
    Category:"Parenting",
    ID:"58",
    Parent:"1132"
  },
  {
    Category:"Adoption",
    ID:"974",
    Parent:"58"
  },
  {
    Category:"Babies & Toddlers",
    ID:"1374",
    Parent:"58"
  },
  {
    Category:"Baby & Toddler Toys",
    ID:"1585",
    Parent:"1374"
  },
  {
    Category:"Baby Care & Hygiene",
    ID:"115",
    Parent:"1374"
  },
  {
    Category:"Baby Food & Formula",
    ID:"1584",
    Parent:"1374"
  },
  {
    Category:"Child Care",
    ID:"403",
    Parent:"58"
  },
  {
    Category:"Pregnancy & Maternity",
    ID:"401",
    Parent:"58"
  },
  {
    Category:"Youth Camps",
    ID:"402",
    Parent:"58"
  },
  {
    Category:"Friendship",
    ID:"1134",
    Parent:"1131"
  },
  {
    Category:"Marriage",
    ID:"1133",
    Parent:"1131"
  },
  {
    Category:"Romance",
    ID:"1135",
    Parent:"1131"
  },
  {
    Category:"Troubled Relationships",
    ID:"1260",
    Parent:"1131"
  },
  {
    Category:"Divorce & Separation",
    ID:"1261",
    Parent:"1260"
  },
  {
    Category:"Men's Interests",
    ID:"594",
    Parent:"14"
  },
  {
    Category:"Men's Interests (Mature)",
    ID:"525",
    Parent:"594"
  },
  {
    Category:"Religion & Belief",
    ID:"59",
    Parent:"14"
  },
  {
    Category:"Astrology & Divination",
    ID:"448",
    Parent:"59"
  },
  {
    Category:"Buddhism",
    ID:"862",
    Parent:"59"
  },
  {
    Category:"Christianity",
    ID:"864",
    Parent:"59"
  },
  {
    Category:"Hinduism",
    ID:"866",
    Parent:"59"
  },
  {
    Category:"Islam",
    ID:"868",
    Parent:"59"
  },
  {
    Category:"Judaism",
    ID:"869",
    Parent:"59"
  },
  {
    Category:"Pagan & Esoteric Traditions",
    ID:"1258",
    Parent:"59"
  },
  {
    Category:"Places of Worship",
    ID:"1296",
    Parent:"59"
  },
  {
    Category:"Scientology",
    ID:"1251",
    Parent:"59"
  },
  {
    Category:"Self-Help & Motivational",
    ID:"870",
    Parent:"59"
  },
  {
    Category:"Skeptics & Non-Believers",
    ID:"975",
    Parent:"59"
  },
  {
    Category:"Spirituality",
    ID:"101",
    Parent:"59"
  },
  {
    Category:"Theology & Religious Study",
    ID:"1340",
    Parent:"59"
  },
  {
    Category:"Seniors & Retirement",
    ID:"298",
    Parent:"14"
  },
  {
    Category:"Social Issues & Advocacy",
    ID:"54",
    Parent:"14"
  },
  {
    Category:"Charity & Philanthropy",
    ID:"57",
    Parent:"54"
  },
  {
    Category:"Discrimination & Identity Relations",
    ID:"1205",
    Parent:"54"
  },
  {
    Category:"Drug Laws & Policy",
    ID:"1314",
    Parent:"54"
  },
  {
    Category:"Ethics",
    ID:"1483",
    Parent:"54"
  },
  {
    Category:"Green Living & Environmental Issues",
    ID:"82",
    Parent:"54"
  },
  {
    Category:"Housing & Development",
    ID:"1166",
    Parent:"54"
  },
  {
    Category:"Human Rights & Liberties",
    ID:"1280",
    Parent:"54"
  },
  {
    Category:"Immigration Policy & Border Issues",
    ID:"1313",
    Parent:"54"
  },
  {
    Category:"Poverty & Hunger",
    ID:"1127",
    Parent:"54"
  },
  {
    Category:"Privacy Issues",
    ID:"1281",
    Parent:"54"
  },
  {
    Category:"Reproductive Rights",
    ID:"976",
    Parent:"54"
  },
  {
    Category:"Same-Sex Marriage",
    ID:"1301",
    Parent:"54"
  },
  {
    Category:"Work & Labor Issues",
    ID:"703",
    Parent:"54"
  },
  {
    Category:"Unions & Labor Movement",
    ID:"1121",
    Parent:"703"
  },
  {
    Category:"Social Sciences",
    ID:"509",
    Parent:"14"
  },
  {
    Category:"Anthropology",
    ID:"1484",
    Parent:"509"
  },
  {
    Category:"Archaeology",
    ID:"1485",
    Parent:"509"
  },
  {
    Category:"Communications & Media Studies",
    ID:"1302",
    Parent:"509"
  },
  {
    Category:"Public Speaking",
    ID:"1303",
    Parent:"1302"
  },
  {
    Category:"Demographics",
    ID:"510",
    Parent:"509"
  },
  {
    Category:"Economics",
    ID:"520",
    Parent:"509"
  },
  {
    Category:"International Relations",
    ID:"521",
    Parent:"509"
  },
  {
    Category:"Psychology",
    ID:"543",
    Parent:"509"
  },
  {
    Category:"Subcultures & Niche Interests",
    ID:"502",
    Parent:"14"
  },
  {
    Category:"Goth Subculture",
    ID:"503",
    Parent:"502"
  },
  {
    Category:"Science Fiction & Fantasy",
    ID:"676",
    Parent:"502"
  },
  {
    Category:"Women's Interests",
    ID:"325",
    Parent:"14"
  },
  {
    Category:"Pets & Animals",
    ID:"66",
    Parent:"0"
  },
  {
    Category:"Animal Products & Services",
    ID:"882",
    Parent:"66"
  },
  {
    Category:"Animal Welfare",
    ID:"883",
    Parent:"882"
  },
  {
    Category:"Pet Food & Supplies",
    ID:"379",
    Parent:"882"
  },
  {
    Category:"Veterinarians",
    ID:"380",
    Parent:"882"
  },
  {
    Category:"Pets",
    ID:"563",
    Parent:"66"
  },
  {
    Category:"Birds",
    ID:"884",
    Parent:"563"
  },
  {
    Category:"Cats",
    ID:"885",
    Parent:"563"
  },
  {
    Category:"Dogs",
    ID:"886",
    Parent:"563"
  },
  {
    Category:"Exotic Pets",
    ID:"607",
    Parent:"563"
  },
  {
    Category:"Fish & Aquaria",
    ID:"887",
    Parent:"563"
  },
  {
    Category:"Horses",
    ID:"888",
    Parent:"563"
  },
  {
    Category:"Rabbits & Rodents",
    ID:"889",
    Parent:"563"
  },
  {
    Category:"Reptiles & Amphibians",
    ID:"890",
    Parent:"563"
  },
  {
    Category:"Wildlife",
    ID:"119",
    Parent:"66"
  },
  {
    Category:"Real Estate",
    ID:"29",
    Parent:"0"
  },
  {
    Category:"Apartments & Residential Rentals",
    ID:"378",
    Parent:"29"
  },
  {
    Category:"Bank-Owned & Foreclosed Properties",
    ID:"1460",
    Parent:"29"
  },
  {
    Category:"Commercial & Investment Real Estate",
    ID:"1178",
    Parent:"29"
  },
  {
    Category:"Property Development",
    ID:"687",
    Parent:"29"
  },
  {
    Category:"Property Inspections & Appraisals",
    ID:"463",
    Parent:"29"
  },
  {
    Category:"Property Management",
    ID:"425",
    Parent:"29"
  },
  {
    Category:"Real Estate Agencies",
    ID:"96",
    Parent:"29"
  },
  {
    Category:"Real Estate Listings",
    ID:"1080",
    Parent:"29"
  },
  {
    Category:"Timeshares & Vacation Properties",
    ID:"1081",
    Parent:"29"
  },
  {
    Category:"Reference",
    ID:"533",
    Parent:"0"
  },
  {
    Category:"Directories & Listings",
    ID:"527",
    Parent:"533"
  },
  {
    Category:"Business & Personal Listings",
    ID:"377",
    Parent:"527"
  },
  {
    Category:"General Reference",
    ID:"980",
    Parent:"533"
  },
  {
    Category:"Biographies & Quotations",
    ID:"690",
    Parent:"980"
  },
  {
    Category:"Calculators & Reference Tools",
    ID:"691",
    Parent:"980"
  },
  {
    Category:"Dictionaries & Encyclopedias",
    ID:"692",
    Parent:"980"
  },
  {
    Category:"Educational Resources",
    ID:"374",
    Parent:"980"
  },
  {
    Category:"Forms Guides & Templates",
    ID:"693",
    Parent:"980"
  },
  {
    Category:"Legal Forms",
    ID:"1137",
    Parent:"693"
  },
  {
    Category:"How-To, DIY & Expert Content",
    ID:"694",
    Parent:"980"
  },
  {
    Category:"Public Records",
    ID:"1136",
    Parent:"980"
  },
  {
    Category:"Time & Calendars",
    ID:"695",
    Parent:"980"
  },
  {
    Category:"Geographic Reference",
    ID:"1084",
    Parent:"533"
  },
  {
    Category:"City & Local Guides",
    ID:"1014",
    Parent:"1084"
  },
  {
    Category:"Maps",
    ID:"268",
    Parent:"1084"
  },
  {
    Category:"Traffic & Public Transit",
    ID:"685",
    Parent:"268"
  },
  {
    Category:"Humanities",
    ID:"474",
    Parent:"533"
  },
  {
    Category:"History",
    ID:"433",
    Parent:"474"
  },
  {
    Category:"Military History",
    ID:"1288",
    Parent:"433"
  },
  {
    Category:"Myth & Folklore",
    ID:"609",
    Parent:"474"
  },
  {
    Category:"Philosophy",
    ID:"1093",
    Parent:"474"
  },
  {
    Category:"Language Resources",
    ID:"108",
    Parent:"533"
  },
  {
    Category:"Foreign Language Resources",
    ID:"1264",
    Parent:"108"
  },
  {
    Category:"Foreign Language Study",
    ID:"1266",
    Parent:"1264"
  },
  {
    Category:"Translation Tools & Resources",
    ID:"1265",
    Parent:"1264"
  },
  {
    Category:"Libraries & Museums",
    ID:"375",
    Parent:"533"
  },
  {
    Category:"Libraries",
    ID:"1520",
    Parent:"375"
  },
  {
    Category:"Museums",
    ID:"1519",
    Parent:"375"
  },
  {
    Category:"Technical Reference",
    ID:"1233",
    Parent:"533"
  },
  {
    Category:"Science",
    ID:"174",
    Parent:"0"
  },
  {
    Category:"Astronomy",
    ID:"435",
    Parent:"174"
  },
  {
    Category:"Biological Sciences",
    ID:"440",
    Parent:"174"
  },
  {
    Category:"Anatomy",
    ID:"788",
    Parent:"440"
  },
  {
    Category:"Flora & Fauna",
    ID:"981",
    Parent:"440"
  },
  {
    Category:"Insects & Entomology",
    ID:"1278",
    Parent:"981"
  },
  {
    Category:"Genetics",
    ID:"982",
    Parent:"440"
  },
  {
    Category:"Neuroscience",
    ID:"1226",
    Parent:"440"
  },
  {
    Category:"Chemistry",
    ID:"505",
    Parent:"174"
  },
  {
    Category:"Computer Science",
    ID:"1227",
    Parent:"174"
  },
  {
    Category:"Distributed & Parallel Computing",
    ID:"1298",
    Parent:"1227"
  },
  {
    Category:"Machine Learning & Artificial Intelligence",
    ID:"1299",
    Parent:"1227"
  },
  {
    Category:"Earth Sciences",
    ID:"1168",
    Parent:"174"
  },
  {
    Category:"Atmospheric Science",
    ID:"1254",
    Parent:"1168"
  },
  {
    Category:"Geology",
    ID:"443",
    Parent:"1168"
  },
  {
    Category:"Paleontology",
    ID:"1169",
    Parent:"1168"
  },
  {
    Category:"Water & Marine Sciences",
    ID:"441",
    Parent:"1168"
  },
  {
    Category:"Ecology & Environment",
    ID:"442",
    Parent:"174"
  },
  {
    Category:"Climate Change & Global Warming",
    ID:"1255",
    Parent:"442"
  },
  {
    Category:"Engineering & Technology",
    ID:"231",
    Parent:"174"
  },
  {
    Category:"Robotics",
    ID:"1141",
    Parent:"231"
  },
  {
    Category:"Mathematics",
    ID:"436",
    Parent:"174"
  },
  {
    Category:"Statistics",
    ID:"1252",
    Parent:"436"
  },
  {
    Category:"Physics",
    ID:"444",
    Parent:"174"
  },
  {
    Category:"Scientific Equipment",
    ID:"445",
    Parent:"174"
  },
  {
    Category:"Scientific Institutions",
    ID:"446",
    Parent:"174"
  },
  {
    Category:"Shopping",
    ID:"18",
    Parent:"0"
  },
  {
    Category:"Antiques & Collectibles",
    ID:"64",
    Parent:"18"
  },
  {
    Category:"Apparel",
    ID:"68",
    Parent:"18"
  },
  {
    Category:"Apparel Services",
    ID:"1228",
    Parent:"68"
  },
  {
    Category:"Athletic Apparel",
    ID:"983",
    Parent:"68"
  },
  {
    Category:"Casual Apparel",
    ID:"984",
    Parent:"68"
  },
  {
    Category:"T-Shirts",
    ID:"428",
    Parent:"984"
  },
  {
    Category:"Children's Clothing",
    ID:"985",
    Parent:"68"
  },
  {
    Category:"Clothing Accessories",
    ID:"124",
    Parent:"68"
  },
  {
    Category:"Gems & Jewelry",
    ID:"350",
    Parent:"124"
  },
  {
    Category:"Rings",
    ID:"1486",
    Parent:"350"
  },
  {
    Category:"Handbags & Purses",
    ID:"986",
    Parent:"124"
  },
  {
    Category:"Watches",
    ID:"987",
    Parent:"124"
  },
  {
    Category:"Costumes",
    ID:"988",
    Parent:"68"
  },
  {
    Category:"Eyewear",
    ID:"989",
    Parent:"68"
  },
  {
    Category:"Sunglasses",
    ID:"1487",
    Parent:"989"
  },
  {
    Category:"Footwear",
    ID:"697",
    Parent:"68"
  },
  {
    Category:"Athletic Shoes",
    ID:"1488",
    Parent:"697"
  },
  {
    Category:"Boots",
    ID:"1489",
    Parent:"697"
  },
  {
    Category:"Casual Shoes",
    ID:"1490",
    Parent:"697"
  },
  {
    Category:"Formal Wear",
    ID:"990",
    Parent:"68"
  },
  {
    Category:"Bridal Wear",
    ID:"1597",
    Parent:"990"
  },
  {
    Category:"Headwear",
    ID:"991",
    Parent:"68"
  },
  {
    Category:"Men's Clothing",
    ID:"992",
    Parent:"68"
  },
  {
    Category:"Outerwear",
    ID:"993",
    Parent:"68"
  },
  {
    Category:"Sleepwear",
    ID:"994",
    Parent:"68"
  },
  {
    Category:"Suits & Business Attire",
    ID:"1598",
    Parent:"68"
  },
  {
    Category:"Swimwear",
    ID:"995",
    Parent:"68"
  },
  {
    Category:"Undergarments",
    ID:"530",
    Parent:"68"
  },
  {
    Category:"Uniforms & Workwear",
    ID:"996",
    Parent:"68"
  },
  {
    Category:"Women's Clothing",
    ID:"997",
    Parent:"68"
  },
  {
    Category:"Dresses",
    ID:"1632",
    Parent:"997"
  },
  {
    Category:"Skirts",
    ID:"1631",
    Parent:"997"
  },
  {
    Category:"Auctions",
    ID:"292",
    Parent:"18"
  },
  {
    Category:"Classifieds",
    ID:"61",
    Parent:"18"
  },
  {
    Category:"Consumer Resources",
    ID:"69",
    Parent:"18"
  },
  {
    Category:"Consumer Advocacy & Protection",
    ID:"97",
    Parent:"69"
  },
  {
    Category:"Coupons & Discount Offers",
    ID:"365",
    Parent:"69"
  },
  {
    Category:"Customer Services",
    ID:"450",
    Parent:"69"
  },
  {
    Category:"Loyalty Cards & Programs",
    ID:"1309",
    Parent:"450"
  },
  {
    Category:"Technical Support",
    ID:"567",
    Parent:"450"
  },
  {
    Category:"Warranties & Service Contracts",
    ID:"451",
    Parent:"450"
  },
  {
    Category:"Identity Theft & Protection",
    ID:"1504",
    Parent:"69"
  },
  {
    Category:"Product Reviews & Price Comparisons",
    ID:"353",
    Parent:"69"
  },
  {
    Category:"Price Comparisons",
    ID:"352",
    Parent:"353"
  },
  {
    Category:"Discount & Outlet Stores",
    ID:"1505",
    Parent:"18"
  },
  {
    Category:"Entertainment Media",
    ID:"1143",
    Parent:"18"
  },
  {
    Category:"Entertainment Media Rentals",
    ID:"1144",
    Parent:"1143"
  },
  {
    Category:"Gifts & Special Event Items",
    ID:"70",
    Parent:"18"
  },
  {
    Category:"Cards & Greetings",
    ID:"100",
    Parent:"70"
  },
  {
    Category:"Custom & Personalized Items",
    ID:"1506",
    Parent:"70"
  },
  {
    Category:"Flowers",
    ID:"323",
    Parent:"70"
  },
  {
    Category:"Gifts",
    ID:"99",
    Parent:"70"
  },
  {
    Category:"Party & Holiday Supplies",
    ID:"324",
    Parent:"70"
  },
  {
    Category:"Green & Eco-Friendly Shopping",
    ID:"1507",
    Parent:"18"
  },
  {
    Category:"Luxury Goods",
    ID:"696",
    Parent:"18"
  },
  {
    Category:"Mass Merchants & Department Stores",
    ID:"73",
    Parent:"18"
  },
  {
    Category:"Photo & Video Services",
    ID:"576",
    Parent:"18"
  },
  {
    Category:"Stock Photography",
    ID:"574",
    Parent:"576"
  },
  {
    Category:"Shopping Portals & Search Engines",
    ID:"531",
    Parent:"18"
  },
  {
    Category:"Swap Meets & Outdoor Markets",
    ID:"1210",
    Parent:"18"
  },
  {
    Category:"Tobacco Products",
    ID:"123",
    Parent:"18"
  },
  {
    Category:"Toys",
    ID:"432",
    Parent:"18"
  },
  {
    Category:"Action Figures",
    ID:"1580",
    Parent:"432"
  },
  {
    Category:"Building Toys",
    ID:"1581",
    Parent:"432"
  },
  {
    Category:"Die-cast & Toy Vehicles",
    ID:"1587",
    Parent:"432"
  },
  {
    Category:"Dolls & Accessories",
    ID:"1582",
    Parent:"432"
  },
  {
    Category:"Outdoor Toys & Play Equipment",
    ID:"1588",
    Parent:"432"
  },
  {
    Category:"Puppets",
    ID:"1589",
    Parent:"432"
  },
  {
    Category:"Ride-On Toys & Wagons",
    ID:"1586",
    Parent:"432"
  },
  {
    Category:"Stuffed Toys",
    ID:"1583",
    Parent:"432"
  },
  {
    Category:"Wholesalers & Liquidators",
    ID:"1225",
    Parent:"18"
  },
  {
    Category:"Sports",
    ID:"20",
    Parent:"0"
  },
  {
    Category:"College Sports",
    ID:"1073",
    Parent:"20"
  },
  {
    Category:"Combat Sports",
    ID:"514",
    Parent:"20"
  },
  {
    Category:"Boxing",
    ID:"515",
    Parent:"514"
  },
  {
    Category:"Martial Arts",
    ID:"516",
    Parent:"514"
  },
  {
    Category:"Wrestling",
    ID:"512",
    Parent:"514"
  },
  {
    Category:"Extreme Sports",
    ID:"554",
    Parent:"20"
  },
  {
    Category:"Drag & Street Racing",
    ID:"1206",
    Parent:"554"
  },
  {
    Category:"Stunts & Dangerous Feats",
    ID:"1207",
    Parent:"554"
  },
  {
    Category:"Fantasy Sports",
    ID:"998",
    Parent:"20"
  },
  {
    Category:"Individual Sports",
    ID:"1000",
    Parent:"20"
  },
  {
    Category:"Bowling",
    ID:"1016",
    Parent:"1000"
  },
  {
    Category:"Cycling",
    ID:"458",
    Parent:"1000"
  },
  {
    Category:"Golf",
    ID:"261",
    Parent:"1000"
  },
  {
    Category:"Gymnastics",
    ID:"519",
    Parent:"1000"
  },
  {
    Category:"Racquet Sports",
    ID:"262",
    Parent:"1000"
  },
  {
    Category:"Tennis",
    ID:"1376",
    Parent:"262"
  },
  {
    Category:"Running & Walking",
    ID:"541",
    Parent:"1000"
  },
  {
    Category:"Skate Sports",
    ID:"1126",
    Parent:"1000"
  },
  {
    Category:"Track & Field",
    ID:"518",
    Parent:"1000"
  },
  {
    Category:"Motor Sports",
    ID:"180",
    Parent:"20"
  },
  {
    Category:"Auto Racing",
    ID:"1595",
    Parent:"180"
  },
  {
    Category:"Motorcycle Racing",
    ID:"1596",
    Parent:"180"
  },
  {
    Category:"Sport Scores & Statistics",
    ID:"1599",
    Parent:"20"
  },
  {
    Category:"Sporting Goods",
    ID:"263",
    Parent:"20"
  },
  {
    Category:"American Football Equipment",
    ID:"1611",
    Parent:"263"
  },
  {
    Category:"Baseball Equipment",
    ID:"1612",
    Parent:"263"
  },
  {
    Category:"Basketball Equipment",
    ID:"1613",
    Parent:"263"
  },
  {
    Category:"Bowling Equipment",
    ID:"1615",
    Parent:"263"
  },
  {
    Category:"Combat Sports Equipment",
    ID:"1616",
    Parent:"263"
  },
  {
    Category:"Boxing Gloves & Gear",
    ID:"1633",
    Parent:"1616"
  },
  {
    Category:"Martial Arts Equipment",
    ID:"1634",
    Parent:"1616"
  },
  {
    Category:"Cricket Equipment",
    ID:"1617",
    Parent:"263"
  },
  {
    Category:"Equestrian Equipment & Tack",
    ID:"1618",
    Parent:"263"
  },
  {
    Category:"Golf Equipment",
    ID:"1619",
    Parent:"263"
  },
  {
    Category:"Gymnastics Equipment",
    ID:"1620",
    Parent:"263"
  },
  {
    Category:"Hockey Equipment",
    ID:"1621",
    Parent:"263"
  },
  {
    Category:"Ice Skating Equipment",
    ID:"1622",
    Parent:"263"
  },
  {
    Category:"Roller Skating & Rollerblading Equipment",
    ID:"1623",
    Parent:"263"
  },
  {
    Category:"Skateboarding Equipment",
    ID:"1624",
    Parent:"263"
  },
  {
    Category:"Soccer Equipment",
    ID:"1614",
    Parent:"263"
  },
  {
    Category:"Sports Memorabilia",
    ID:"1083",
    Parent:"263"
  },
  {
    Category:"Squash & Racquetball Equipment",
    ID:"1625",
    Parent:"263"
  },
  {
    Category:"Table Tennis Equipment",
    ID:"1627",
    Parent:"263"
  },
  {
    Category:"Tennis Equipment",
    ID:"1628",
    Parent:"263"
  },
  {
    Category:"Volleyball Equipment",
    ID:"1629",
    Parent:"263"
  },
  {
    Category:"Water Sports Equipment",
    ID:"1626",
    Parent:"263"
  },
  {
    Category:"Winter Sports Equipment",
    ID:"1630",
    Parent:"263"
  },
  {
    Category:"Skiing Equipment",
    ID:"1635",
    Parent:"1630"
  },
  {
    Category:"Snowboarding Gear",
    ID:"1636",
    Parent:"1630"
  },
  {
    Category:"Sports Coaching & Training",
    ID:"1082",
    Parent:"20"
  },
  {
    Category:"Team Sports",
    ID:"1001",
    Parent:"20"
  },
  {
    Category:"American Football",
    ID:"258",
    Parent:"1001"
  },
  {
    Category:"Australian Football",
    ID:"1508",
    Parent:"1001"
  },
  {
    Category:"Baseball",
    ID:"259",
    Parent:"1001"
  },
  {
    Category:"Basketball",
    ID:"264",
    Parent:"1001"
  },
  {
    Category:"Cheerleading",
    ID:"534",
    Parent:"1001"
  },
  {
    Category:"Cricket",
    ID:"296",
    Parent:"1001"
  },
  {
    Category:"Handball",
    ID:"1017",
    Parent:"1001"
  },
  {
    Category:"Hockey",
    ID:"260",
    Parent:"1001"
  },
  {
    Category:"Rugby",
    ID:"517",
    Parent:"1001"
  },
  {
    Category:"Soccer",
    ID:"294",
    Parent:"1001"
  },
  {
    Category:"Volleyball",
    ID:"699",
    Parent:"1001"
  },
  {
    Category:"Water Sports",
    ID:"118",
    Parent:"20"
  },
  {
    Category:"Surfing",
    ID:"1593",
    Parent:"118"
  },
  {
    Category:"Swimming",
    ID:"1594",
    Parent:"118"
  },
  {
    Category:"Winter Sports",
    ID:"265",
    Parent:"20"
  },
  {
    Category:"Ice Skating",
    ID:"1149",
    Parent:"265"
  },
  {
    Category:"Skiing & Snowboarding",
    ID:"1148",
    Parent:"265"
  },
  {
    Category:"World Sports Competitions",
    ID:"1198",
    Parent:"20"
  },
  {
    Category:"Olympics",
    ID:"513",
    Parent:"1198"
  },
  {
    Category:"Travel",
    ID:"67",
    Parent:"0"
  },
  {
    Category:"Air Travel",
    ID:"203",
    Parent:"67"
  },
  {
    Category:"Airport Parking & Transportation",
    ID:"1245",
    Parent:"203"
  },
  {
    Category:"Bus & Rail",
    ID:"708",
    Parent:"67"
  },
  {
    Category:"Car Rental & Taxi Services",
    ID:"205",
    Parent:"67"
  },
  {
    Category:"Carpooling & Vehicle Sharing",
    ID:"1339",
    Parent:"67"
  },
  {
    Category:"Cruises & Charters",
    ID:"206",
    Parent:"67"
  },
  {
    Category:"Hotels & Accommodations",
    ID:"179",
    Parent:"67"
  },
  {
    Category:"Luggage & Travel Accessories",
    ID:"1003",
    Parent:"67"
  },
  {
    Category:"Specialty Travel",
    ID:"1004",
    Parent:"67"
  },
  {
    Category:"Adventure Travel",
    ID:"707",
    Parent:"1004"
  },
  {
    Category:"Agritourism",
    ID:"1389",
    Parent:"1004"
  },
  {
    Category:"Ecotourism",
    ID:"1005",
    Parent:"1004"
  },
  {
    Category:"Sightseeing Tours",
    ID:"1390",
    Parent:"1004"
  },
  {
    Category:"Vineyards & Wine Tourism",
    ID:"1391",
    Parent:"1004"
  },
  {
    Category:"Tourist Destinations",
    ID:"208",
    Parent:"67"
  },
  {
    Category:"Beaches & Islands",
    ID:"1074",
    Parent:"208"
  },
  {
    Category:"Historical Sites & Buildings",
    ID:"1006",
    Parent:"208"
  },
  {
    Category:"Lakes & Rivers",
    ID:"1120",
    Parent:"208"
  },
  {
    Category:"Mountain & Ski Resorts",
    ID:"1119",
    Parent:"208"
  },
  {
    Category:"Regional Parks & Gardens",
    ID:"1007",
    Parent:"208"
  },
  {
    Category:"Theme Parks",
    ID:"1008",
    Parent:"208"
  },
  {
    Category:"Zoos-Aquariums-Preserves",
    ID:"1009",
    Parent:"208"
  },
  {
    Category:"Travel Agencies & Services",
    ID:"1010",
    Parent:"67"
  },
  {
    Category:"Tourist Boards & Visitor Centers",
    ID:"1392",
    Parent:"1010"
  },
  {
    Category:"Vacation Offers",
    ID:"1019",
    Parent:"1010"
  },
  {
    Category:"Travel Guides & Travelogues",
    ID:"1011",
    Parent:"67"
  },
  {
    Category:"World Localities",
    ID:"5000",
    Parent:"0"
  },
  {
    Category:"Africa",
    ID:"5001",
    Parent:"5000"
  },
  {
    Category:"Eastern Africa",
    ID:"5002",
    Parent:"5001"
  },
  {
    Category:"Ethiopia",
    ID:"5003",
    Parent:"5002"
  },
  {
    Category:"Kenya",
    ID:"5004",
    Parent:"5002"
  },
  {
    Category:"Nairobi",
    ID:"5005",
    Parent:"5004"
  },
  {
    Category:"Madagascar",
    ID:"5621",
    Parent:"5002"
  },
  {
    Category:"Malawi",
    ID:"5714",
    Parent:"5002"
  },
  {
    Category:"Mozambique",
    ID:"5634",
    Parent:"5002"
  },
  {
    Category:"Rwanda",
    ID:"5473",
    Parent:"5002"
  },
  {
    Category:"Somalia",
    ID:"5591",
    Parent:"5002"
  },
  {
    Category:"Tanzania",
    ID:"5006",
    Parent:"5002"
  },
  {
    Category:"Uganda",
    ID:"5007",
    Parent:"5002"
  },
  {
    Category:"Zambia",
    ID:"5671",
    Parent:"5002"
  },
  {
    Category:"Zimbabwe",
    ID:"5008",
    Parent:"5002"
  },
  {
    Category:"Harare",
    ID:"5009",
    Parent:"5008"
  },
  {
    Category:"Middle Africa",
    ID:"5010",
    Parent:"5001"
  },
  {
    Category:"Angola",
    ID:"5636",
    Parent:"5010"
  },
  {
    Category:"Cameroon",
    ID:"5635",
    Parent:"5010"
  },
  {
    Category:"Chad",
    ID:"5715",
    Parent:"5010"
  },
  {
    Category:"Congo (DR)",
    ID:"5011",
    Parent:"5010"
  },
  {
    Category:"Kinshasa",
    ID:"5012",
    Parent:"5011"
  },
  {
    Category:"Northern Africa",
    ID:"5013",
    Parent:"5001"
  },
  {
    Category:"Algeria",
    ID:"5014",
    Parent:"5013"
  },
  {
    Category:"Egypt",
    ID:"5015",
    Parent:"5013"
  },
  {
    Category:"Cairo",
    ID:"5016",
    Parent:"5015"
  },
  {
    Category:"Libya",
    ID:"5633",
    Parent:"5013"
  },
  {
    Category:"Morocco",
    ID:"5017",
    Parent:"5013"
  },
  {
    Category:"Sudan",
    ID:"5018",
    Parent:"5013"
  },
  {
    Category:"Tunisia",
    ID:"5019",
    Parent:"5013"
  },
  {
    Category:"Southern Africa",
    ID:"5020",
    Parent:"5001"
  },
  {
    Category:"Botswana",
    ID:"5713",
    Parent:"5020"
  },
  {
    Category:"South Africa",
    ID:"5021",
    Parent:"5020"
  },
  {
    Category:"Cape Town",
    ID:"5022",
    Parent:"5021"
  },
  {
    Category:"Johannesburg",
    ID:"5023",
    Parent:"5021"
  },
  {
    Category:"Western Africa",
    ID:"5024",
    Parent:"5001"
  },
  {
    Category:"Burkina Faso",
    ID:"5712",
    Parent:"5024"
  },
  {
    Category:"Côte d'Ivoire",
    ID:"5637",
    Parent:"5024"
  },
  {
    Category:"Ghana",
    ID:"5025",
    Parent:"5024"
  },
  {
    Category:"Mali",
    ID:"5711",
    Parent:"5024"
  },
  {
    Category:"Niger",
    ID:"5710",
    Parent:"5024"
  },
  {
    Category:"Nigeria",
    ID:"5026",
    Parent:"5024"
  },
  {
    Category:"Lagos",
    ID:"5027",
    Parent:"5026"
  },
  {
    Category:"Senegal",
    ID:"5653",
    Parent:"5024"
  },
  {
    Category:"Asia",
    ID:"5028",
    Parent:"5000"
  },
  {
    Category:"Central Asia",
    ID:"5029",
    Parent:"5028"
  },
  {
    Category:"Kazakhstan",
    ID:"5030",
    Parent:"5029"
  },
  {
    Category:"Kyrgyzstan",
    ID:"5574",
    Parent:"5029"
  },
  {
    Category:"Tajikistan",
    ID:"5579",
    Parent:"5029"
  },
  {
    Category:"Turkmenistan",
    ID:"5580",
    Parent:"5029"
  },
  {
    Category:"Uzbekistan",
    ID:"5031",
    Parent:"5029"
  },
  {
    Category:"East Asia",
    ID:"5032",
    Parent:"5028"
  },
  {
    Category:"China",
    ID:"5033",
    Parent:"5032"
  },
  {
    Category:"Eastern China",
    ID:"5364",
    Parent:"5033"
  },
  {
    Category:"Jiangsu",
    ID:"5392",
    Parent:"5364"
  },
  {
    Category:"Nanjing",
    ID:"5666",
    Parent:"5392"
  },
  {
    Category:"Shanghai",
    ID:"5040",
    Parent:"5364"
  },
  {
    Category:"Zhejiang",
    ID:"5393",
    Parent:"5364"
  },
  {
    Category:"Hangzhou",
    ID:"5039",
    Parent:"5393"
  },
  {
    Category:"North Central China",
    ID:"5367",
    Parent:"5033"
  },
  {
    Category:"Beijing",
    ID:"5034",
    Parent:"5367"
  },
  {
    Category:"Hebei",
    ID:"5401",
    Parent:"5367"
  },
  {
    Category:"Henan",
    ID:"5399",
    Parent:"5367"
  },
  {
    Category:"Inner Mongolia",
    ID:"5664",
    Parent:"5367"
  },
  {
    Category:"Shandong",
    ID:"5400",
    Parent:"5367"
  },
  {
    Category:"Shanxi",
    ID:"5660",
    Parent:"5367"
  },
  {
    Category:"Tianjin",
    ID:"5043",
    Parent:"5367"
  },
  {
    Category:"Northeast China",
    ID:"5363",
    Parent:"5033"
  },
  {
    Category:"Heilongjiang",
    ID:"5391",
    Parent:"5363"
  },
  {
    Category:"Harbin",
    ID:"5667",
    Parent:"5391"
  },
  {
    Category:"Jilin",
    ID:"5643",
    Parent:"5363"
  },
  {
    Category:"Changchun",
    ID:"5035",
    Parent:"5643"
  },
  {
    Category:"Liaoning",
    ID:"5390",
    Parent:"5363"
  },
  {
    Category:"Shenyang",
    ID:"5041",
    Parent:"5390"
  },
  {
    Category:"Northwest China",
    ID:"5368",
    Parent:"5033"
  },
  {
    Category:"Gansu",
    ID:"5661",
    Parent:"5368"
  },
  {
    Category:"Ningxia",
    ID:"5662",
    Parent:"5368"
  },
  {
    Category:"Qinghai",
    ID:"5663",
    Parent:"5368"
  },
  {
    Category:"Shaanxi",
    ID:"5402",
    Parent:"5368"
  },
  {
    Category:"Xi'an",
    ID:"5046",
    Parent:"5402"
  },
  {
    Category:"Xinjiang",
    ID:"5403",
    Parent:"5368"
  },
  {
    Category:"South Central China",
    ID:"5366",
    Parent:"5033"
  },
  {
    Category:"Anhui",
    ID:"5655",
    Parent:"5366"
  },
  {
    Category:"Chongqing",
    ID:"5036",
    Parent:"5366"
  },
  {
    Category:"Hubei",
    ID:"5397",
    Parent:"5366"
  },
  {
    Category:"Wuhan",
    ID:"5045",
    Parent:"5397"
  },
  {
    Category:"Hunan",
    ID:"5398",
    Parent:"5366"
  },
  {
    Category:"Jiangxi",
    ID:"5658",
    Parent:"5366"
  },
  {
    Category:"Sichuan",
    ID:"5396",
    Parent:"5366"
  },
  {
    Category:"Southeast China",
    ID:"5365",
    Parent:"5033"
  },
  {
    Category:"Fujian",
    ID:"5394",
    Parent:"5365"
  },
  {
    Category:"Guangdong",
    ID:"5395",
    Parent:"5365"
  },
  {
    Category:"Dongguan",
    ID:"5037",
    Parent:"5395"
  },
  {
    Category:"Guangzhou",
    ID:"5038",
    Parent:"5395"
  },
  {
    Category:"Shenzhen",
    ID:"5042",
    Parent:"5395"
  },
  {
    Category:"Hainan",
    ID:"5665",
    Parent:"5365"
  },
  {
    Category:"Southwest China",
    ID:"5369",
    Parent:"5033"
  },
  {
    Category:"Guangxi",
    ID:"5656",
    Parent:"5369"
  },
  {
    Category:"Guizhou",
    ID:"5659",
    Parent:"5369"
  },
  {
    Category:"Tibet",
    ID:"5044",
    Parent:"5369"
  },
  {
    Category:"Yunnan",
    ID:"5657",
    Parent:"5369"
  },
  {
    Category:"Hong Kong",
    ID:"5047",
    Parent:"5032"
  },
  {
    Category:"Japan",
    ID:"5048",
    Parent:"5032"
  },
  {
    Category:"Chubu",
    ID:"5382",
    Parent:"5048"
  },
  {
    Category:"Aichi",
    ID:"5723",
    Parent:"5382"
  },
  {
    Category:"Nagoya",
    ID:"5049",
    Parent:"5723"
  },
  {
    Category:"Fukui",
    ID:"5725",
    Parent:"5382"
  },
  {
    Category:"Gifu",
    ID:"5730",
    Parent:"5382"
  },
  {
    Category:"Ishikawa",
    ID:"5729",
    Parent:"5382"
  },
  {
    Category:"Nagano",
    ID:"5726",
    Parent:"5382"
  },
  {
    Category:"Niigata",
    ID:"5727",
    Parent:"5382"
  },
  {
    Category:"Shizuoka",
    ID:"5731",
    Parent:"5382"
  },
  {
    Category:"Toyama",
    ID:"5724",
    Parent:"5382"
  },
  {
    Category:"Yamanashi",
    ID:"5728",
    Parent:"5382"
  },
  {
    Category:"Chugoku",
    ID:"5385",
    Parent:"5048"
  },
  {
    Category:"Hiroshima",
    ID:"5735",
    Parent:"5385"
  },
  {
    Category:"Okayama",
    ID:"5736",
    Parent:"5385"
  },
  {
    Category:"Shimane",
    ID:"5734",
    Parent:"5385"
  },
  {
    Category:"Tottori",
    ID:"5732",
    Parent:"5385"
  },
  {
    Category:"Yamaguchi",
    ID:"5733",
    Parent:"5385"
  },
  {
    Category:"Hokkaido",
    ID:"5381",
    Parent:"5048"
  },
  {
    Category:"Sapporo",
    ID:"5051",
    Parent:"5381"
  },
  {
    Category:"Kansai",
    ID:"5383",
    Parent:"5048"
  },
  {
    Category:"Hyogo",
    ID:"5737",
    Parent:"5383"
  },
  {
    Category:"Kobe",
    ID:"5406",
    Parent:"5737"
  },
  {
    Category:"Kyoto",
    ID:"5407",
    Parent:"5383"
  },
  {
    Category:"Mie",
    ID:"5741",
    Parent:"5383"
  },
  {
    Category:"Nara",
    ID:"5739",
    Parent:"5383"
  },
  {
    Category:"Osaka",
    ID:"5050",
    Parent:"5383"
  },
  {
    Category:"Shiga",
    ID:"5738",
    Parent:"5383"
  },
  {
    Category:"Wakayama",
    ID:"5740",
    Parent:"5383"
  },
  {
    Category:"Kanto",
    ID:"5377",
    Parent:"5048"
  },
  {
    Category:"Chiba",
    ID:"5742",
    Parent:"5377"
  },
  {
    Category:"Gunma",
    ID:"5745",
    Parent:"5377"
  },
  {
    Category:"Ibaraki",
    ID:"5746",
    Parent:"5377"
  },
  {
    Category:"Kanagawa",
    ID:"5744",
    Parent:"5377"
  },
  {
    Category:"Kawasaki",
    ID:"5764",
    Parent:"5744"
  },
  {
    Category:"Yokohama",
    ID:"5404",
    Parent:"5744"
  },
  {
    Category:"Saitama",
    ID:"5743",
    Parent:"5377"
  },
  {
    Category:"Tochigi",
    ID:"5747",
    Parent:"5377"
  },
  {
    Category:"Tokyo",
    ID:"5052",
    Parent:"5377"
  },
  {
    Category:"Kyushu",
    ID:"5380",
    Parent:"5048"
  },
  {
    Category:"Fukuoka",
    ID:"5405",
    Parent:"5380"
  },
  {
    Category:"Kagoshima",
    ID:"5752",
    Parent:"5380"
  },
  {
    Category:"Kumamoto",
    ID:"5753",
    Parent:"5380"
  },
  {
    Category:"Miyazaki",
    ID:"5751",
    Parent:"5380"
  },
  {
    Category:"Nagasaki",
    ID:"5749",
    Parent:"5380"
  },
  {
    Category:"Oita",
    ID:"5750",
    Parent:"5380"
  },
  {
    Category:"Saga",
    ID:"5748",
    Parent:"5380"
  },
  {
    Category:"Okinawa",
    ID:"5379",
    Parent:"5048"
  },
  {
    Category:"Shikoku",
    ID:"5384",
    Parent:"5048"
  },
  {
    Category:"Ehime",
    ID:"5755",
    Parent:"5384"
  },
  {
    Category:"Kagawa",
    ID:"5754",
    Parent:"5384"
  },
  {
    Category:"Kochi",
    ID:"5757",
    Parent:"5384"
  },
  {
    Category:"Tokushima",
    ID:"5756",
    Parent:"5384"
  },
  {
    Category:"Tohoku",
    ID:"5378",
    Parent:"5048"
  },
  {
    Category:"Akita",
    ID:"5759",
    Parent:"5378"
  },
  {
    Category:"Aomori",
    ID:"5758",
    Parent:"5378"
  },
  {
    Category:"Fukushima",
    ID:"5763",
    Parent:"5378"
  },
  {
    Category:"Iwate",
    ID:"5760",
    Parent:"5378"
  },
  {
    Category:"Miyagi",
    ID:"5762",
    Parent:"5378"
  },
  {
    Category:"Sendai",
    ID:"5765",
    Parent:"5762"
  },
  {
    Category:"Yamagata",
    ID:"5761",
    Parent:"5378"
  },
  {
    Category:"Macau",
    ID:"5355",
    Parent:"5032"
  },
  {
    Category:"Mongolia",
    ID:"5577",
    Parent:"5032"
  },
  {
    Category:"North Korea",
    ID:"5053",
    Parent:"5032"
  },
  {
    Category:"South Korea",
    ID:"5054",
    Parent:"5032"
  },
  {
    Category:"Gangwon",
    ID:"5672",
    Parent:"5054"
  },
  {
    Category:"Gyeonggi",
    ID:"5375",
    Parent:"5054"
  },
  {
    Category:"Incheon",
    ID:"5370",
    Parent:"5375"
  },
  {
    Category:"Jeju",
    ID:"5371",
    Parent:"5054"
  },
  {
    Category:"North Chungcheong",
    ID:"5678",
    Parent:"5054"
  },
  {
    Category:"North Gyeongsang",
    ID:"5674",
    Parent:"5054"
  },
  {
    Category:"Daegu",
    ID:"5055",
    Parent:"5674"
  },
  {
    Category:"North Jeolla",
    ID:"5676",
    Parent:"5054"
  },
  {
    Category:"Seoul",
    ID:"5057",
    Parent:"5054"
  },
  {
    Category:"South Chungcheong",
    ID:"5677",
    Parent:"5054"
  },
  {
    Category:"Daejeon",
    ID:"5374",
    Parent:"5677"
  },
  {
    Category:"South Gyeongsang",
    ID:"5673",
    Parent:"5054"
  },
  {
    Category:"Busan",
    ID:"5372",
    Parent:"5673"
  },
  {
    Category:"Ulsan",
    ID:"5376",
    Parent:"5673"
  },
  {
    Category:"South Jeolla",
    ID:"5675",
    Parent:"5054"
  },
  {
    Category:"Gwangju",
    ID:"5373",
    Parent:"5675"
  },
  {
    Category:"Taiwan",
    ID:"5058",
    Parent:"5032"
  },
  {
    Category:"Hsinchu",
    ID:"5389",
    Parent:"5058"
  },
  {
    Category:"Kaohsiung",
    ID:"5386",
    Parent:"5058"
  },
  {
    Category:"Taichung",
    ID:"5388",
    Parent:"5058"
  },
  {
    Category:"Tainan",
    ID:"5387",
    Parent:"5058"
  },
  {
    Category:"Taipei",
    ID:"5059",
    Parent:"5058"
  },
  {
    Category:"Russia & CIS",
    ID:"5593",
    Parent:"5028"
  },
  {
    Category:"Caucasus",
    ID:"5408",
    Parent:"5593"
  },
  {
    Category:"Armenia",
    ID:"5537",
    Parent:"5408"
  },
  {
    Category:"Azerbaijan",
    ID:"5538",
    Parent:"5408"
  },
  {
    Category:"Georgia",
    ID:"5539",
    Parent:"5408"
  },
  {
    Category:"Russian Federation",
    ID:"5120",
    Parent:"5593"
  },
  {
    Category:"Far Eastern Russia",
    ID:"5606",
    Parent:"5120"
  },
  {
    Category:"North Caucasian District",
    ID:"5766",
    Parent:"5120"
  },
  {
    Category:"Northwestern Russia",
    ID:"5594",
    Parent:"5120"
  },
  {
    Category:"Saint Petersburg",
    ID:"5122",
    Parent:"5594"
  },
  {
    Category:"Russian Central District",
    ID:"5595",
    Parent:"5120"
  },
  {
    Category:"Moscow",
    ID:"5121",
    Parent:"5595"
  },
  {
    Category:"Russian Southern District",
    ID:"5603",
    Parent:"5120"
  },
  {
    Category:"Siberian Federal District",
    ID:"5605",
    Parent:"5120"
  },
  {
    Category:"Urals District",
    ID:"5607",
    Parent:"5120"
  },
  {
    Category:"Volga District",
    ID:"5604",
    Parent:"5120"
  },
  {
    Category:"South Asia",
    ID:"5074",
    Parent:"5028"
  },
  {
    Category:"Afghanistan",
    ID:"5075",
    Parent:"5074"
  },
  {
    Category:"Bangladesh",
    ID:"5076",
    Parent:"5074"
  },
  {
    Category:"Bhutan",
    ID:"5553",
    Parent:"5074"
  },
  {
    Category:"India",
    ID:"5077",
    Parent:"5074"
  },
  {
    Category:"East India",
    ID:"5515",
    Parent:"5077"
  },
  {
    Category:"Bihar",
    ID:"5650",
    Parent:"5515"
  },
  {
    Category:"Chhattisgarh",
    ID:"5775",
    Parent:"5515"
  },
  {
    Category:"Orissa",
    ID:"5654",
    Parent:"5515"
  },
  {
    Category:"West Bengal",
    ID:"5649",
    Parent:"5515"
  },
  {
    Category:"Kolkata",
    ID:"5082",
    Parent:"5649"
  },
  {
    Category:"North India",
    ID:"5519",
    Parent:"5077"
  },
  {
    Category:"Delhi",
    ID:"5080",
    Parent:"5519"
  },
  {
    Category:"Madhya Pradesh",
    ID:"5652",
    Parent:"5519"
  },
  {
    Category:"Punjab (India)",
    ID:"5776",
    Parent:"5519"
  },
  {
    Category:"Uttar Pradesh",
    ID:"5644",
    Parent:"5519"
  },
  {
    Category:"Agra",
    ID:"5520",
    Parent:"5644"
  },
  {
    Category:"Northeast India",
    ID:"5514",
    Parent:"5077"
  },
  {
    Category:"South India",
    ID:"5516",
    Parent:"5077"
  },
  {
    Category:"Andhra Pradesh",
    ID:"5648",
    Parent:"5516"
  },
  {
    Category:"Hyderabad",
    ID:"5081",
    Parent:"5648"
  },
  {
    Category:"Karnataka",
    ID:"5640",
    Parent:"5516"
  },
  {
    Category:"Bangalore",
    ID:"5078",
    Parent:"5640"
  },
  {
    Category:"Kerala",
    ID:"5651",
    Parent:"5516"
  },
  {
    Category:"Tamil Nadu",
    ID:"5639",
    Parent:"5516"
  },
  {
    Category:"Chennai",
    ID:"5079",
    Parent:"5639"
  },
  {
    Category:"West India",
    ID:"5517",
    Parent:"5077"
  },
  {
    Category:"Goa",
    ID:"5518",
    Parent:"5517"
  },
  {
    Category:"Gujarat",
    ID:"5647",
    Parent:"5517"
  },
  {
    Category:"Maharashtra",
    ID:"5645",
    Parent:"5517"
  },
  {
    Category:"Mumbai",
    ID:"5083",
    Parent:"5645"
  },
  {
    Category:"Rajasthan",
    ID:"5646",
    Parent:"5517"
  },
  {
    Category:"Jaipur",
    ID:"5521",
    Parent:"5646"
  },
  {
    Category:"Indian Ocean Islands",
    ID:"5620",
    Parent:"5074"
  },
  {
    Category:"Maldives",
    ID:"5576",
    Parent:"5620"
  },
  {
    Category:"Réunion",
    ID:"5702",
    Parent:"5620"
  },
  {
    Category:"Nepal",
    ID:"5085",
    Parent:"5074"
  },
  {
    Category:"Pakistan",
    ID:"5086",
    Parent:"5074"
  },
  {
    Category:"Karachi",
    ID:"5087",
    Parent:"5086"
  },
  {
    Category:"Lahore",
    ID:"5088",
    Parent:"5086"
  },
  {
    Category:"Sri Lanka",
    ID:"5089",
    Parent:"5074"
  },
  {
    Category:"Southeast Asia",
    ID:"5060",
    Parent:"5028"
  },
  {
    Category:"Brunei",
    ID:"5554",
    Parent:"5060"
  },
  {
    Category:"Cambodia",
    ID:"5555",
    Parent:"5060"
  },
  {
    Category:"East Timor",
    ID:"5557",
    Parent:"5060"
  },
  {
    Category:"Indonesia",
    ID:"5061",
    Parent:"5060"
  },
  {
    Category:"Java (Indonesia)",
    ID:"5703",
    Parent:"5061"
  },
  {
    Category:"Jakarta",
    ID:"5062",
    Parent:"5703"
  },
  {
    Category:"Kalimantan",
    ID:"5704",
    Parent:"5061"
  },
  {
    Category:"Maluku Islands",
    ID:"5705",
    Parent:"5061"
  },
  {
    Category:"Nusa Tenggara",
    ID:"5706",
    Parent:"5061"
  },
  {
    Category:"Bali",
    ID:"5361",
    Parent:"5706"
  },
  {
    Category:"Sulawesi",
    ID:"5707",
    Parent:"5061"
  },
  {
    Category:"Sumatra",
    ID:"5708",
    Parent:"5061"
  },
  {
    Category:"Western New Guinea",
    ID:"5709",
    Parent:"5061"
  },
  {
    Category:"Laos",
    ID:"5575",
    Parent:"5060"
  },
  {
    Category:"Malaysia",
    ID:"5063",
    Parent:"5060"
  },
  {
    Category:"Kuala Lumpur",
    ID:"5064",
    Parent:"5063"
  },
  {
    Category:"Myanmar",
    ID:"5065",
    Parent:"5060"
  },
  {
    Category:"Philippines",
    ID:"5066",
    Parent:"5060"
  },
  {
    Category:"Cebu",
    ID:"5668",
    Parent:"5066"
  },
  {
    Category:"Manila",
    ID:"5067",
    Parent:"5066"
  },
  {
    Category:"Singapore",
    ID:"5068",
    Parent:"5060"
  },
  {
    Category:"Thailand",
    ID:"5069",
    Parent:"5060"
  },
  {
    Category:"Bangkok",
    ID:"5070",
    Parent:"5069"
  },
  {
    Category:"Chiang Mai",
    ID:"5810",
    Parent:"5069"
  },
  {
    Category:"Pattaya",
    ID:"5812",
    Parent:"5069"
  },
  {
    Category:"Southern Thailand",
    ID:"5811",
    Parent:"5069"
  },
  {
    Category:"Phuket",
    ID:"5362",
    Parent:"5811"
  },
  {
    Category:"Viet Nam",
    ID:"5071",
    Parent:"5060"
  },
  {
    Category:"Hanoi",
    ID:"5072",
    Parent:"5071"
  },
  {
    Category:"Ho Chi Minh City",
    ID:"5073",
    Parent:"5071"
  },
  {
    Category:"West Asia",
    ID:"5090",
    Parent:"5028"
  },
  {
    Category:"Bahrain",
    ID:"5552",
    Parent:"5090"
  },
  {
    Category:"Iran",
    ID:"5084",
    Parent:"5090"
  },
  {
    Category:"Iraq",
    ID:"5092",
    Parent:"5090"
  },
  {
    Category:"Israel",
    ID:"5093",
    Parent:"5090"
  },
  {
    Category:"Jerusalem",
    ID:"5094",
    Parent:"5093"
  },
  {
    Category:"Palestinian Territories",
    ID:"5592",
    Parent:"5093"
  },
  {
    Category:"Tel Aviv",
    ID:"5095",
    Parent:"5093"
  },
  {
    Category:"Jordan",
    ID:"5096",
    Parent:"5090"
  },
  {
    Category:"Kuwait",
    ID:"5558",
    Parent:"5090"
  },
  {
    Category:"Lebanon",
    ID:"5097",
    Parent:"5090"
  },
  {
    Category:"Oman",
    ID:"5578",
    Parent:"5090"
  },
  {
    Category:"Qatar",
    ID:"5590",
    Parent:"5090"
  },
  {
    Category:"Saudi Arabia",
    ID:"5098",
    Parent:"5090"
  },
  {
    Category:"Syria",
    ID:"5099",
    Parent:"5090"
  },
  {
    Category:"Turkey",
    ID:"5100",
    Parent:"5090"
  },
  {
    Category:"Aegean Turkey",
    ID:"5834",
    Parent:"5100"
  },
  {
    Category:"Izmir",
    ID:"5842",
    Parent:"5834"
  },
  {
    Category:"Muğla",
    ID:"5845",
    Parent:"5834"
  },
  {
    Category:"Bodrum",
    ID:"5849",
    Parent:"5845"
  },
  {
    Category:"Pamukkale",
    ID:"5846",
    Parent:"5834"
  },
  {
    Category:"Black Sea Turkey",
    ID:"5835",
    Parent:"5100"
  },
  {
    Category:"Central Anatolia",
    ID:"5836",
    Parent:"5100"
  },
  {
    Category:"Ankara",
    ID:"5101",
    Parent:"5836"
  },
  {
    Category:"Cappadocia",
    ID:"5844",
    Parent:"5836"
  },
  {
    Category:"Konya",
    ID:"5847",
    Parent:"5836"
  },
  {
    Category:"Eastern Anatolia",
    ID:"5837",
    Parent:"5100"
  },
  {
    Category:"Marmara Region",
    ID:"5838",
    Parent:"5100"
  },
  {
    Category:"Bursa",
    ID:"5841",
    Parent:"5838"
  },
  {
    Category:"Istanbul",
    ID:"5102",
    Parent:"5838"
  },
  {
    Category:"Mediterranean Turkey",
    ID:"5839",
    Parent:"5100"
  },
  {
    Category:"Adana",
    ID:"5848",
    Parent:"5839"
  },
  {
    Category:"Antalya",
    ID:"5843",
    Parent:"5839"
  },
  {
    Category:"Mersin",
    ID:"5850",
    Parent:"5839"
  },
  {
    Category:"Southeastern Anatolia",
    ID:"5840",
    Parent:"5100"
  },
  {
    Category:"United Arab Emirates",
    ID:"5103",
    Parent:"5090"
  },
  {
    Category:"Yemen",
    ID:"5581",
    Parent:"5090"
  },
  {
    Category:"Europe",
    ID:"5104",
    Parent:"5000"
  },
  {
    Category:"Central & Eastern Europe",
    ID:"5565",
    Parent:"5104"
  },
  {
    Category:"Austria",
    ID:"5178",
    Parent:"5565"
  },
  {
    Category:"Vienna",
    ID:"5179",
    Parent:"5178"
  },
  {
    Category:"Baltics",
    ID:"5556",
    Parent:"5565"
  },
  {
    Category:"Estonia",
    ID:"5128",
    Parent:"5556"
  },
  {
    Category:"Latvia",
    ID:"5134",
    Parent:"5556"
  },
  {
    Category:"Lithuania",
    ID:"5135",
    Parent:"5556"
  },
  {
    Category:"Czech Republic",
    ID:"5108",
    Parent:"5565"
  },
  {
    Category:"Prague",
    ID:"5109",
    Parent:"5108"
  },
  {
    Category:"Eastern Europe",
    ID:"5105",
    Parent:"5565"
  },
  {
    Category:"Belarus",
    ID:"5106",
    Parent:"5105"
  },
  {
    Category:"Moldova",
    ID:"5585",
    Parent:"5105"
  },
  {
    Category:"Ukraine",
    ID:"5124",
    Parent:"5105"
  },
  {
    Category:"Crimea",
    ID:"5628",
    Parent:"5124"
  },
  {
    Category:"Kiev",
    ID:"5619",
    Parent:"5124"
  },
  {
    Category:"Germany",
    ID:"5188",
    Parent:"5565"
  },
  {
    Category:"Baden-Wuerttemberg",
    ID:"5490",
    Parent:"5188"
  },
  {
    Category:"Bavaria",
    ID:"5491",
    Parent:"5188"
  },
  {
    Category:"Munich",
    ID:"5195",
    Parent:"5491"
  },
  {
    Category:"Berlin",
    ID:"5189",
    Parent:"5188"
  },
  {
    Category:"Brandenburg",
    ID:"5494",
    Parent:"5188"
  },
  {
    Category:"Bremen",
    ID:"5495",
    Parent:"5188"
  },
  {
    Category:"Hamburg",
    ID:"5194",
    Parent:"5188"
  },
  {
    Category:"Hesse",
    ID:"5493",
    Parent:"5188"
  },
  {
    Category:"Frankfurt",
    ID:"5193",
    Parent:"5493"
  },
  {
    Category:"Lower Saxony",
    ID:"5492",
    Parent:"5188"
  },
  {
    Category:"Mecklenburg-Vorpommern",
    ID:"5496",
    Parent:"5188"
  },
  {
    Category:"North Rhine-Westphalia",
    ID:"5489",
    Parent:"5188"
  },
  {
    Category:"Cologne",
    ID:"5190",
    Parent:"5489"
  },
  {
    Category:"Duesseldorf",
    ID:"5191",
    Parent:"5489"
  },
  {
    Category:"Essen (Ruhr Area)",
    ID:"5192",
    Parent:"5489"
  },
  {
    Category:"Rhineland-Palatinate",
    ID:"5497",
    Parent:"5188"
  },
  {
    Category:"Saarland",
    ID:"5498",
    Parent:"5188"
  },
  {
    Category:"Saxony",
    ID:"5499",
    Parent:"5188"
  },
  {
    Category:"Saxony-Anhalt",
    ID:"5500",
    Parent:"5188"
  },
  {
    Category:"Schleswig-Holstein",
    ID:"5501",
    Parent:"5188"
  },
  {
    Category:"Thuringia",
    ID:"5502",
    Parent:"5188"
  },
  {
    Category:"Hungary",
    ID:"5110",
    Parent:"5565"
  },
  {
    Category:"Budapest",
    ID:"5111",
    Parent:"5110"
  },
  {
    Category:"Liechtenstein",
    ID:"5566",
    Parent:"5565"
  },
  {
    Category:"Poland",
    ID:"5112",
    Parent:"5565"
  },
  {
    Category:"Katowice (Upper Silesian)",
    ID:"5113",
    Parent:"5112"
  },
  {
    Category:"Krakow",
    ID:"5114",
    Parent:"5112"
  },
  {
    Category:"Warsaw",
    ID:"5115",
    Parent:"5112"
  },
  {
    Category:"Wroclaw",
    ID:"5116",
    Parent:"5112"
  },
  {
    Category:"Łódź",
    ID:"5117",
    Parent:"5112"
  },
  {
    Category:"Slovakia",
    ID:"5123",
    Parent:"5565"
  },
  {
    Category:"Slovenia",
    ID:"5170",
    Parent:"5565"
  },
  {
    Category:"Switzerland",
    ID:"5200",
    Parent:"5565"
  },
  {
    Category:"Geneva",
    ID:"5201",
    Parent:"5200"
  },
  {
    Category:"Zurich",
    ID:"5202",
    Parent:"5200"
  },
  {
    Category:"Mediterranean Europe",
    ID:"5150",
    Parent:"5104"
  },
  {
    Category:"Cyprus",
    ID:"5091",
    Parent:"5150"
  },
  {
    Category:"Italy",
    ID:"5155",
    Parent:"5150"
  },
  {
    Category:"Abruzzo",
    ID:"5626",
    Parent:"5155"
  },
  {
    Category:"Aosta Valley",
    ID:"5722",
    Parent:"5155"
  },
  {
    Category:"Basilicata",
    ID:"5720",
    Parent:"5155"
  },
  {
    Category:"Calabria",
    ID:"5513",
    Parent:"5155"
  },
  {
    Category:"Campania",
    ID:"5504",
    Parent:"5155"
  },
  {
    Category:"Naples",
    ID:"5160",
    Parent:"5504"
  },
  {
    Category:"Salerno & Amalfi Coast",
    ID:"5771",
    Parent:"5504"
  },
  {
    Category:"Emilia-Romagna",
    ID:"5508",
    Parent:"5155"
  },
  {
    Category:"Friuli-Venezia Giulia",
    ID:"5717",
    Parent:"5155"
  },
  {
    Category:"Lazio",
    ID:"5505",
    Parent:"5155"
  },
  {
    Category:"Rome",
    ID:"5162",
    Parent:"5505"
  },
  {
    Category:"Liguria",
    ID:"5511",
    Parent:"5155"
  },
  {
    Category:"Genoa",
    ID:"5158",
    Parent:"5511"
  },
  {
    Category:"Lombardy",
    ID:"5503",
    Parent:"5155"
  },
  {
    Category:"Milan",
    ID:"5159",
    Parent:"5503"
  },
  {
    Category:"Marche",
    ID:"5716",
    Parent:"5155"
  },
  {
    Category:"Molise",
    ID:"5721",
    Parent:"5155"
  },
  {
    Category:"Piedmont",
    ID:"5507",
    Parent:"5155"
  },
  {
    Category:"Turin",
    ID:"5164",
    Parent:"5507"
  },
  {
    Category:"Puglia",
    ID:"5509",
    Parent:"5155"
  },
  {
    Category:"Bari",
    ID:"5156",
    Parent:"5509"
  },
  {
    Category:"Sardinia",
    ID:"5512",
    Parent:"5155"
  },
  {
    Category:"Sicily",
    ID:"5163",
    Parent:"5155"
  },
  {
    Category:"Palermo",
    ID:"5161",
    Parent:"5163"
  },
  {
    Category:"Trentino-Alto Adige",
    ID:"5718",
    Parent:"5155"
  },
  {
    Category:"Tuscany",
    ID:"5510",
    Parent:"5155"
  },
  {
    Category:"Florence",
    ID:"5157",
    Parent:"5510"
  },
  {
    Category:"Umbria",
    ID:"5719",
    Parent:"5155"
  },
  {
    Category:"Veneto",
    ID:"5506",
    Parent:"5155"
  },
  {
    Category:"Venice",
    ID:"5165",
    Parent:"5506"
  },
  {
    Category:"Malta",
    ID:"5166",
    Parent:"5150"
  },
  {
    Category:"Monaco",
    ID:"5586",
    Parent:"5150"
  },
  {
    Category:"Portugal",
    ID:"5167",
    Parent:"5150"
  },
  {
    Category:"Azores & Madeira",
    ID:"5773",
    Parent:"5167"
  },
  {
    Category:"Lisbon",
    ID:"5168",
    Parent:"5167"
  },
  {
    Category:"Porto",
    ID:"5772",
    Parent:"5167"
  },
  {
    Category:"San Marino",
    ID:"5587",
    Parent:"5150"
  },
  {
    Category:"Spain",
    ID:"5171",
    Parent:"5150"
  },
  {
    Category:"Andalucia",
    ID:"5476",
    Parent:"5171"
  },
  {
    Category:"Cádiz",
    ID:"5616",
    Parent:"5476"
  },
  {
    Category:"Málaga",
    ID:"5174",
    Parent:"5476"
  },
  {
    Category:"Seville",
    ID:"5175",
    Parent:"5476"
  },
  {
    Category:"Aragon",
    ID:"5485",
    Parent:"5171"
  },
  {
    Category:"Asturias",
    ID:"5487",
    Parent:"5171"
  },
  {
    Category:"Balearic Islands",
    ID:"5488",
    Parent:"5171"
  },
  {
    Category:"Basque Country",
    ID:"5481",
    Parent:"5171"
  },
  {
    Category:"Canary Islands",
    ID:"5482",
    Parent:"5171"
  },
  {
    Category:"Cantabria",
    ID:"5770",
    Parent:"5171"
  },
  {
    Category:"Castile and León",
    ID:"5480",
    Parent:"5171"
  },
  {
    Category:"Castile-La Mancha",
    ID:"5483",
    Parent:"5171"
  },
  {
    Category:"Catalonia",
    ID:"5477",
    Parent:"5171"
  },
  {
    Category:"Barcelona",
    ID:"5172",
    Parent:"5477"
  },
  {
    Category:"Extremadura",
    ID:"5486",
    Parent:"5171"
  },
  {
    Category:"Galicia",
    ID:"5479",
    Parent:"5171"
  },
  {
    Category:"Madrid",
    ID:"5173",
    Parent:"5171"
  },
  {
    Category:"Murcia",
    ID:"5484",
    Parent:"5171"
  },
  {
    Category:"Valencian Community",
    ID:"5478",
    Parent:"5171"
  },
  {
    Category:"Valencia",
    ID:"5176",
    Parent:"5478"
  },
  {
    Category:"Vatican City",
    ID:"5769",
    Parent:"5150"
  },
  {
    Category:"Nordic Countries",
    ID:"5125",
    Parent:"5104"
  },
  {
    Category:"Denmark",
    ID:"5126",
    Parent:"5125"
  },
  {
    Category:"Copenhagen",
    ID:"5127",
    Parent:"5126"
  },
  {
    Category:"Finland",
    ID:"5129",
    Parent:"5125"
  },
  {
    Category:"Helsinki",
    ID:"5130",
    Parent:"5129"
  },
  {
    Category:"Greenland",
    ID:"5679",
    Parent:"5125"
  },
  {
    Category:"Iceland",
    ID:"5131",
    Parent:"5125"
  },
  {
    Category:"Norway",
    ID:"5136",
    Parent:"5125"
  },
  {
    Category:"Oslo",
    ID:"5137",
    Parent:"5136"
  },
  {
    Category:"Sweden",
    ID:"5138",
    Parent:"5125"
  },
  {
    Category:"Stockholm",
    ID:"5139",
    Parent:"5138"
  },
  {
    Category:"Southeastern Europe",
    ID:"5567",
    Parent:"5104"
  },
  {
    Category:"Albania",
    ID:"5582",
    Parent:"5567"
  },
  {
    Category:"Bosnia and Herzegovina",
    ID:"5151",
    Parent:"5567"
  },
  {
    Category:"Bulgaria",
    ID:"5107",
    Parent:"5567"
  },
  {
    Category:"Croatia",
    ID:"5152",
    Parent:"5567"
  },
  {
    Category:"Greece",
    ID:"5153",
    Parent:"5567"
  },
  {
    Category:"Aegean Islands",
    ID:"5831",
    Parent:"5153"
  },
  {
    Category:"Athens",
    ID:"5154",
    Parent:"5153"
  },
  {
    Category:"Crete",
    ID:"5825",
    Parent:"5153"
  },
  {
    Category:"Kosovo",
    ID:"5767",
    Parent:"5567"
  },
  {
    Category:"Montenegro",
    ID:"5768",
    Parent:"5567"
  },
  {
    Category:"Republic of Macedonia",
    ID:"5584",
    Parent:"5567"
  },
  {
    Category:"Romania",
    ID:"5118",
    Parent:"5567"
  },
  {
    Category:"Bucharest",
    ID:"5119",
    Parent:"5118"
  },
  {
    Category:"Serbia",
    ID:"5169",
    Parent:"5567"
  },
  {
    Category:"Western Europe",
    ID:"5177",
    Parent:"5104"
  },
  {
    Category:"Andorra",
    ID:"5583",
    Parent:"5177"
  },
  {
    Category:"Benelux",
    ID:"5534",
    Parent:"5177"
  },
  {
    Category:"Belgium",
    ID:"5180",
    Parent:"5534"
  },
  {
    Category:"Brussels",
    ID:"5181",
    Parent:"5180"
  },
  {
    Category:"Luxembourg",
    ID:"5196",
    Parent:"5534"
  },
  {
    Category:"Netherlands",
    ID:"5197",
    Parent:"5534"
  },
  {
    Category:"Amsterdam",
    ID:"5198",
    Parent:"5197"
  },
  {
    Category:"Rotterdam",
    ID:"5199",
    Parent:"5197"
  },
  {
    Category:"France",
    ID:"5182",
    Parent:"5177"
  },
  {
    Category:"Central France",
    ID:"5533",
    Parent:"5182"
  },
  {
    Category:"Auvergne",
    ID:"5680",
    Parent:"5533"
  },
  {
    Category:"Centre",
    ID:"5681",
    Parent:"5533"
  },
  {
    Category:"Limousin",
    ID:"5682",
    Parent:"5533"
  },
  {
    Category:"East France",
    ID:"5531",
    Parent:"5182"
  },
  {
    Category:"Alsace",
    ID:"5683",
    Parent:"5531"
  },
  {
    Category:"Strasbourg",
    ID:"5610",
    Parent:"5683"
  },
  {
    Category:"Burgundy",
    ID:"5684",
    Parent:"5531"
  },
  {
    Category:"Champagne-Ardenne",
    ID:"5685",
    Parent:"5531"
  },
  {
    Category:"Franche-Comté",
    ID:"5686",
    Parent:"5531"
  },
  {
    Category:"Lorraine",
    ID:"5687",
    Parent:"5531"
  },
  {
    Category:"French Overseas (DOM-TOM)",
    ID:"5608",
    Parent:"5182"
  },
  {
    Category:"North France",
    ID:"5532",
    Parent:"5182"
  },
  {
    Category:"Lower Normandy",
    ID:"5688",
    Parent:"5532"
  },
  {
    Category:"Nord-Pas-de-Calais",
    ID:"5690",
    Parent:"5532"
  },
  {
    Category:"Lille",
    ID:"5611",
    Parent:"5690"
  },
  {
    Category:"Picardy",
    ID:"5691",
    Parent:"5532"
  },
  {
    Category:"Upper Normandy",
    ID:"5689",
    Parent:"5532"
  },
  {
    Category:"South East France",
    ID:"5528",
    Parent:"5182"
  },
  {
    Category:"Corsica",
    ID:"5617",
    Parent:"5528"
  },
  {
    Category:"Provence-Alpes-Côte d'Azur",
    ID:"5692",
    Parent:"5528"
  },
  {
    Category:"Marseille",
    ID:"5184",
    Parent:"5692"
  },
  {
    Category:"Nice",
    ID:"5185",
    Parent:"5692"
  },
  {
    Category:"Rhône-Alpes",
    ID:"5693",
    Parent:"5528"
  },
  {
    Category:"Lyon",
    ID:"5183",
    Parent:"5693"
  },
  {
    Category:"South West France",
    ID:"5527",
    Parent:"5182"
  },
  {
    Category:"Aquitaine",
    ID:"5694",
    Parent:"5527"
  },
  {
    Category:"Bordeaux",
    ID:"5613",
    Parent:"5694"
  },
  {
    Category:"Languedoc-Roussillon",
    ID:"5695",
    Parent:"5527"
  },
  {
    Category:"Montpellier",
    ID:"5612",
    Parent:"5695"
  },
  {
    Category:"Midi-Pyrénées",
    ID:"5696",
    Parent:"5527"
  },
  {
    Category:"Toulouse",
    ID:"5187",
    Parent:"5696"
  },
  {
    Category:"West France",
    ID:"5530",
    Parent:"5182"
  },
  {
    Category:"Brittany",
    ID:"5697",
    Parent:"5530"
  },
  {
    Category:"Rennes",
    ID:"5614",
    Parent:"5697"
  },
  {
    Category:"Pays de la Loire",
    ID:"5698",
    Parent:"5530"
  },
  {
    Category:"Nantes",
    ID:"5609",
    Parent:"5698"
  },
  {
    Category:"Poitou-Charentes",
    ID:"5699",
    Parent:"5530"
  },
  {
    Category:"Île-de-France",
    ID:"5529",
    Parent:"5182"
  },
  {
    Category:"Paris",
    ID:"5186",
    Parent:"5529"
  },
  {
    Category:"Ireland",
    ID:"5132",
    Parent:"5177"
  },
  {
    Category:"Dublin",
    ID:"5133",
    Parent:"5132"
  },
  {
    Category:"United Kingdom",
    ID:"5140",
    Parent:"5177"
  },
  {
    Category:"England",
    ID:"5440",
    Parent:"5140"
  },
  {
    Category:"East Midlands",
    ID:"5447",
    Parent:"5440"
  },
  {
    Category:"East of England",
    ID:"5446",
    Parent:"5440"
  },
  {
    Category:"London (UK)",
    ID:"5147",
    Parent:"5440"
  },
  {
    Category:"North East England",
    ID:"5451",
    Parent:"5440"
  },
  {
    Category:"North West England",
    ID:"5450",
    Parent:"5440"
  },
  {
    Category:"Liverpool",
    ID:"5146",
    Parent:"5450"
  },
  {
    Category:"Manchester",
    ID:"5148",
    Parent:"5450"
  },
  {
    Category:"South East England",
    ID:"5444",
    Parent:"5440"
  },
  {
    Category:"South West England",
    ID:"5445",
    Parent:"5440"
  },
  {
    Category:"Bristol",
    ID:"5142",
    Parent:"5445"
  },
  {
    Category:"West Midlands",
    ID:"5448",
    Parent:"5440"
  },
  {
    Category:"Birmingham (UK)",
    ID:"5141",
    Parent:"5448"
  },
  {
    Category:"Yorkshire",
    ID:"5449",
    Parent:"5440"
  },
  {
    Category:"Leeds-Bradford",
    ID:"5145",
    Parent:"5449"
  },
  {
    Category:"Sheffield",
    ID:"5149",
    Parent:"5449"
  },
  {
    Category:"Northern Ireland",
    ID:"5443",
    Parent:"5140"
  },
  {
    Category:"Scotland",
    ID:"5441",
    Parent:"5140"
  },
  {
    Category:"Edinburgh",
    ID:"5143",
    Parent:"5441"
  },
  {
    Category:"Glasgow",
    ID:"5144",
    Parent:"5441"
  },
  {
    Category:"Wales",
    ID:"5442",
    Parent:"5140"
  },
  {
    Category:"Latin America",
    ID:"5203",
    Parent:"5000"
  },
  {
    Category:"Caribbean",
    ID:"5204",
    Parent:"5203"
  },
  {
    Category:"Antigua & Barbuda",
    ID:"5550",
    Parent:"5204"
  },
  {
    Category:"Aruba, Bonaire & Curaçao",
    ID:"5569",
    Parent:"5204"
  },
  {
    Category:"Bahamas",
    ID:"5360",
    Parent:"5204"
  },
  {
    Category:"Barbados",
    ID:"5559",
    Parent:"5204"
  },
  {
    Category:"Cayman Islands",
    ID:"5570",
    Parent:"5204"
  },
  {
    Category:"Cuba",
    ID:"5205",
    Parent:"5204"
  },
  {
    Category:"Dominica",
    ID:"5560",
    Parent:"5204"
  },
  {
    Category:"Dominican Republic",
    ID:"5206",
    Parent:"5204"
  },
  {
    Category:"Grenada",
    ID:"5561",
    Parent:"5204"
  },
  {
    Category:"Guadeloupe",
    ID:"5700",
    Parent:"5204"
  },
  {
    Category:"Haiti",
    ID:"5562",
    Parent:"5204"
  },
  {
    Category:"Jamaica",
    ID:"5439",
    Parent:"5204"
  },
  {
    Category:"Martinique",
    ID:"5701",
    Parent:"5204"
  },
  {
    Category:"Puerto Rico",
    ID:"5207",
    Parent:"5204"
  },
  {
    Category:"Saint Kitts & Nevis",
    ID:"5563",
    Parent:"5204"
  },
  {
    Category:"Saint Lucia",
    ID:"5564",
    Parent:"5204"
  },
  {
    Category:"Saint Vincent & Grenadines",
    ID:"5572",
    Parent:"5204"
  },
  {
    Category:"Trinidad & Tobago",
    ID:"5573",
    Parent:"5204"
  },
  {
    Category:"Virgin Islands",
    ID:"5571",
    Parent:"5204"
  },
  {
    Category:"Central America",
    ID:"5208",
    Parent:"5203"
  },
  {
    Category:"Belize",
    ID:"5549",
    Parent:"5208"
  },
  {
    Category:"Costa Rica",
    ID:"5209",
    Parent:"5208"
  },
  {
    Category:"El Salvador",
    ID:"5548",
    Parent:"5208"
  },
  {
    Category:"Guatemala",
    ID:"5547",
    Parent:"5208"
  },
  {
    Category:"Honduras",
    ID:"5546",
    Parent:"5208"
  },
  {
    Category:"Mexico",
    ID:"5210",
    Parent:"5208"
  },
  {
    Category:"Baja California",
    ID:"5792",
    Parent:"5210"
  },
  {
    Category:"Los Cabos",
    ID:"5813",
    Parent:"5792"
  },
  {
    Category:"Tijuana",
    ID:"5214",
    Parent:"5792"
  },
  {
    Category:"Central Mexico",
    ID:"5797",
    Parent:"5210"
  },
  {
    Category:"Cuernavaca (Morelos)",
    ID:"5814",
    Parent:"5797"
  },
  {
    Category:"Guanajuato",
    ID:"5801",
    Parent:"5797"
  },
  {
    Category:"Mexico City",
    ID:"5212",
    Parent:"5797"
  },
  {
    Category:"Mexico State",
    ID:"5798",
    Parent:"5797"
  },
  {
    Category:"Puebla",
    ID:"5800",
    Parent:"5797"
  },
  {
    Category:"Veracruz",
    ID:"5799",
    Parent:"5797"
  },
  {
    Category:"Northern Mexico",
    ID:"5793",
    Parent:"5210"
  },
  {
    Category:"Chihuahua",
    ID:"5795",
    Parent:"5793"
  },
  {
    Category:"Nuevo León",
    ID:"5794",
    Parent:"5793"
  },
  {
    Category:"Monterrey",
    ID:"5213",
    Parent:"5794"
  },
  {
    Category:"Tamaulipas",
    ID:"5796",
    Parent:"5793"
  },
  {
    Category:"Pacific Coast (Mexico)",
    ID:"5802",
    Parent:"5210"
  },
  {
    Category:"Chiapas",
    ID:"5806",
    Parent:"5802"
  },
  {
    Category:"Guerrero",
    ID:"5803",
    Parent:"5802"
  },
  {
    Category:"Acapulco",
    ID:"5815",
    Parent:"5803"
  },
  {
    Category:"Jalisco",
    ID:"5805",
    Parent:"5802"
  },
  {
    Category:"Guadalajara",
    ID:"5211",
    Parent:"5805"
  },
  {
    Category:"Puerto Vallarta",
    ID:"5816",
    Parent:"5805"
  },
  {
    Category:"Michoacán",
    ID:"5807",
    Parent:"5802"
  },
  {
    Category:"Oaxaca",
    ID:"5804",
    Parent:"5802"
  },
  {
    Category:"Sinaloa",
    ID:"5808",
    Parent:"5802"
  },
  {
    Category:"Yucatán Peninsula",
    ID:"5809",
    Parent:"5210"
  },
  {
    Category:"Quintana Roo",
    ID:"5817",
    Parent:"5809"
  },
  {
    Category:"Cancún & Riviera Maya",
    ID:"5819",
    Parent:"5817"
  },
  {
    Category:"Yucatán",
    ID:"5818",
    Parent:"5809"
  },
  {
    Category:"Mérida",
    ID:"5820",
    Parent:"5818"
  },
  {
    Category:"Nicaragua",
    ID:"5545",
    Parent:"5208"
  },
  {
    Category:"Panama",
    ID:"5215",
    Parent:"5208"
  },
  {
    Category:"South America",
    ID:"5216",
    Parent:"5203"
  },
  {
    Category:"Argentina",
    ID:"5217",
    Parent:"5216"
  },
  {
    Category:"Buenos Aires",
    ID:"5218",
    Parent:"5217"
  },
  {
    Category:"Bolivia",
    ID:"5540",
    Parent:"5216"
  },
  {
    Category:"Brazil",
    ID:"5219",
    Parent:"5216"
  },
  {
    Category:"Central West Brazil",
    ID:"5526",
    Parent:"5219"
  },
  {
    Category:"Brasilia",
    ID:"5221",
    Parent:"5526"
  },
  {
    Category:"Goiás",
    ID:"5774",
    Parent:"5526"
  },
  {
    Category:"Mato Grosso",
    ID:"5786",
    Parent:"5526"
  },
  {
    Category:"Mato Grosso do Sul",
    ID:"5787",
    Parent:"5526"
  },
  {
    Category:"North Brazil",
    ID:"5522",
    Parent:"5219"
  },
  {
    Category:"Amazonas",
    ID:"5788",
    Parent:"5522"
  },
  {
    Category:"Pará",
    ID:"5789",
    Parent:"5522"
  },
  {
    Category:"Rondônia",
    ID:"5790",
    Parent:"5522"
  },
  {
    Category:"Tocantins",
    ID:"5791",
    Parent:"5522"
  },
  {
    Category:"Northeast Brazil",
    ID:"5523",
    Parent:"5219"
  },
  {
    Category:"Alagoas",
    ID:"5778",
    Parent:"5523"
  },
  {
    Category:"Bahia",
    ID:"5631",
    Parent:"5523"
  },
  {
    Category:"Salvador",
    ID:"5226",
    Parent:"5631"
  },
  {
    Category:"Ceará",
    ID:"5779",
    Parent:"5523"
  },
  {
    Category:"Fortaleza",
    ID:"5222",
    Parent:"5779"
  },
  {
    Category:"Maranhão",
    ID:"5780",
    Parent:"5523"
  },
  {
    Category:"Paraíba",
    ID:"5781",
    Parent:"5523"
  },
  {
    Category:"Pernambuco",
    ID:"5782",
    Parent:"5523"
  },
  {
    Category:"Recife",
    ID:"5224",
    Parent:"5782"
  },
  {
    Category:"Piauí",
    ID:"5783",
    Parent:"5523"
  },
  {
    Category:"Rio Grande do Norte",
    ID:"5784",
    Parent:"5523"
  },
  {
    Category:"Sergipe",
    ID:"5785",
    Parent:"5523"
  },
  {
    Category:"South Brazil",
    ID:"5524",
    Parent:"5219"
  },
  {
    Category:"Paraná",
    ID:"5627",
    Parent:"5524"
  },
  {
    Category:"Rio Grande do Sul",
    ID:"5630",
    Parent:"5524"
  },
  {
    Category:"Porto Alegre",
    ID:"5223",
    Parent:"5630"
  },
  {
    Category:"Santa Catarina",
    ID:"5629",
    Parent:"5524"
  },
  {
    Category:"Southeast Brazil",
    ID:"5525",
    Parent:"5219"
  },
  {
    Category:"Espirito Santo",
    ID:"5777",
    Parent:"5525"
  },
  {
    Category:"Minas Gerais",
    ID:"5632",
    Parent:"5525"
  },
  {
    Category:"Belo Horizonte",
    ID:"5220",
    Parent:"5632"
  },
  {
    Category:"Rio de Janeiro",
    ID:"5225",
    Parent:"5525"
  },
  {
    Category:"São Paulo",
    ID:"5227",
    Parent:"5525"
  },
  {
    Category:"Chile",
    ID:"5228",
    Parent:"5216"
  },
  {
    Category:"Santiago",
    ID:"5229",
    Parent:"5228"
  },
  {
    Category:"Colombia",
    ID:"5230",
    Parent:"5216"
  },
  {
    Category:"Bogota",
    ID:"5231",
    Parent:"5230"
  },
  {
    Category:"Ecuador",
    ID:"5536",
    Parent:"5216"
  },
  {
    Category:"Galapagos Islands",
    ID:"5832",
    Parent:"5536"
  },
  {
    Category:"Quito",
    ID:"5833",
    Parent:"5536"
  },
  {
    Category:"French Guiana",
    ID:"5544",
    Parent:"5216"
  },
  {
    Category:"Guyana",
    ID:"5543",
    Parent:"5216"
  },
  {
    Category:"Paraguay",
    ID:"5541",
    Parent:"5216"
  },
  {
    Category:"Peru",
    ID:"5232",
    Parent:"5216"
  },
  {
    Category:"Lima",
    ID:"5233",
    Parent:"5232"
  },
  {
    Category:"Suriname",
    ID:"5542",
    Parent:"5216"
  },
  {
    Category:"Uruguay",
    ID:"5234",
    Parent:"5216"
  },
  {
    Category:"Venezuela",
    ID:"5235",
    Parent:"5216"
  },
  {
    Category:"Caracas",
    ID:"5236",
    Parent:"5235"
  },
  {
    Category:"Middle East",
    ID:"5588",
    Parent:"5000"
  },
  {
    Category:"North America",
    ID:"5237",
    Parent:"5000"
  },
  {
    Category:"Bermuda",
    ID:"5354",
    Parent:"5237"
  },
  {
    Category:"Canada",
    ID:"5238",
    Parent:"5237"
  },
  {
    Category:"Atlantic Provinces",
    ID:"5239",
    Parent:"5238"
  },
  {
    Category:"New Brunswick",
    ID:"5596",
    Parent:"5239"
  },
  {
    Category:"Newfoundland & Labrador",
    ID:"5598",
    Parent:"5239"
  },
  {
    Category:"Nova Scotia",
    ID:"5597",
    Parent:"5239"
  },
  {
    Category:"Halifax",
    ID:"5240",
    Parent:"5597"
  },
  {
    Category:"Prince Edward Island",
    ID:"5599",
    Parent:"5239"
  },
  {
    Category:"British Columbia",
    ID:"5241",
    Parent:"5238"
  },
  {
    Category:"Vancouver",
    ID:"5242",
    Parent:"5241"
  },
  {
    Category:"Victoria (BC)",
    ID:"5243",
    Parent:"5241"
  },
  {
    Category:"Canadian Prairies",
    ID:"5244",
    Parent:"5238"
  },
  {
    Category:"Alberta",
    ID:"5600",
    Parent:"5244"
  },
  {
    Category:"Calgary",
    ID:"5245",
    Parent:"5600"
  },
  {
    Category:"Edmonton",
    ID:"5246",
    Parent:"5600"
  },
  {
    Category:"Manitoba",
    ID:"5602",
    Parent:"5244"
  },
  {
    Category:"Winnipeg",
    ID:"5247",
    Parent:"5602"
  },
  {
    Category:"Saskatchewan",
    ID:"5601",
    Parent:"5244"
  },
  {
    Category:"Northern Territories",
    ID:"5248",
    Parent:"5238"
  },
  {
    Category:"Ontario",
    ID:"5249",
    Parent:"5238"
  },
  {
    Category:"Greater Toronto",
    ID:"5253",
    Parent:"5249"
  },
  {
    Category:"Hamilton-Niagara Peninsula",
    ID:"5250",
    Parent:"5249"
  },
  {
    Category:"Ottawa-Gatineau",
    ID:"5252",
    Parent:"5249"
  },
  {
    Category:"Southwestern Ontario",
    ID:"5251",
    Parent:"5249"
  },
  {
    Category:"Quebec",
    ID:"5254",
    Parent:"5238"
  },
  {
    Category:"Montreal",
    ID:"5255",
    Parent:"5254"
  },
  {
    Category:"Quebec City",
    ID:"5256",
    Parent:"5254"
  },
  {
    Category:"USA",
    ID:"5257",
    Parent:"5237"
  },
  {
    Category:"Alaska",
    ID:"5258",
    Parent:"5257"
  },
  {
    Category:"California",
    ID:"5259",
    Parent:"5257"
  },
  {
    Category:"California Central Coast",
    ID:"5669",
    Parent:"5259"
  },
  {
    Category:"Lake Tahoe",
    ID:"5474",
    Parent:"5259"
  },
  {
    Category:"Sacramento Valley",
    ID:"5263",
    Parent:"5259"
  },
  {
    Category:"San Francisco Bay Area",
    ID:"5265",
    Parent:"5259"
  },
  {
    Category:"San Joaquin Valley",
    ID:"5260",
    Parent:"5259"
  },
  {
    Category:"Silicon Valley",
    ID:"5266",
    Parent:"5259"
  },
  {
    Category:"Southern California",
    ID:"5535",
    Parent:"5259"
  },
  {
    Category:"Inland Empire",
    ID:"5262",
    Parent:"5535"
  },
  {
    Category:"Los Angeles",
    ID:"5261",
    Parent:"5535"
  },
  {
    Category:"Orange County (CA)",
    ID:"5475",
    Parent:"5535"
  },
  {
    Category:"San Diego",
    ID:"5264",
    Parent:"5535"
  },
  {
    Category:"Florida",
    ID:"5267",
    Parent:"5257"
  },
  {
    Category:"Central Florida",
    ID:"5624",
    Parent:"5267"
  },
  {
    Category:"Deltona-Daytona Beach",
    ID:"5642",
    Parent:"5624"
  },
  {
    Category:"Greater Orlando",
    ID:"5270",
    Parent:"5624"
  },
  {
    Category:"Tampa Bay Area",
    ID:"5271",
    Parent:"5624"
  },
  {
    Category:"Florida Panhandle",
    ID:"5622",
    Parent:"5267"
  },
  {
    Category:"Tallahassee",
    ID:"5824",
    Parent:"5622"
  },
  {
    Category:"North Florida",
    ID:"5623",
    Parent:"5267"
  },
  {
    Category:"Jacksonville",
    ID:"5268",
    Parent:"5623"
  },
  {
    Category:"Southern Florida",
    ID:"5638",
    Parent:"5267"
  },
  {
    Category:"Florida Keys",
    ID:"5822",
    Parent:"5638"
  },
  {
    Category:"Fort Myers-Cape Coral",
    ID:"5823",
    Parent:"5638"
  },
  {
    Category:"South Florida Metro",
    ID:"5625",
    Parent:"5638"
  },
  {
    Category:"Broward-Fort Lauderdale",
    ID:"5641",
    Parent:"5625"
  },
  {
    Category:"Miami-Dade",
    ID:"5269",
    Parent:"5625"
  },
  {
    Category:"West Palm Beach-Boca Raton",
    ID:"5272",
    Parent:"5625"
  },
  {
    Category:"Great Plains (USA)",
    ID:"5273",
    Parent:"5257"
  },
  {
    Category:"Kansas",
    ID:"5462",
    Parent:"5273"
  },
  {
    Category:"Nebraska",
    ID:"5470",
    Parent:"5273"
  },
  {
    Category:"North Dakota",
    ID:"5471",
    Parent:"5273"
  },
  {
    Category:"Oklahoma",
    ID:"5426",
    Parent:"5273"
  },
  {
    Category:"Oklahoma City",
    ID:"5274",
    Parent:"5426"
  },
  {
    Category:"Tulsa",
    ID:"5275",
    Parent:"5426"
  },
  {
    Category:"South Dakota",
    ID:"5472",
    Parent:"5273"
  },
  {
    Category:"Hawaii",
    ID:"5276",
    Parent:"5257"
  },
  {
    Category:"Big Island (Hawaii)",
    ID:"5828",
    Parent:"5276"
  },
  {
    Category:"Kauai",
    ID:"5829",
    Parent:"5276"
  },
  {
    Category:"Maui",
    ID:"5827",
    Parent:"5276"
  },
  {
    Category:"Oahu",
    ID:"5826",
    Parent:"5276"
  },
  {
    Category:"Mid-Atlantic (USA)",
    ID:"5277",
    Parent:"5257"
  },
  {
    Category:"Delaware",
    ID:"5463",
    Parent:"5277"
  },
  {
    Category:"Maryland",
    ID:"5427",
    Parent:"5277"
  },
  {
    Category:"Baltimore Metro",
    ID:"5279",
    Parent:"5427"
  },
  {
    Category:"New Jersey",
    ID:"5411",
    Parent:"5277"
  },
  {
    Category:"New York State",
    ID:"5409",
    Parent:"5277"
  },
  {
    Category:"Albany-Capital District",
    ID:"5278",
    Parent:"5409"
  },
  {
    Category:"Buffalo-Niagara Falls",
    ID:"5280",
    Parent:"5409"
  },
  {
    Category:"New York City",
    ID:"5282",
    Parent:"5409"
  },
  {
    Category:"Rochester-Finger Lakes",
    ID:"5285",
    Parent:"5409"
  },
  {
    Category:"Pennsylvania",
    ID:"5410",
    Parent:"5277"
  },
  {
    Category:"Harrisburg-South Central PA",
    ID:"5281",
    Parent:"5410"
  },
  {
    Category:"Philadelphia",
    ID:"5283",
    Parent:"5410"
  },
  {
    Category:"Pittsburgh",
    ID:"5284",
    Parent:"5410"
  },
  {
    Category:"Washington DC",
    ID:"5286",
    Parent:"5277"
  },
  {
    Category:"Midwest (USA)",
    ID:"5287",
    Parent:"5257"
  },
  {
    Category:"Illinois",
    ID:"5428",
    Parent:"5287"
  },
  {
    Category:"Chicago",
    ID:"5288",
    Parent:"5428"
  },
  {
    Category:"Indiana",
    ID:"5429",
    Parent:"5287"
  },
  {
    Category:"Indianapolis",
    ID:"5294",
    Parent:"5429"
  },
  {
    Category:"Iowa",
    ID:"5458",
    Parent:"5287"
  },
  {
    Category:"Michigan",
    ID:"5413",
    Parent:"5287"
  },
  {
    Category:"Detroit",
    ID:"5292",
    Parent:"5413"
  },
  {
    Category:"Grand Rapids-West Michigan",
    ID:"5293",
    Parent:"5413"
  },
  {
    Category:"Minnesota",
    ID:"5431",
    Parent:"5287"
  },
  {
    Category:"Minneapolis-Saint Paul",
    ID:"5297",
    Parent:"5431"
  },
  {
    Category:"Missouri",
    ID:"5414",
    Parent:"5287"
  },
  {
    Category:"Greater St. Louis",
    ID:"5298",
    Parent:"5414"
  },
  {
    Category:"Kansas City",
    ID:"5295",
    Parent:"5414"
  },
  {
    Category:"Ohio",
    ID:"5412",
    Parent:"5287"
  },
  {
    Category:"Cincinnati",
    ID:"5289",
    Parent:"5412"
  },
  {
    Category:"Columbus (OH)",
    ID:"5291",
    Parent:"5412"
  },
  {
    Category:"Greater Cleveland",
    ID:"5290",
    Parent:"5412"
  },
  {
    Category:"Wisconsin",
    ID:"5430",
    Parent:"5287"
  },
  {
    Category:"Milwaukee",
    ID:"5296",
    Parent:"5430"
  },
  {
    Category:"New England",
    ID:"5299",
    Parent:"5257"
  },
  {
    Category:"Connecticut",
    ID:"5423",
    Parent:"5299"
  },
  {
    Category:"Greater Hartford",
    ID:"5301",
    Parent:"5423"
  },
  {
    Category:"New Haven",
    ID:"5670",
    Parent:"5423"
  },
  {
    Category:"Maine",
    ID:"5459",
    Parent:"5299"
  },
  {
    Category:"Massachusetts",
    ID:"5424",
    Parent:"5299"
  },
  {
    Category:"Boston Metro",
    ID:"5300",
    Parent:"5424"
  },
  {
    Category:"New Hampshire",
    ID:"5461",
    Parent:"5299"
  },
  {
    Category:"Rhode Island",
    ID:"5425",
    Parent:"5299"
  },
  {
    Category:"Providence",
    ID:"5302",
    Parent:"5425"
  },
  {
    Category:"Vermont",
    ID:"5460",
    Parent:"5299"
  },
  {
    Category:"Pacific Northwest",
    ID:"5303",
    Parent:"5257"
  },
  {
    Category:"Oregon",
    ID:"5433",
    Parent:"5303"
  },
  {
    Category:"Portland (OR)",
    ID:"5304",
    Parent:"5433"
  },
  {
    Category:"Washington State",
    ID:"5432",
    Parent:"5303"
  },
  {
    Category:"Seattle-Tacoma",
    ID:"5305",
    Parent:"5432"
  },
  {
    Category:"Rocky Mountains",
    ID:"5306",
    Parent:"5257"
  },
  {
    Category:"Colorado",
    ID:"5434",
    Parent:"5306"
  },
  {
    Category:"Denver",
    ID:"5307",
    Parent:"5434"
  },
  {
    Category:"Idaho",
    ID:"5466",
    Parent:"5306"
  },
  {
    Category:"Montana",
    ID:"5465",
    Parent:"5306"
  },
  {
    Category:"Wyoming",
    ID:"5464",
    Parent:"5306"
  },
  {
    Category:"South (USA)",
    ID:"5308",
    Parent:"5257"
  },
  {
    Category:"Alabama",
    ID:"5422",
    Parent:"5308"
  },
  {
    Category:"Birmingham (AL)",
    ID:"5311",
    Parent:"5422"
  },
  {
    Category:"Arkansas",
    ID:"5467",
    Parent:"5308"
  },
  {
    Category:"Georgia (USA)",
    ID:"5420",
    Parent:"5308"
  },
  {
    Category:"Atlanta",
    ID:"5309",
    Parent:"5420"
  },
  {
    Category:"Kentucky",
    ID:"5421",
    Parent:"5308"
  },
  {
    Category:"Louisville",
    ID:"5315",
    Parent:"5421"
  },
  {
    Category:"Louisiana",
    ID:"5417",
    Parent:"5308"
  },
  {
    Category:"Baton Rouge",
    ID:"5310",
    Parent:"5417"
  },
  {
    Category:"New Orleans",
    ID:"5318",
    Parent:"5417"
  },
  {
    Category:"Mississippi",
    ID:"5469",
    Parent:"5308"
  },
  {
    Category:"North Carolina",
    ID:"5416",
    Parent:"5308"
  },
  {
    Category:"Charlotte Metro",
    ID:"5312",
    Parent:"5416"
  },
  {
    Category:"Piedmont Triad",
    ID:"5313",
    Parent:"5416"
  },
  {
    Category:"Raleigh-Durham",
    ID:"5320",
    Parent:"5416"
  },
  {
    Category:"South Carolina",
    ID:"5418",
    Parent:"5308"
  },
  {
    Category:"Greater Charleston (SC)",
    ID:"5618",
    Parent:"5418"
  },
  {
    Category:"Myrtle Beach & Grand Strand",
    ID:"5821",
    Parent:"5418"
  },
  {
    Category:"Upstate South Carolina",
    ID:"5314",
    Parent:"5418"
  },
  {
    Category:"Tennessee",
    ID:"5419",
    Parent:"5308"
  },
  {
    Category:"Memphis",
    ID:"5316",
    Parent:"5419"
  },
  {
    Category:"Nashville",
    ID:"5317",
    Parent:"5419"
  },
  {
    Category:"Virginia",
    ID:"5415",
    Parent:"5308"
  },
  {
    Category:"Richmond-Petersburg",
    ID:"5321",
    Parent:"5415"
  },
  {
    Category:"Virginia Beach-Hampton Roads",
    ID:"5319",
    Parent:"5415"
  },
  {
    Category:"West Virginia",
    ID:"5468",
    Parent:"5308"
  },
  {
    Category:"Southwest (USA)",
    ID:"5322",
    Parent:"5257"
  },
  {
    Category:"Arizona",
    ID:"5435",
    Parent:"5322"
  },
  {
    Category:"Phoenix",
    ID:"5325",
    Parent:"5435"
  },
  {
    Category:"Tucson",
    ID:"5328",
    Parent:"5435"
  },
  {
    Category:"Nevada",
    ID:"5436",
    Parent:"5322"
  },
  {
    Category:"Las Vegas",
    ID:"5324",
    Parent:"5436"
  },
  {
    Category:"Reno-Sparks",
    ID:"5326",
    Parent:"5436"
  },
  {
    Category:"New Mexico",
    ID:"5438",
    Parent:"5322"
  },
  {
    Category:"Albuquerque-Santa Fe",
    ID:"5323",
    Parent:"5438"
  },
  {
    Category:"Utah",
    ID:"5437",
    Parent:"5322"
  },
  {
    Category:"Salt Lake City",
    ID:"5327",
    Parent:"5437"
  },
  {
    Category:"Texas",
    ID:"5329",
    Parent:"5257"
  },
  {
    Category:"Austin-Round Rock",
    ID:"5330",
    Parent:"5329"
  },
  {
    Category:"Dallas-Fort Worth",
    ID:"5331",
    Parent:"5329"
  },
  {
    Category:"El Paso",
    ID:"5332",
    Parent:"5329"
  },
  {
    Category:"Houston",
    ID:"5333",
    Parent:"5329"
  },
  {
    Category:"San Antonio",
    ID:"5334",
    Parent:"5329"
  },
  {
    Category:"Oceania",
    ID:"5335",
    Parent:"5000"
  },
  {
    Category:"Australia",
    ID:"5336",
    Parent:"5335"
  },
  {
    Category:"New South Wales",
    ID:"5452",
    Parent:"5336"
  },
  {
    Category:"Canberra",
    ID:"5339",
    Parent:"5452"
  },
  {
    Category:"Newcastle (AU)",
    ID:"5342",
    Parent:"5452"
  },
  {
    Category:"Sydney",
    ID:"5344",
    Parent:"5452"
  },
  {
    Category:"Northern Territory",
    ID:"5457",
    Parent:"5336"
  },
  {
    Category:"Queensland",
    ID:"5453",
    Parent:"5336"
  },
  {
    Category:"Brisbane",
    ID:"5338",
    Parent:"5453"
  },
  {
    Category:"Cairns",
    ID:"5357",
    Parent:"5453"
  },
  {
    Category:"Gold Coast",
    ID:"5340",
    Parent:"5453"
  },
  {
    Category:"South Australia",
    ID:"5456",
    Parent:"5336"
  },
  {
    Category:"Adelaide",
    ID:"5337",
    Parent:"5456"
  },
  {
    Category:"Tasmania",
    ID:"5356",
    Parent:"5336"
  },
  {
    Category:"Victoria (AU)",
    ID:"5454",
    Parent:"5336"
  },
  {
    Category:"Melbourne",
    ID:"5341",
    Parent:"5454"
  },
  {
    Category:"Western Australia",
    ID:"5455",
    Parent:"5336"
  },
  {
    Category:"Perth",
    ID:"5343",
    Parent:"5455"
  },
  {
    Category:"New Zealand",
    ID:"5350",
    Parent:"5335"
  },
  {
    Category:"Auckland",
    ID:"5351",
    Parent:"5350"
  },
  {
    Category:"Christchurch",
    ID:"5359",
    Parent:"5350"
  },
  {
    Category:"Wellington",
    ID:"5358",
    Parent:"5350"
  },
  {
    Category:"Pacific Islands",
    ID:"5589",
    Parent:"5335"
  },
  {
    Category:"Melanesia",
    ID:"5345",
    Parent:"5589"
  },
  {
    Category:"Fiji",
    ID:"5346",
    Parent:"5345"
  },
  {
    Category:"Papua New Guinea",
    ID:"5347",
    Parent:"5345"
  },
  {
    Category:"Micronesia",
    ID:"5348",
    Parent:"5589"
  },
  {
    Category:"Guam",
    ID:"5349",
    Parent:"5348"
  },
  {
    Category:"Polynesia",
    ID:"5352",
    Parent:"5589"
  },
  {
    Category:"Tahiti & Bora Bora",
    ID:"5568",
    Parent:"5352"
  },
  {
    Category:"Polar Regions",
    ID:"5353",
    Parent:"5000"
  }
];
//function to create the parent domains
var parentDomains = [
	{	
    Category:"All",
    ID:"999999",
    Parent:"0"
  },

  {
    Category: "Arts & Entertainment",
    ID: "3",
    Parent: "0"
  },
  {
    Category: "Autos & Vehicles",
    ID: "47",
    Parent: "0"
  },
  {
    Category: "Beauty & Fitness",
    ID: "44",
    Parent: "0"
  },
  {
    Category: "Books & Literature",
    ID: "22",
    Parent: "0"
  },
  {
    Category: "Business & Industrial",
    ID: "12",
    Parent: "0"
  },
  {
    Category: "Computers & Electronics",
    ID: "5",
    Parent: "0"
  },
  {
    Category: "Finance",
    ID: "7",
    Parent: "0"
  },
  {
    Category: "Food & Drink",
    ID: "71",
    Parent: "0"
  },
  {
    Category: "Games",
    ID: "8",
    Parent: "0"
  },
  {
    Category: "Health",
    ID: "45",
    Parent: "0"
  },
  {
    Category: "Hobbies & Leisure",
    ID: "65",
    Parent: "0"
  },
  {
    Category: "Home & Garden",
    ID: "11",
    Parent: "0"
  },
  {
    Category: "Internet & Telecom",
    ID: "13",
    Parent: "0"
  },
  {
    Category: "Jobs & Education",
    ID: "958",
    Parent: "0"
  },
  {
    Category: "Law & Government",
    ID: "19",
    Parent: "0"
  },
  {
    Category: "News",
    ID: "16",
    Parent: "0"
  },
  {
    Category: "Online Communities",
    ID: "299",
    Parent: "0"
  },
  {
    Category: "People & Society",
    ID: "14",
    Parent: "0"
  },
  {
    Category: "Pets & Animals",
    ID: "66",
    Parent: "0"
  },
  {
    Category: "Real Estate",
    ID: "29",
    Parent: "0"
  },
  {
    Category: "Reference",
    ID: "533",
    Parent: "0"
  },
  {
    Category: "Science",
    ID: "174",
    Parent: "0"
  },
  {
    Category: "Shopping",
    ID: "18",
    Parent: "0"
  },
  {
    Category: "Sports",
    ID: "20",
    Parent: "0"
  },
  {
    Category: "Travel",
    ID: "67",
    Parent: "0"
  },
  {
    Category: "World Localities",
    ID: "5000",
    Parent: "0"
  }
];
var subdomains = [
  {
    Category: "Celebrities & Entertainment News",
    ID: "184",
    Parent: "3"
  },
  {
    Category: "Comics & Animation",
    ID: "316",
    Parent: "3"
  },
  {
    Category: "Entertainment Industry",
    ID: "612",
    Parent: "3"
  },
  {
    Category: "Events & Listings",
    ID: "569",
    Parent: "3"
  },
  {
    Category: "Fun & Trivia",
    ID: "539",
    Parent: "3"
  },
  {
    Category: "Humor",
    ID: "182",
    Parent: "3"
  },
  {
    Category: "Movies",
    ID: "34",
    Parent: "3"
  },
  {
    Category: "Music & Audio",
    ID: "35",
    Parent: "3"
  },
  {
    Category: "Offbeat",
    ID: "33",
    Parent: "3"
  },
  {
    Category: "Online Media",
    ID: "613",
    Parent: "3"
  },
  {
    Category: "Performing Arts",
    ID: "23",
    Parent: "3"
  },
  {
    Category: "TV & Video",
    ID: "36",
    Parent: "3"
  },
  {
    Category: "Visual Art & Design",
    ID: "24",
    Parent: "3"
  },
  {
    Category: "Bicycles & Accessories",
    ID: "1191",
    Parent: "47"
  },
  {
    Category: "Boats & Watercraft",
    ID: "1140",
    Parent: "47"
  },
  {
    Category: "Campers & RVs",
    ID: "1213",
    Parent: "47"
  },
  {
    Category: "Classic Vehicles",
    ID: "1013",
    Parent: "47"
  },
  {
    Category: "Commercial Vehicles",
    ID: "1214",
    Parent: "47"
  },
  {
    Category: "Custom & Performance Vehicles",
    ID: "806",
    Parent: "47"
  },
  {
    Category: "Hybrid & Alternative Vehicles",
    ID: "810",
    Parent: "47"
  },
  {
    Category: "Microcars & City Cars",
    ID: "1317",
    Parent: "47"
  },
  {
    Category: "Motorcycles",
    ID: "273",
    Parent: "47"
  },
  {
    Category: "Off-Road Vehicles",
    ID: "148",
    Parent: "47"
  },
  {
    Category: "Personal Aircraft",
    ID: "1147",
    Parent: "47"
  },
  {
    Category: "Scooters & Mopeds",
    ID: "1212",
    Parent: "47"
  },
  {
    Category: "Trucks & SUVs",
    ID: "610",
    Parent: "47"
  },
  {
    Category: "Vehicle Brands",
    ID: "815",
    Parent: "47"
  },
  {
    Category: "Vehicle Codes & Driving Laws",
    ID: "1294",
    Parent: "47"
  },
  {
    Category: "Vehicle Maintenance",
    ID: "138",
    Parent: "47"
  },
  {
    Category: "Vehicle Parts & Accessories",
    ID: "89",
    Parent: "47"
  },
  {
    Category: "Vehicle Shopping",
    ID: "473",
    Parent: "47"
  },
  {
    Category: "Vehicle Shows",
    ID: "803",
    Parent: "47"
  },
  {
    Category: "Beauty Pageants",
    ID: "1219",
    Parent: "44"
  },
  {
    Category: "Body Art",
    ID: "239",
    Parent: "44"
  },
  {
    Category: "Cosmetic Procedures",
    ID: "1220",
    Parent: "44"
  },
  {
    Category: "Cosmetology & Beauty Professionals",
    ID: "147",
    Parent: "44"
  },
  {
    Category: "Face & Body Care",
    ID: "143",
    Parent: "44"
  },
  {
    Category: "Fashion & Style",
    ID: "185",
    Parent: "44"
  },
  {
    Category: "Fitness",
    ID: "94",
    Parent: "44"
  },
  {
    Category: "Hair Care",
    ID: "146",
    Parent: "44"
  },
  {
    Category: "Spas & Beauty Services",
    ID: "145",
    Parent: "44"
  },
  {
    Category: "Weight Loss",
    ID: "236",
    Parent: "44"
  },
  {
    Category: "Book Retailers",
    ID: "355",
    Parent: "22"
  },
  {
    Category: "Children's Literature",
    ID: "1183",
    Parent: "22"
  },
  {
    Category: "E-Books",
    ID: "608",
    Parent: "22"
  },
  {
    Category: "Fan Fiction",
    ID: "540",
    Parent: "22"
  },
  {
    Category: "Literary Classics",
    ID: "1184",
    Parent: "22"
  },
  {
    Category: "Magazines",
    ID: "412",
    Parent: "22"
  },
  {
    Category: "Poetry",
    ID: "565",
    Parent: "22"
  },
  {
    Category: "Writers Resources",
    ID: "1177",
    Parent: "22"
  },
  {
    Category: "Advertising & Marketing",
    ID: "25",
    Parent: "12"
  },
  {
    Category: "Aerospace & Defense",
    ID: "356",
    Parent: "12"
  },
  {
    Category: "Agriculture & Forestry",
    ID: "46",
    Parent: "12"
  },
  {
    Category: "Automotive Industry",
    ID: "1190",
    Parent: "12"
  },
  {
    Category: "Business Education",
    ID: "799",
    Parent: "12"
  },
  {
    Category: "Business Finance",
    ID: "1138",
    Parent: "12"
  },
  {
    Category: "Business Operations",
    ID: "1159",
    Parent: "12"
  },
  {
    Category: "Business Services",
    ID: "329",
    Parent: "12"
  },
  {
    Category: "Chemicals Industry",
    ID: "288",
    Parent: "12"
  },
  {
    Category: "Construction & Maintenance",
    ID: "48",
    Parent: "12"
  },
  {
    Category: "Energy & Utilities",
    ID: "233",
    Parent: "12"
  },
  {
    Category: "Hospitality Industry",
    ID: "955",
    Parent: "12"
  },
  {
    Category: "Industrial Materials & Equipment",
    ID: "287",
    Parent: "12"
  },
  {
    Category: "Manufacturing",
    ID: "49",
    Parent: "12"
  },
  {
    Category: "Metals & Mining",
    ID: "606",
    Parent: "12"
  },
  {
    Category: "Pharmaceuticals & Biotech",
    ID: "255",
    Parent: "12"
  },
  {
    Category: "Printing & Publishing",
    ID: "1176",
    Parent: "12"
  },
  {
    Category: "Professional & Trade Associations",
    ID: "1199",
    Parent: "12"
  },
  {
    Category: "Retail Trade",
    ID: "841",
    Parent: "12"
  },
  {
    Category: "Small Business",
    ID: "551",
    Parent: "12"
  },
  {
    Category: "Textiles & Nonwovens",
    ID: "566",
    Parent: "12"
  },
  {
    Category: "Transportation & Logistics",
    ID: "50",
    Parent: "12"
  },
  {
    Category: "CAD & CAM",
    ID: "1300",
    Parent: "5"
  },
  {
    Category: "Computer Hardware",
    ID: "30",
    Parent: "5"
  },
  {
    Category: "Computer Security",
    ID: "314",
    Parent: "5"
  },
  {
    Category: "Consumer Electronics",
    ID: "78",
    Parent: "5"
  },
  {
    Category: "Electronics & Electrical",
    ID: "434",
    Parent: "5"
  },
  {
    Category: "Enterprise Technology",
    ID: "77",
    Parent: "5"
  },
  {
    Category: "Networking",
    ID: "311",
    Parent: "5"
  },
  {
    Category: "Programming",
    ID: "31",
    Parent: "5"
  },
  {
    Category: "Software",
    ID: "32",
    Parent: "5"
  },
  {
    Category: "Accounting & Auditing",
    ID: "278",
    Parent: "7"
  },
  {
    Category: "Banking",
    ID: "37",
    Parent: "7"
  },
  {
    Category: "Credit & Lending",
    ID: "279",
    Parent: "7"
  },
  {
    Category: "Financial Planning & Management",
    ID: "903",
    Parent: "7"
  },
  {
    Category: "Grants, Scholarships & Financial Aid",
    ID: "1282",
    Parent: "7"
  },
  {
    Category: "Insurance",
    ID: "38",
    Parent: "7"
  },
  {
    Category: "Investing",
    ID: "107",
    Parent: "7"
  },
  {
    Category: "Beverages",
    ID: "560",
    Parent: "71"
  },
  {
    Category: "Cooking & Recipes",
    ID: "122",
    Parent: "71"
  },
  {
    Category: "Food",
    ID: "1512",
    Parent: "71"
  },
  {
    Category: "Food & Grocery Delivery",
    ID: "1523",
    Parent: "71"
  },
  {
    Category: "Food & Grocery Retailers",
    ID: "121",
    Parent: "71"
  },
  {
    Category: "Restaurants",
    ID: "276",
    Parent: "71"
  },
  {
    Category: "Arcade & Coin-Op Games",
    ID: "919",
    Parent: "8"
  },
  {
    Category: "Board Games",
    ID: "920",
    Parent: "8"
  },
  {
    Category: "Card Games",
    ID: "39",
    Parent: "8"
  },
  {
    Category: "Computer & Video Games",
    ID: "41",
    Parent: "8"
  },
  {
    Category: "Dice Games",
    ID: "1492",
    Parent: "8"
  },
  {
    Category: "Educational Games",
    ID: "1493",
    Parent: "8"
  },
  {
    Category: "Family-Oriented Games & Activities",
    ID: "1290",
    Parent: "8"
  },
  {
    Category: "Gambling",
    ID: "637",
    Parent: "8"
  },
  {
    Category: "Online Games",
    ID: "105",
    Parent: "8"
  },
  {
    Category: "Party Games",
    ID: "936",
    Parent: "8"
  },
  {
    Category: "Puzzles & Brainteasers",
    ID: "937",
    Parent: "8"
  },
  {
    Category: "Roleplaying Games",
    ID: "622",
    Parent: "8"
  },
  {
    Category: "Table Games",
    ID: "938",
    Parent: "8"
  },
  {
    Category: "Tile Games",
    ID: "1549",
    Parent: "8"
  },
  {
    Category: "Word Games",
    ID: "1494",
    Parent: "8"
  },
  {
    Category: "Aging & Geriatrics",
    ID: "623",
    Parent: "45"
  },
  {
    Category: "Alternative & Natural Medicine",
    ID: "499",
    Parent: "45"
  },
  {
    Category: "Health Conditions",
    ID: "419",
    Parent: "45"
  },
  {
    Category: "Health Education & Medical Training",
    ID: "254",
    Parent: "45"
  },
  {
    Category: "Health Foundations & Medical Research",
    ID: "252",
    Parent: "45"
  },
  {
    Category: "Medical Devices & Equipment",
    ID: "251",
    Parent: "45"
  },
  {
    Category: "Medical Facilities & Services",
    ID: "256",
    Parent: "45"
  },
  {
    Category: "Medical Literature & Resources",
    ID: "253",
    Parent: "45"
  },
  {
    Category: "Men's Health",
    ID: "636",
    Parent: "45"
  },
  {
    Category: "Mental Health",
    ID: "437",
    Parent: "45"
  },
  {
    Category: "Nursing",
    ID: "418",
    Parent: "45"
  },
  {
    Category: "Nutrition",
    ID: "456",
    Parent: "45"
  },
  {
    Category: "Oral & Dental Care",
    ID: "245",
    Parent: "45"
  },
  {
    Category: "Pediatrics",
    ID: "645",
    Parent: "45"
  },
  {
    Category: "Pharmacy",
    ID: "248",
    Parent: "45"
  },
  {
    Category: "Public Health",
    ID: "947",
    Parent: "45"
  },
  {
    Category: "Reproductive Health",
    ID: "195",
    Parent: "45"
  },
  {
    Category: "Substance Abuse",
    ID: "257",
    Parent: "45"
  },
  {
    Category: "Vision Care",
    ID: "246",
    Parent: "45"
  },
  {
    Category: "Women's Health",
    ID: "648",
    Parent: "45"
  },
  {
    Category: "Clubs & Organizations",
    ID: "189",
    Parent: "65"
  },
  {
    Category: "Contests, Awards & Prizes",
    ID: "1276",
    Parent: "65"
  },
  {
    Category: "Crafts",
    ID: "284",
    Parent: "65"
  },
  {
    Category: "Outdoors",
    ID: "688",
    Parent: "65"
  },
  {
    Category: "Paintball",
    ID: "786",
    Parent: "65"
  },
  {
    Category: "Radio Control & Modeling",
    ID: "787",
    Parent: "65"
  },
  {
    Category: "Recreational Aviation",
    ID: "999",
    Parent: "65"
  },
  {
    Category: "Special Occasions",
    ID: "977",
    Parent: "65"
  },
  {
    Category: "Water Activities",
    ID: "1002",
    Parent: "65"
  },
  {
    Category: "Bed & Bath",
    ID: "948",
    Parent: "11"
  },
  {
    Category: "Domestic Services",
    ID: "472",
    Parent: "11"
  },
  {
    Category: "Gardening & Landscaping",
    ID: "269",
    Parent: "11"
  },
  {
    Category: "HVAC & Climate Control",
    ID: "828",
    Parent: "11"
  },
  {
    Category: "Home Appliances",
    ID: "271",
    Parent: "11"
  },
  {
    Category: "Home Furnishings",
    ID: "270",
    Parent: "11"
  },
  {
    Category: "Home Improvement",
    ID: "158",
    Parent: "11"
  },
  {
    Category: "Home Storage & Shelving",
    ID: "1348",
    Parent: "11"
  },
  {
    Category: "Homemaking & Interior Decor",
    ID: "137",
    Parent: "11"
  },
  {
    Category: "Kitchen & Dining",
    ID: "951",
    Parent: "11"
  },
  {
    Category: "Laundry",
    ID: "1364",
    Parent: "11"
  },
  {
    Category: "Nursery & Playroom",
    ID: "1372",
    Parent: "11"
  },
  {
    Category: "Pest Control",
    ID: "471",
    Parent: "11"
  },
  {
    Category: "Swimming Pools & Spas",
    ID: "952",
    Parent: "11"
  },
  {
    Category: "Yard & Patio",
    ID: "953",
    Parent: "11"
  },
  {
    Category: "Communications Equipment",
    ID: "385",
    Parent: "13"
  },
  {
    Category: "Email & Messaging",
    ID: "394",
    Parent: "13"
  },
  {
    Category: "Mobile & Wireless",
    ID: "382",
    Parent: "13"
  },
  {
    Category: "Search Engines",
    ID: "485",
    Parent: "13"
  },
  {
    Category: "Service Providers",
    ID: "383",
    Parent: "13"
  },
  {
    Category: "Teleconferencing",
    ID: "392",
    Parent: "13"
  },
  {
    Category: "Web Apps & Online Tools",
    ID: "1142",
    Parent: "13"
  },
  {
    Category: "Web Portals",
    ID: "301",
    Parent: "13"
  },
  {
    Category: "Web Services",
    ID: "302",
    Parent: "13"
  },
  {
    Category: "Education",
    ID: "74",
    Parent: "958"
  },
  {
    Category: "Internships",
    ID: "1471",
    Parent: "958"
  },
  {
    Category: "Jobs",
    ID: "60",
    Parent: "958"
  },
  {
    Category: "Government",
    ID: "76",
    Parent: "19"
  },
  {
    Category: "Legal",
    ID: "75",
    Parent: "19"
  },
  {
    Category: "Military",
    ID: "366",
    Parent: "19"
  },
  {
    Category: "Public Safety",
    ID: "166",
    Parent: "19"
  },
  {
    Category: "Social Services",
    ID: "508",
    Parent: "19"
  },
  {
    Category: "Broadcast & Network News",
    ID: "112",
    Parent: "16"
  },
  {
    Category: "Business News",
    ID: "784",
    Parent: "16"
  },
  {
    Category: "Gossip & Tabloid News",
    ID: "507",
    Parent: "16"
  },
  {
    Category: "Health News",
    ID: "1253",
    Parent: "16"
  },
  {
    Category: "Journalism & News Industry",
    ID: "1204",
    Parent: "16"
  },
  {
    Category: "Local News",
    ID: "572",
    Parent: "16"
  },
  {
    Category: "Newspapers",
    ID: "408",
    Parent: "16"
  },
  {
    Category: "Politics",
    ID: "396",
    Parent: "16"
  },
  {
    Category: "Sports News",
    ID: "1077",
    Parent: "16"
  },
  {
    Category: "Technology News",
    ID: "785",
    Parent: "16"
  },
  {
    Category: "Weather",
    ID: "63",
    Parent: "16"
  },
  {
    Category: "World News",
    ID: "1209",
    Parent: "16"
  },
  {
    Category: "Blogging Resources & Services",
    ID: "504",
    Parent: "299"
  },
  {
    Category: "Dating & Personals",
    ID: "55",
    Parent: "299"
  },
  {
    Category: "Feed Aggregation & Social Bookmarking",
    ID: "1482",
    Parent: "299"
  },
  {
    Category: "File Sharing & Hosting",
    ID: "321",
    Parent: "299"
  },
  {
    Category: "Forum & Chat Providers",
    ID: "191",
    Parent: "299"
  },
  {
    Category: "Online Goodies",
    ID: "43",
    Parent: "299"
  },
  {
    Category: "Online Journals & Personal Sites",
    ID: "582",
    Parent: "299"
  },
  {
    Category: "Photo & Video Sharing",
    ID: "275",
    Parent: "299"
  },
  {
    Category: "Social Networks",
    ID: "529",
    Parent: "299"
  },
  {
    Category: "Virtual Worlds",
    ID: "972",
    Parent: "299"
  },
  {
    Category: "Disabled & Special Needs",
    ID: "677",
    Parent: "14"
  },
  {
    Category: "Ethnic & Identity Groups",
    ID: "56",
    Parent: "14"
  },
  {
    Category: "Family & Relationships",
    ID: "1131",
    Parent: "14"
  },
  {
    Category: "Men's Interests",
    ID: "594",
    Parent: "14"
  },
  {
    Category: "Religion & Belief",
    ID: "59",
    Parent: "14"
  },
  {
    Category: "Seniors & Retirement",
    ID: "298",
    Parent: "14"
  },
  {
    Category: "Social Issues & Advocacy",
    ID: "54",
    Parent: "14"
  },
  {
    Category: "Social Sciences",
    ID: "509",
    Parent: "14"
  },
  {
    Category: "Subcultures & Niche Interests",
    ID: "502",
    Parent: "14"
  },
  {
    Category: "Women's Interests",
    ID: "325",
    Parent: "14"
  },
  {
    Category: "Animal Products & Services",
    ID: "882",
    Parent: "66"
  },
  {
    Category: "Pets",
    ID: "563",
    Parent: "66"
  },
  {
    Category: "Wildlife",
    ID: "119",
    Parent: "66"
  },
  {
    Category: "Apartments & Residential Rentals",
    ID: "378",
    Parent: "29"
  },
  {
    Category: "Bank-Owned & Foreclosed Properties",
    ID: "1460",
    Parent: "29"
  },
  {
    Category: "Commercial & Investment Real Estate",
    ID: "1178",
    Parent: "29"
  },
  {
    Category: "Property Development",
    ID: "687",
    Parent: "29"
  },
  {
    Category: "Property Inspections & Appraisals",
    ID: "463",
    Parent: "29"
  },
  {
    Category: "Property Management",
    ID: "425",
    Parent: "29"
  },
  {
    Category: "Real Estate Agencies",
    ID: "96",
    Parent: "29"
  },
  {
    Category: "Real Estate Listings",
    ID: "1080",
    Parent: "29"
  },
  {
    Category: "Timeshares & Vacation Properties",
    ID: "1081",
    Parent: "29"
  },
  {
    Category: "Directories & Listings",
    ID: "527",
    Parent: "533"
  },
  {
    Category: "General Reference",
    ID: "980",
    Parent: "533"
  },
  {
    Category: "Geographic Reference",
    ID: "1084",
    Parent: "533"
  },
  {
    Category: "Humanities",
    ID: "474",
    Parent: "533"
  },
  {
    Category: "Language Resources",
    ID: "108",
    Parent: "533"
  },
  {
    Category: "Libraries & Museums",
    ID: "375",
    Parent: "533"
  },
  {
    Category: "Technical Reference",
    ID: "1233",
    Parent: "533"
  },
  {
    Category: "Astronomy",
    ID: "435",
    Parent: "174"
  },
  {
    Category: "Biological Sciences",
    ID: "440",
    Parent: "174"
  },
  {
    Category: "Chemistry",
    ID: "505",
    Parent: "174"
  },
  {
    Category: "Computer Science",
    ID: "1227",
    Parent: "174"
  },
  {
    Category: "Earth Sciences",
    ID: "1168",
    Parent: "174"
  },
  {
    Category: "Ecology & Environment",
    ID: "442",
    Parent: "174"
  },
  {
    Category: "Engineering & Technology",
    ID: "231",
    Parent: "174"
  },
  {
    Category: "Mathematics",
    ID: "436",
    Parent: "174"
  },
  {
    Category: "Physics",
    ID: "444",
    Parent: "174"
  },
  {
    Category: "Scientific Equipment",
    ID: "445",
    Parent: "174"
  },
  {
    Category: "Scientific Institutions",
    ID: "446",
    Parent: "174"
  },
  {
    Category: "Antiques & Collectibles",
    ID: "64",
    Parent: "18"
  },
  {
    Category: "Apparel",
    ID: "68",
    Parent: "18"
  },
  {
    Category: "Auctions",
    ID: "292",
    Parent: "18"
  },
  {
    Category: "Classifieds",
    ID: "61",
    Parent: "18"
  },
  {
    Category: "Consumer Resources",
    ID: "69",
    Parent: "18"
  },
  {
    Category: "Discount & Outlet Stores",
    ID: "1505",
    Parent: "18"
  },
  {
    Category: "Entertainment Media",
    ID: "1143",
    Parent: "18"
  },
  {
    Category: "Gifts & Special Event Items",
    ID: "70",
    Parent: "18"
  },
  {
    Category: "Green & Eco-Friendly Shopping",
    ID: "1507",
    Parent: "18"
  },
  {
    Category: "Luxury Goods",
    ID: "696",
    Parent: "18"
  },
  {
    Category: "Mass Merchants & Department Stores",
    ID: "73",
    Parent: "18"
  },
  {
    Category: "Photo & Video Services",
    ID: "576",
    Parent: "18"
  },
  {
    Category: "Shopping Portals & Search Engines",
    ID: "531",
    Parent: "18"
  },
  {
    Category: "Swap Meets & Outdoor Markets",
    ID: "1210",
    Parent: "18"
  },
  {
    Category: "Tobacco Products",
    ID: "123",
    Parent: "18"
  },
  {
    Category: "Toys",
    ID: "432",
    Parent: "18"
  },
  {
    Category: "Wholesalers & Liquidators",
    ID: "1225",
    Parent: "18"
  },
  {
    Category: "College Sports",
    ID: "1073",
    Parent: "20"
  },
  {
    Category: "Combat Sports",
    ID: "514",
    Parent: "20"
  },
  {
    Category: "Extreme Sports",
    ID: "554",
    Parent: "20"
  },
  {
    Category: "Fantasy Sports",
    ID: "998",
    Parent: "20"
  },
  {
    Category: "Individual Sports",
    ID: "1000",
    Parent: "20"
  },
  {
    Category: "Motor Sports",
    ID: "180",
    Parent: "20"
  },
  {
    Category: "Sport Scores & Statistics",
    ID: "1599",
    Parent: "20"
  },
  {
    Category: "Sporting Goods",
    ID: "263",
    Parent: "20"
  },
  {
    Category: "Sports Coaching & Training",
    ID: "1082",
    Parent: "20"
  },
  {
    Category: "Team Sports",
    ID: "1001",
    Parent: "20"
  },
  {
    Category: "Water Sports",
    ID: "118",
    Parent: "20"
  },
  {
    Category: "Winter Sports",
    ID: "265",
    Parent: "20"
  },
  {
    Category: "World Sports Competitions",
    ID: "1198",
    Parent: "20"
  },
  {
    Category: "Air Travel",
    ID: "203",
    Parent: "67"
  },
  {
    Category: "Bus & Rail",
    ID: "708",
    Parent: "67"
  },
  {
    Category: "Car Rental & Taxi Services",
    ID: "205",
    Parent: "67"
  },
  {
    Category: "Carpooling & Vehicle Sharing",
    ID: "1339",
    Parent: "67"
  },
  {
    Category: "Cruises & Charters",
    ID: "206",
    Parent: "67"
  },
  {
    Category: "Hotels & Accommodations",
    ID: "179",
    Parent: "67"
  },
  {
    Category: "Luggage & Travel Accessories",
    ID: "1003",
    Parent: "67"
  },
  {
    Category: "Specialty Travel",
    ID: "1004",
    Parent: "67"
  },
  {
    Category: "Tourist Destinations",
    ID: "208",
    Parent: "67"
  },
  {
    Category: "Travel Agencies & Services",
    ID: "1010",
    Parent: "67"
  },
  {
    Category: "Travel Guides & Travelogues",
    ID: "1011",
    Parent: "67"
  },
  {
    Category: "Africa",
    ID: "5001",
    Parent: "5000"
  },
  {
    Category: "Asia",
    ID: "5028",
    Parent: "5000"
  },
  {
    Category: "Europe",
    ID: "5104",
    Parent: "5000"
  },
  {
    Category: "Latin America",
    ID: "5203",
    Parent: "5000"
  },
  {
    Category: "Middle East",
    ID: "5588",
    Parent: "5000"
  },
  {
    Category: "North America",
    ID: "5237",
    Parent: "5000"
  },
  {
    Category: "Oceania",
    ID: "5335",
    Parent: "5000"
  },
  {
    Category: "Polar Regions",
    ID: "5353",
    Parent: "5000"
  }
];




})();

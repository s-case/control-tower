(function(){

  var app = angular.module('QAApp', []);
  app.controller('QAController',function(){
  	this.projects = projects
  	this.reqs = requirements;
  	this.usecases = usecases;
  	this.activitydiagrams=activitydiagrams;
  	this.classdiagrams=classdiagrams;
  	this.storyboards=storyboards;
  	this.sourcecodes=sourcecodes;
  	this.scaseservices=scaseservices;
  });
  var projects = //call to get the projects through S-CASE artefacts repo

  var requirements = //call to get the requirements through S-CASE artefacts repo
  /*Requirement details
  	type: "textual"
	belongsTo: projectId
	link: link to file (file may contain multiple reqs)
	language : ISO-639-3 language code (always eng) 
	text: "The user must be able to ..."
	requirement: "functional" or "non-functional"
  */
  var usecasediagrams = //call to get the usecase diagrams through S-CASE artefacts repo
  /* Use case diagrams details
	type: "use case"
	format: "image" or "xmi"
	link: link to file
	relation: relation to xmi if image and viceversa
	belongsTo: projectId
	actors: ["actor1", "actor2", ...]
	use cases: ["use case 1", "use case 2", ...]
  */
  var activitydiagrams = //call to get the activity diagrams through S-CASE artefacts repo
  /*Activity diagrams details
	type: "activity diagram"
	format: "image" or "xmi"
	link: link to file
	relation: relation to xmi if image and viceversa
	belongsTo: projectId
	actions: ["action1", "action2", ...]
  */
  var classdiagrams = //call to get the class diagramms through S-CASE artefacts repo
  /* Analysis Class diagrams details
	type: "analysis class diagram"
	format: "image" or "xmi"
	link: link to file
	relation: relation to xmi if image and viceversa
	belongsTo: projectId
	classes: [{name: "class1", properties: [{name: "prop1", type: "string"}], relatedTo: ["class2", "class3"]}]
  */
  var storyboards = //call to get the class diagramms through S-CASE artefacts repo
  /* Storyboards details
	type: "storyboard"
	format: "image" or "xmi"
	link: link to file
	relation: relation to xmi if image and viceversa
	belongsTo: projectId
	actions: ["action1", "action2", ...]
  */
  var sourcecodes = //call to get the sourcecodes through S-CASE artefacts repo
  /* Source code details
	type: "code"
	belongsTo: projectId
	link: link to zip
  */
  var scaseservices = //call to get the scase services through S-CASE artefacts repo
  /* S-CASE services details
	type: "service description"
	belongsTo: projectId
	link: link to file
	domainOntology: link to domain ontology residing in the ontology repo
  */

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






})();

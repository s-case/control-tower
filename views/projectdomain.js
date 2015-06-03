(function(){
	var app = angular.module('domainApp', ['ngSanitize', 'ui.select']);
  	//controloller to perform the search to the S-CASE artefacts repo
  	app.controller('domainController',['$http',function($http){
      
      
  		var ProjectPage  = this;//we set this to a variable in order to use it in http
	  	ProjectPage.domains=[];//we are going to save the all the domains (all the domains from Google Verticals) here
	  	ProjectPage.subdomains=[];//we are going to save all subdomains (domains level 2 (with only one parent above)) here
	  	//ProjectPage.domains=parentDomains;//we are saving here the level 1 domains (the ones that do not have parent, (they have parent 0))
	  	$http.get('parentDomains.json').then(function(res){
        ProjectPage.domains=res.data;
        console.log(ProjectPage.domains)
      });
      ProjectPage.subdomainsTotal = [];
      $http.get('subDomains.json').then(function(res){
        ProjectPage.subdomainsTotal=res.data;
      });
	  	ProjectPage.projectDetails = {};//it will contain the information of the specific project we examine/edit
	  	//it will contain the following:
	  	//projectDetails.domainset: the domain of the project
	  	//projectDetails.subdomainset: the subdomain of project

	  	var subdomainsSelected = [];//it will contain all the subdomains that correspond to the domain selected
      //the function finds all the subdomains (domains level 2) for a provided parent domain
	  	this.subdomainJSON = function (domainSelected){
        ProjectPage.DomainSubdomainSelectSuccess=0//we set the flag for the alert message to zero in order not to display either success or danger message
	  		subdomainsSelected = [];//we initialize the subdomains selected
  			for(var i=0;i<ProjectPage.subdomainsTotal.length;i++){//we loop over all the subdomains 
					var flag_parent_found=0;//flag for finding the domainSelected as parent domain in the parentDomains
					for(var j=0;j<ProjectPage.domains.length;j++){
						if(ProjectPage.subdomainsTotal[i].Parent==domainSelected.ID&&flag_parent_found==0){//if the parent ID of a subdomain equals to the ID of the domain selected then this subdomain should be pushed to the subdomains to be presented to the user
							subdomainsSelected.push(ProjectPage.subdomainsTotal[i]);
							flag_parent_found=1;
						}
					}
				}
        ProjectPage.subdomains = subdomainsSelected;
        ProjectPage.projectDetails.subdomainset = [];
        //console.log(ProjectPage.subdomains);
      };
      this.subdomainJSONifAlreadySubdomainSelected = function (domainSelected){
        ProjectPage.DomainSubdomainSelectSuccess=0//we set the flag for the alert message to zero in order not to display either success or danger message
        subdomainsSelected = [];
        var domainID;
        for(var j=0;j<ProjectPage.domains.length;j++){
          if(ProjectPage.domains[j].Category===domainSelected.Category){
            domainID=ProjectPage.domains[j].ID;
            //console.log(domainID)
          }
        }
        if(domainSelected.Category!="All"){
          for(var i=0;i<ProjectPage.subdomainsTotal.length;i++){
            var flag_parent_found=0;
            for(var j=0;j<ProjectPage.domains.length;j++){
                if(ProjectPage.subdomainsTotal[i].Parent==domainID&&flag_parent_found==0){
                  subdomainsSelected.push(ProjectPage.subdomainsTotal[i]);
                  flag_parent_found=1;
                }
            }
          }
        }
        ProjectPage.subdomains = subdomainsSelected;
        //console.log(ProjectPage.subdomains);
      };

      this.init = function(){
        var currentProjectName = window.projectCurrent;   
        $http({
          url: 'http://scouter.ee.auth.gr:3000/getDomainSubdomain',
          method: "GET",
          params: {
            project_name: currentProjectName
          }
        })
        .success(function(data){
          console.log('Domain and Subdomain Got');
          ProjectPage.projectDetails.domainset=data[0];
          ProjectPage.projectDetails.subdomainset=data[1];
          ProjectPage.subdomainJSONifAlreadySubdomainSelected(ProjectPage.projectDetails.domainset);
        })
        .error(function(status){
          console.log(status);
        });
      };
      //function to set the new Domain and subdomain
      this.setDomainSubdomain = function(domain,subdomain){
        var currentDomain = domain;
        var currentSubdomain = subdomain;
        var currentProjectName = window.projectCurrent;
        ProjectPage.DomainSubdomainSelectSuccess=0; //flag to be used for the success or failure of the domain and subdomain set  
        $http({
          url: 'http://scouter.ee.auth.gr:3000/changeDomainSubdomain',
          method: "GET",
          params: {
            domain: currentDomain,
            subdomain: currentSubdomain,
            project_name: currentProjectName
          }
        })
        .success(function(data){
          console.log('Domain and Subdomain Set');
          ProjectPage.DomainSubdomainSelectSuccess=1;
        })
        .error(function(status){
          console.log(status);
          ProjectPage.DomainSubdomainSelectSuccess=2;
        });
      };

      this.subdomainsDisabled = function (){
        if(!ProjectPage.subdomains.length&&!ProjectPage.projectDetails.subdomainset){
          return true;
        }
        else{
          return false;
        }

      };

  	}]);

})();

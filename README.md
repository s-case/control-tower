# S-CASE Authentication

url: http://scouter.ee.auth.gr:3000

API details

===Check if a user is valid===
- endpoint
	- /api/validateUser
- parameters
	- scase_token [to check if a provided token corresponds to a user]

===Check if a user has a Role in a project (Owner or collaborator)===
- endpoint
	- /api/validateUser
- parameters
	- scase_token [to check if a provided token corresponds to a user]
	- project_name [in combination with scase_token to check if a user has a Role(collaborator or owner) in a project]

===Delete a User===
- endpoint
	- /api/deleteUser
- parameters
	- scase_token [to check if a provided token corresponds to a user]

===Refresh the S-Case token===
- endpoint
	- /api/refreshSCASEtoken
- parameters
	- scase_token [to check if a provided token corresponds to a user]

===Display the Projects a User Owns===
- endpoint
	- /api/displayProjectsOwn
- parameters
	- scase_token [to check if a provided token corresponds to a user]

===Display the Projects a User Collaborates on===
- endpoint
	- /api/displayProjectsCollab
- parameters
	- scase_token [to check if a provided token corresponds to a user]

===Display the owners and collaborators of a project===
- endpoint
	- /api/displayOwnersCollabs
- parameters
	- scase_token [to check if a provided token corresponds to a user]
	- project_name [the project name of which the owners and collaborators to display]

===Add a collaborator in a project I own===
- endpoint
	- /api/addCollabProjOwn
- parameters
	- scase_token [to check if a provided token corresponds to a user and the user is an owner of the project]
	- project_name [the project to add a collaborator]
	github_name [the github name of the user to add as collaborator]

===Add an owner in a project I own===
- endpoint
	- /api/addOwnerProjOwn
- parameters
	- scase_token [to check if a provided token corresponds to a user and the user is an owner of the project]
	- project_name [the project to add an owner]
	github_name [the github name of the user to add as owner]

===Remove a collaborator a project I own===
- endpoint
	- /api/removeCollabProjOwn
parameters
	- scase_token [to check if a provided token corresponds to a user and the user is an owner of the project]
	- project_name [the project to remove a collaborator]
	github_name [the github name of the user to remove from collaborator]


===Remove an owner from a project I own===
- endpoint
	- /api/removeOwnerProjOwn
- parameters
	- scase_token [to check if a provided token corresponds to a user and the user is an owner of the project]
	- project_name [the project to remove owner]
	github_name [the github name of the user to remove from owner]
	

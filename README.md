# S-CASE Authentication

###Start with node server.js or node forever.js
url: http://scouter.ee.auth.gr:3000

##API details
```html
<head><title>S-CASE Control Tower API API documentation</title><meta http-equiv="X-UA-Compatible" content="IE=edge"><meta http-equiv="Content-Type" content="text/html; charset=utf-8"><meta name="generator" content="https://github.com/kevinrenskers/raml2html 2.0.1"><link rel="stylesheet" href="https://netdna.bootstrapcdn.com/bootstrap/3.1.1/css/bootstrap.min.css"><link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/8.1/styles/default.min.css"><script type="text/javascript" src="https://code.jquery.com/jquery-1.11.0.min.js"></script><script type="text/javascript" src="https://netdna.bootstrapcdn.com/bootstrap/3.1.1/js/bootstrap.min.js"></script><script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/8.1/highlight.min.js"></script><script type="text/javascript">
      $(document).ready(function() {
        $('.page-header pre code, .top-resource-description pre code').each(function(i, block) {
          hljs.highlightBlock(block);
        });

        $('[data-toggle]').click(function() {
          var selector = $(this).data('target') + ' pre code';
          $(selector).each(function(i, block) {
            hljs.highlightBlock(block);
          });
        });

        // open modal on hashes like #_action_get
        $(window).bind('hashchange', function(e) {
          var anchor_id = document.location.hash.substr(1); //strip #
          var element = $('#' + anchor_id);

          // do we have such element + is it a modal?  --> show it
          if (element.length && element.hasClass('modal')) {
            element.modal('show');
          }
        });

        // execute hashchange on first page load
        $(window).trigger('hashchange');

        // remove url fragment on modal hide
        $('.modal').on('hidden.bs.modal', function() {
          if(history && history.replaceState) {
            history.replaceState({}, '', '#');
          }
        });
      });
    </script><style>
      .hljs {
        background: transparent;
      }
      .parent {
        color: #999;
      }
      .list-group-item > .badge {
        float: none;
        margin-right: 6px;
      }
      .panel-title > .methods {
        float: right;
      }
      .badge {
        border-radius: 0;
        text-transform: uppercase;
        width: 70px;
        font-weight: normal;
        color: #f3f3f6;
        line-height: normal;
      }
      .badge_get {
        background-color: #63a8e2;
      }
      .badge_post {
        background-color: #6cbd7d;
      }
      .badge_put {
        background-color: #22bac4;
      }
      .badge_delete {
        background-color: #d26460;
      }
      .badge_patch {
        background-color: #ccc444;
      }
      .list-group, .panel-group {
        margin-bottom: 0;
      }
      .panel-group .panel+.panel-white {
        margin-top: 0;
      }
      .panel-group .panel-white {
        border-bottom: 1px solid #F5F5F5;
        border-radius: 0;
      }
      .panel-white:last-child {
        border-bottom-color: white;
        -webkit-box-shadow: none;
        box-shadow: none;
      }
      .panel-white .panel-heading {
        background: white;
      }
      .tab-pane ul {
        padding-left: 2em;
      }
      .tab-pane h2 {
        font-size: 1.2em;
        padding-bottom: 4px;
        border-bottom: 1px solid #ddd;
      }
      .tab-pane h3 {
        font-size: 1.1em;
      }
      .tab-content {
        border-left: 1px solid #ddd;
        border-right: 1px solid #ddd;
        border-bottom: 1px solid #ddd;
        padding: 10px;
      }
      #sidebar {
        margin-top: 30px;
        padding-right: 5px;
        overflow: auto;
        height: 90%;
      }
      .top-resource-description {
        border-bottom: 1px solid #ddd;
        background: #fcfcfc;
        padding: 15px 15px 0 15px;
        margin: -15px -15px 10px -15px;
      }
      .resource-description {
        border-bottom: 1px solid #fcfcfc;
        background: #fcfcfc;
        padding: 15px 15px 0 15px;
        margin: -15px -15px 10px -15px;
      }
      .resource-description p:last-child {
        margin: 0;
      }
      .list-group .badge {
        float: left;
      }
      .method_description {
        margin-left: 85px;
      }
      .method_description p:last-child {
        margin: 0;
      }
      .list-group-item {
        cursor: pointer;
      }
      .list-group-item:hover {
        background-color: #f5f5f5;
      }
    </style></head><body data-spy="scroll" data-target="#sidebar"><div class="container"><div class="row"><div class="col-md-9" role="main"><div class="page-header"><h1>S-CASE Control Tower API API documentation <small>version 1.0</small></h1><p></p></div><div class="panel panel-default"><div class="panel-heading"><h3 id="addCollabProjOwn" class="panel-title">/addCollabProjOwn</h3></div><div class="panel-body"><div class="top-resource-description"><p>Add a Collaborator to a project I own.</p></div><div class="panel-group"><div class="panel panel-white"><div class="panel-heading"><h4 class="panel-title"><a class="collapsed" data-toggle="collapse" href="#panel_addCollabProjOwn"><span class="parent"></span>/addCollabProjOwn</a> <span class="methods"><a href="#addCollabProjOwn_put"><span class="badge badge_put">put</span></a></span></h4></div><div id="panel_addCollabProjOwn" class="panel-collapse collapse"><div class="panel-body"><div class="list-group"><div onclick="window.location.href = '#addCollabProjOwn_put'" class="list-group-item"><span class="badge badge_put">put</span><div class="method_description"><p>Add a Collaborator to a project I own by providing either the user&#39;s github username or the user&#39;s google e-mail account.</p></div><div class="clearfix"></div></div></div></div></div><div class="modal fade" tabindex="0" id="addCollabProjOwn_put"><div class="modal-dialog"><div class="modal-content"><div class="modal-header"><button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button><h4 class="modal-title" id="myModalLabel"><span class="badge badge_put">put</span> <span class="parent"></span>/addCollabProjOwn</h4></div><div class="modal-body"><div class="alert alert-info"><p>Add a Collaborator to a project I own by providing either the user&#39;s github username or the user&#39;s google e-mail account.</p></div><ul class="nav nav-tabs"><li class="active"><a href="#addCollabProjOwn_put_request" data-toggle="tab">Request</a></li><li><a href="#addCollabProjOwn_put_response" data-toggle="tab">Response</a></li></ul><div class="tab-content"><div class="tab-pane active" id="addCollabProjOwn_put_request"><h3>Query Parameters</h3><ul><li><strong>scase_token</strong>: <em>required (string)</em><p>The S-CASE token that is taken from the profile of the user in the Control Tower Interface.</p></li><li><strong>scase_signature</strong>: <em>required (string)</em><p>The signature produced using JWT default settings. The S-CASE token is signed using the S-CASE secret taken from the profile of the user in the Control Tower Interface.</p></li><li><strong>project_name</strong>: <em>required (string)</em><p>The name of the project that we would like to modify.</p></li><li><strong>github_name</strong>: <em>(string)</em><p>The github username of the user that we would like to add a collaborator.</p></li><li><strong>google_email</strong>: <em>(string)</em><p>The google e-mail of the user that we would like to add a collaborator.</p></li></ul></div><div class="tab-pane" id="addCollabProjOwn_put_response"><h2>HTTP status code <a href="http://httpstatus.es/201" target="_blank">201</a></h2><p>Successful addition of a collaborator</p><h3>Body</h3><p><strong>Type: application/json</strong></p><p><strong>Example</strong>:</p><pre><code>{ 
  "message" : "collaborator johndoe@gmail.com (or johndoeUsername) added"
}
</code></pre><h2>HTTP status code <a href="http://httpstatus.es/400" target="_blank">400</a></h2><p>The request misses some parameters</p><h3>Body</h3><p><strong>Type: application/json</strong></p><p><strong>Example</strong>:</p><pre><code>{ 
  "message" : "you miss some parameters"
}
</code></pre><h2>HTTP status code <a href="http://httpstatus.es/401" target="_blank">401</a></h2><p>The provided scase_token does not correspond to an owner of the project</p><h3>Body</h3><p><strong>Type: application/json</strong></p><p><strong>Example</strong>:</p><pre><code>{ 
  "message" : "User with this scase_token is not owner of the project"
}
</code></pre><h2>HTTP status code <a href="http://httpstatus.es/404" target="_blank">404</a></h2><p>The provided scase_signature or scase_token do not correspond to a user of S-CASE</p><h3>Body</h3><p><strong>Type: application/json</strong></p><p><strong>Example</strong>:</p><pre><code>{ 
  "message" : "user  with this scase_signature (or this scase_token) does not exist in S-Case"
}
</code></pre><h2>HTTP status code <a href="http://httpstatus.es/500" target="_blank">500</a></h2><p>Error of the MySQL database</p><h3>Body</h3><p><strong>Type: application/json</strong></p><p><strong>Example</strong>:</p><pre><code>{ 
  "message" : "error description"
}
</code></pre></div></div></div></div></div></div></div></div></div></div><div class="panel panel-default"><div class="panel-heading"><h3 id="addOwnerProjOwn" class="panel-title">/addOwnerProjOwn</h3></div><div class="panel-body"><div class="top-resource-description"><p>Add an owner to a project I own.</p></div><div class="panel-group"><div class="panel panel-white"><div class="panel-heading"><h4 class="panel-title"><a class="collapsed" data-toggle="collapse" href="#panel_addOwnerProjOwn"><span class="parent"></span>/addOwnerProjOwn</a> <span class="methods"><a href="#addOwnerProjOwn_put"><span class="badge badge_put">put</span></a></span></h4></div><div id="panel_addOwnerProjOwn" class="panel-collapse collapse"><div class="panel-body"><div class="list-group"><div onclick="window.location.href = '#addOwnerProjOwn_put'" class="list-group-item"><span class="badge badge_put">put</span><div class="method_description"><p>Add an Owner to a project I own by providing either the user&#39;s github username or the user&#39;s google e-mail account.</p></div><div class="clearfix"></div></div></div></div></div><div class="modal fade" tabindex="0" id="addOwnerProjOwn_put"><div class="modal-dialog"><div class="modal-content"><div class="modal-header"><button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button><h4 class="modal-title" id="myModalLabel"><span class="badge badge_put">put</span> <span class="parent"></span>/addOwnerProjOwn</h4></div><div class="modal-body"><div class="alert alert-info"><p>Add an Owner to a project I own by providing either the user&#39;s github username or the user&#39;s google e-mail account.</p></div><ul class="nav nav-tabs"><li class="active"><a href="#addOwnerProjOwn_put_request" data-toggle="tab">Request</a></li><li><a href="#addOwnerProjOwn_put_response" data-toggle="tab">Response</a></li></ul><div class="tab-content"><div class="tab-pane active" id="addOwnerProjOwn_put_request"><h3>Query Parameters</h3><ul><li><strong>scase_token</strong>: <em>required (string)</em><p>The S-CASE token that is taken from the profile of the user in the Control Tower Interface.</p></li><li><strong>scase_signature</strong>: <em>required (string)</em><p>The signature produced using JWT default settings. The S-CASE token is signed using the S-CASE secret taken from the profile of the user in the Control Tower Interface.</p></li><li><strong>project_name</strong>: <em>required (string)</em><p>The name of the project that we would like to modify.</p></li><li><strong>github_name</strong>: <em>(string)</em><p>The github username of the user that we would like to add an owner.</p></li><li><strong>google_email</strong>: <em>(string)</em><p>The google e-mail of the user that we would like to add an owner.</p></li></ul></div><div class="tab-pane" id="addOwnerProjOwn_put_response"><h2>HTTP status code <a href="http://httpstatus.es/201" target="_blank">201</a></h2><p>Successful addition of an owner</p><h3>Body</h3><p><strong>Type: application/json</strong></p><p><strong>Example</strong>:</p><pre><code>{ 
  "message" : "owner johndoe@gmail.com (or johndoeUsername) added"
}
</code></pre><h2>HTTP status code <a href="http://httpstatus.es/400" target="_blank">400</a></h2><p>The request misses some parameters</p><h3>Body</h3><p><strong>Type: application/json</strong></p><p><strong>Example</strong>:</p><pre><code>{ 
  "message" : "you miss some parameters"
}
</code></pre><h2>HTTP status code <a href="http://httpstatus.es/401" target="_blank">401</a></h2><p>The provided scase_token does not correspond to an owner of the project</p><h3>Body</h3><p><strong>Type: application/json</strong></p><p><strong>Example</strong>:</p><pre><code>{ 
  "message" : "User with this scase_token is not owner of the project"
}
</code></pre><h2>HTTP status code <a href="http://httpstatus.es/404" target="_blank">404</a></h2><p>The provided scase_signature or scase_token do not correspond to a user of S-CASE</p><h3>Body</h3><p><strong>Type: application/json</strong></p><p><strong>Example</strong>:</p><pre><code>{ 
  "message" : "user  with this scase_signature (or this scase_token) does not exist in S-Case"
}
</code></pre><h2>HTTP status code <a href="http://httpstatus.es/500" target="_blank">500</a></h2><p>Error of the MySQL database</p><h3>Body</h3><p><strong>Type: application/json</strong></p><p><strong>Example</strong>:</p><pre><code>{ 
  "message" : "error description"
}
</code></pre></div></div></div></div></div></div></div></div></div></div><div class="panel panel-default"><div class="panel-heading"><h3 id="changeDomainSubdomainProjOwn" class="panel-title">/changeDomainSubdomainProjOwn</h3></div><div class="panel-body"><div class="top-resource-description"><p>Change the domain and subdomain of a project I own.</p></div><div class="panel-group"><div class="panel panel-white"><div class="panel-heading"><h4 class="panel-title"><a class="collapsed" data-toggle="collapse" href="#panel_changeDomainSubdomainProjOwn"><span class="parent"></span>/changeDomainSubdomainProjOwn</a> <span class="methods"><a href="#changeDomainSubdomainProjOwn_post"><span class="badge badge_post">post</span></a></span></h4></div><div id="panel_changeDomainSubdomainProjOwn" class="panel-collapse collapse"><div class="panel-body"><div class="list-group"><div onclick="window.location.href = '#changeDomainSubdomainProjOwn_post'" class="list-group-item"><span class="badge badge_post">post</span><div class="method_description"><p>Change the domain and subdomain of a project I own by providing the project&#39;s name, new domain and subdomain as strings</p></div><div class="clearfix"></div></div></div></div></div><div class="modal fade" tabindex="0" id="changeDomainSubdomainProjOwn_post"><div class="modal-dialog"><div class="modal-content"><div class="modal-header"><button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button><h4 class="modal-title" id="myModalLabel"><span class="badge badge_post">post</span> <span class="parent"></span>/changeDomainSubdomainProjOwn</h4></div><div class="modal-body"><div class="alert alert-info"><p>Change the domain and subdomain of a project I own by providing the project&#39;s name, new domain and subdomain as strings</p></div><ul class="nav nav-tabs"><li class="active"><a href="#changeDomainSubdomainProjOwn_post_request" data-toggle="tab">Request</a></li><li><a href="#changeDomainSubdomainProjOwn_post_response" data-toggle="tab">Response</a></li></ul><div class="tab-content"><div class="tab-pane active" id="changeDomainSubdomainProjOwn_post_request"><h3>Query Parameters</h3><ul><li><strong>scase_token</strong>: <em>required (string)</em><p>The S-CASE token that is taken from the profile of the user in the Control Tower Interface.</p></li><li><strong>scase_signature</strong>: <em>required (string)</em><p>The signature produced using JWT default settings. The S-CASE token is signed using the S-CASE secret taken from the profile of the user in the Control Tower Interface.</p></li><li><strong>project_name</strong>: <em>required (string)</em><p>The name of the project that we would like to modify.</p></li><li><strong>domain</strong>: <em>required (string)</em><p>The domain of the project</p></li><li><strong>subdomain</strong>: <em>required (string)</em><p>The new subdomain of the project</p></li></ul></div><div class="tab-pane" id="changeDomainSubdomainProjOwn_post_response"><h2>HTTP status code <a href="http://httpstatus.es/200" target="_blank">200</a></h2><p>Successful change of the project&#39;s domain and subdomain</p><h3>Body</h3><p><strong>Type: application/json</strong></p><p><strong>Example</strong>:</p><pre><code>{ 
  "message" : "Privacy level of RESTmarks set to PRIVATE "
}
</code></pre><h2>HTTP status code <a href="http://httpstatus.es/400" target="_blank">400</a></h2><p>The request misses some parameters</p><h3>Body</h3><p><strong>Type: application/json</strong></p><p><strong>Example</strong>:</p><pre><code>{ 
  "message" : "you miss some parameters"
}
</code></pre><h2>HTTP status code <a href="http://httpstatus.es/401" target="_blank">401</a></h2><p>The provided scase_signature does not correspond to an owner of the project</p><h3>Body</h3><p><strong>Type: application/json</strong></p><p><strong>Example</strong>:</p><pre><code>{ 
  "message" : "User with this scase_signature is not owner of the project"
}
</code></pre><h2>HTTP status code <a href="http://httpstatus.es/404" target="_blank">404</a></h2><p>The provided scase_signature or scase_token do not correspond to a user of S-CASE or the project name does not correspond to a project in S-CASE</p><h3>Body</h3><p><strong>Type: application/json</strong></p><p><strong>Example</strong>:</p><pre><code>{ 
  "message" : "user  with this scase_signature (or this scase_token) does not exist in S-Case (or There is no project with name RESTmarks)"
}
</code></pre><h2>HTTP status code <a href="http://httpstatus.es/500" target="_blank">500</a></h2><p>Error of the MySQL database</p><h3>Body</h3><p><strong>Type: application/json</strong></p><p><strong>Example</strong>:</p><pre><code>{ 
  "message" : "error description"
}
</code></pre></div></div></div></div></div></div></div></div></div></div><div class="panel panel-default"><div class="panel-heading"><h3 id="changePrivacyProjOwn" class="panel-title">/changePrivacyProjOwn</h3></div><div class="panel-body"><div class="top-resource-description"><p>Change the privacy of a project I own.</p></div><div class="panel-group"><div class="panel panel-white"><div class="panel-heading"><h4 class="panel-title"><a class="collapsed" data-toggle="collapse" href="#panel_changePrivacyProjOwn"><span class="parent"></span>/changePrivacyProjOwn</a> <span class="methods"><a href="#changePrivacyProjOwn_post"><span class="badge badge_post">post</span></a></span></h4></div><div id="panel_changePrivacyProjOwn" class="panel-collapse collapse"><div class="panel-body"><div class="list-group"><div onclick="window.location.href = '#changePrivacyProjOwn_post'" class="list-group-item"><span class="badge badge_post">post</span><div class="method_description"><p>Change the privacy of a project I own by providing the project&#39;s name and privacy level (PUBLIC or PRIVATE) as strings.</p></div><div class="clearfix"></div></div></div></div></div><div class="modal fade" tabindex="0" id="changePrivacyProjOwn_post"><div class="modal-dialog"><div class="modal-content"><div class="modal-header"><button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button><h4 class="modal-title" id="myModalLabel"><span class="badge badge_post">post</span> <span class="parent"></span>/changePrivacyProjOwn</h4></div><div class="modal-body"><div class="alert alert-info"><p>Change the privacy of a project I own by providing the project&#39;s name and privacy level (PUBLIC or PRIVATE) as strings.</p></div><ul class="nav nav-tabs"><li class="active"><a href="#changePrivacyProjOwn_post_request" data-toggle="tab">Request</a></li><li><a href="#changePrivacyProjOwn_post_response" data-toggle="tab">Response</a></li></ul><div class="tab-content"><div class="tab-pane active" id="changePrivacyProjOwn_post_request"><h3>Query Parameters</h3><ul><li><strong>scase_token</strong>: <em>required (string)</em><p>The S-CASE token that is taken from the profile of the user in the Control Tower Interface.</p></li><li><strong>scase_signature</strong>: <em>required (string)</em><p>The signature produced using JWT default settings. The S-CASE token is signed using the S-CASE secret taken from the profile of the user in the Control Tower Interface.</p></li><li><strong>project_name</strong>: <em>required (string)</em><p>The name of the project that we would like to modify.</p></li><li><strong>privacy_level</strong>: <em>required (string)</em><p>The level of privacy of the project (only PUBLIC or PRIVATE are allowed).</p><p><strong>Example</strong>:</p><pre>PUBLIC or PRIVATE</pre></li></ul></div><div class="tab-pane" id="changePrivacyProjOwn_post_response"><h2>HTTP status code <a href="http://httpstatus.es/200" target="_blank">200</a></h2><p>Successful change of the project&#39;s privacy</p><h3>Body</h3><p><strong>Type: application/json</strong></p><p><strong>Example</strong>:</p><pre><code>{ 
  "message" : "Privacy level of RESTmarks set to PRIVATE "
}
</code></pre><h2>HTTP status code <a href="http://httpstatus.es/400" target="_blank">400</a></h2><p>The request misses some parameters</p><h3>Body</h3><p><strong>Type: application/json</strong></p><p><strong>Example</strong>:</p><pre><code>{ 
  "message" : "you miss some parameters"
}
</code></pre><h2>HTTP status code <a href="http://httpstatus.es/401" target="_blank">401</a></h2><p>The provided scase_signature does not correspond to an owner of the project</p><h3>Body</h3><p><strong>Type: application/json</strong></p><p><strong>Example</strong>:</p><pre><code>{ 
  "message" : "User with this scase_signature is not owner of the project"
}
</code></pre><h2>HTTP status code <a href="http://httpstatus.es/404" target="_blank">404</a></h2><p>The provided scase_signature or scase_token do not correspond to a user of S-CASE or the project name does not correspond to a project in S-CASE</p><h3>Body</h3><p><strong>Type: application/json</strong></p><p><strong>Example</strong>:</p><pre><code>{ 
  "message" : "user  with this scase_signature (or this scase_token) does not exist in S-Case (or There is no project with name RESTmarks)"
}
</code></pre><h2>HTTP status code <a href="http://httpstatus.es/500" target="_blank">500</a></h2><p>Error of the MySQL database</p><h3>Body</h3><p><strong>Type: application/json</strong></p><p><strong>Example</strong>:</p><pre><code>{ 
  "message" : "error description"
}
</code></pre></div></div></div></div></div></div></div></div></div></div><div class="panel panel-default"><div class="panel-heading"><h3 id="checkUserRole" class="panel-title">/checkUserRole</h3></div><div class="panel-body"><div class="top-resource-description"><p>Check the user&#39;s role in a specific project</p></div><div class="panel-group"><div class="panel panel-white"><div class="panel-heading"><h4 class="panel-title"><a class="collapsed" data-toggle="collapse" href="#panel_checkUserRole"><span class="parent"></span>/checkUserRole</a> <span class="methods"><a href="#checkUserRole_get"><span class="badge badge_get">get</span></a></span></h4></div><div id="panel_checkUserRole" class="panel-collapse collapse"><div class="panel-body"><div class="list-group"><div onclick="window.location.href = '#checkUserRole_get'" class="list-group-item"><span class="badge badge_get">get</span><div class="method_description"><p>Check the user&#39;s role in a specific project by providing the user&#39;s scase_token, scase_signature and project_name</p></div><div class="clearfix"></div></div></div></div></div><div class="modal fade" tabindex="0" id="checkUserRole_get"><div class="modal-dialog"><div class="modal-content"><div class="modal-header"><button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button><h4 class="modal-title" id="myModalLabel"><span class="badge badge_get">get</span> <span class="parent"></span>/checkUserRole</h4></div><div class="modal-body"><div class="alert alert-info"><p>Check the user&#39;s role in a specific project by providing the user&#39;s scase_token, scase_signature and project_name</p></div><ul class="nav nav-tabs"><li class="active"><a href="#checkUserRole_get_request" data-toggle="tab">Request</a></li><li><a href="#checkUserRole_get_response" data-toggle="tab">Response</a></li></ul><div class="tab-content"><div class="tab-pane active" id="checkUserRole_get_request"><h3>Query Parameters</h3><ul><li><strong>scase_token</strong>: <em>required (string)</em><p>The S-CASE token that is taken from the profile of the user in the Control Tower Interface.</p></li><li><strong>scase_signature</strong>: <em>required (string)</em><p>The signature produced using JWT default settings. The S-CASE token is signed using the S-CASE secret taken from the profile of the user in the Control Tower Interface.</p></li></ul></div><div class="tab-pane" id="checkUserRole_get_response"><h2>HTTP status code <a href="http://httpstatus.es/200" target="_blank">200</a></h2><h3>Body</h3><p><strong>Type: application/json</strong></p><p><strong>Example</strong>:</p><pre><code>[{ 
  "message" : "User Valid"
},
{
  "userRole" : "owner or collaborator"
}]
</code></pre><h2>HTTP status code <a href="http://httpstatus.es/400" target="_blank">400</a></h2><p>User not valid (or some parameters are missing)</p><h3>Body</h3><p><strong>Type: application/json</strong></p><p><strong>Example</strong>:</p><pre><code>{ 
  "message" : "User Not Valid"
}
</code></pre></div></div></div></div></div></div></div></div></div></div><div class="panel panel-default"><div class="panel-heading"><h3 id="validateUser" class="panel-title">/validateUser</h3></div><div class="panel-body"><div class="top-resource-description"><p>Validate the user credentials.</p></div><div class="panel-group"><div class="panel panel-white"><div class="panel-heading"><h4 class="panel-title"><a class="collapsed" data-toggle="collapse" href="#panel_validateUser"><span class="parent"></span>/validateUser</a> <span class="methods"><a href="#validateUser_get"><span class="badge badge_get">get</span></a></span></h4></div><div id="panel_validateUser" class="panel-collapse collapse"><div class="panel-body"><div class="list-group"><div onclick="window.location.href = '#validateUser_get'" class="list-group-item"><span class="badge badge_get">get</span><div class="method_description"><p>Validate the user by providing the user&#39;s scase_token, scase_signature.</p></div><div class="clearfix"></div></div></div></div></div><div class="modal fade" tabindex="0" id="validateUser_get"><div class="modal-dialog"><div class="modal-content"><div class="modal-header"><button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button><h4 class="modal-title" id="myModalLabel"><span class="badge badge_get">get</span> <span class="parent"></span>/validateUser</h4></div><div class="modal-body"><div class="alert alert-info"><p>Validate the user by providing the user&#39;s scase_token, scase_signature.</p></div><ul class="nav nav-tabs"><li class="active"><a href="#validateUser_get_request" data-toggle="tab">Request</a></li><li><a href="#validateUser_get_response" data-toggle="tab">Response</a></li></ul><div class="tab-content"><div class="tab-pane active" id="validateUser_get_request"><h3>Query Parameters</h3><ul><li><strong>scase_token</strong>: <em>required (string)</em><p>The S-CASE token that is taken from the profile of the user in the Control Tower Interface.</p></li><li><strong>scase_signature</strong>: <em>required (string)</em><p>The signature produced using JWT default settings. The S-CASE token is signed using the S-CASE secret taken from the profile of the user in the Control Tower Interface.</p></li></ul></div><div class="tab-pane" id="validateUser_get_response"><h2>HTTP status code <a href="http://httpstatus.es/200" target="_blank">200</a></h2><p>User is valiad</p><h3>Body</h3><p><strong>Type: application/json</strong></p><p><strong>Example</strong>:</p><pre><code>{ 
  "message" : "User Valid"
}
</code></pre><h2>HTTP status code <a href="http://httpstatus.es/400" target="_blank">400</a></h2><p>User not valid (or some parameters are missing</p><h3>Body</h3><p><strong>Type: application/json</strong></p><p><strong>Example</strong>:</p><pre><code>{ 
  "message" : "User Not Valid"
}
</code></pre></div></div></div></div></div></div></div></div></div></div><div class="panel panel-default"><div class="panel-heading"><h3 id="createProjOwn" class="panel-title">/createProjOwn</h3></div><div class="panel-body"><div class="top-resource-description"><p>Create a project.</p></div><div class="panel-group"><div class="panel panel-white"><div class="panel-heading"><h4 class="panel-title"><a class="collapsed" data-toggle="collapse" href="#panel_createProjOwn"><span class="parent"></span>/createProjOwn</a> <span class="methods"><a href="#createProjOwn_post"><span class="badge badge_post">post</span></a></span></h4></div><div id="panel_createProjOwn" class="panel-collapse collapse"><div class="panel-body"><div class="list-group"><div onclick="window.location.href = '#createProjOwn_post'" class="list-group-item"><span class="badge badge_post">post</span><div class="method_description"><p>Create a project I own providing the project&#39;s name (The project is created both in the Control Tower and in the S-CASE artefacts Registry)</p></div><div class="clearfix"></div></div></div></div></div><div class="modal fade" tabindex="0" id="createProjOwn_post"><div class="modal-dialog"><div class="modal-content"><div class="modal-header"><button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button><h4 class="modal-title" id="myModalLabel"><span class="badge badge_post">post</span> <span class="parent"></span>/createProjOwn</h4></div><div class="modal-body"><div class="alert alert-info"><p>Create a project I own providing the project&#39;s name (The project is created both in the Control Tower and in the S-CASE artefacts Registry)</p></div><ul class="nav nav-tabs"><li class="active"><a href="#createProjOwn_post_request" data-toggle="tab">Request</a></li><li><a href="#createProjOwn_post_response" data-toggle="tab">Response</a></li></ul><div class="tab-content"><div class="tab-pane active" id="createProjOwn_post_request"><h3>Query Parameters</h3><ul><li><strong>scase_token</strong>: <em>required (string)</em><p>The S-CASE token that is taken from the profile of the user in the Control Tower Interface.</p></li><li><strong>scase_signature</strong>: <em>required (string)</em><p>The signature produced using JWT default settings. The S-CASE token is signed using the S-CASE secret taken from the profile of the user in the Control Tower Interface.</p></li><li><strong>project_name</strong>: <em>required (string)</em><p>The name of the project that we would like to create.</p></li><li><strong>privacy_level</strong>: <em>required (string)</em><p>The level of privacy of the project (only PUBLIC or PRIVATE are allowed).</p><p><strong>Example</strong>:</p><pre>PUBLIC or PRIVATE</pre></li></ul></div><div class="tab-pane" id="createProjOwn_post_response"><h2>HTTP status code <a href="http://httpstatus.es/201" target="_blank">201</a></h2><p>Successful creation of a project</p><h3>Body</h3><p><strong>Type: application/json</strong></p><p><strong>Example</strong>:</p><pre><code>{ 
  "message" : "RESTmarks created"
}
</code></pre><h2>HTTP status code <a href="http://httpstatus.es/400" target="_blank">400</a></h2><p>The request misses some parameters</p><h3>Body</h3><p><strong>Type: application/json</strong></p><p><strong>Example</strong>:</p><pre><code>{ 
  "message" : "you miss some parameters"
}
</code></pre><h2>HTTP status code <a href="http://httpstatus.es/404" target="_blank">404</a></h2><p>The provided scase_signature or scase_token do not correspond to a user of S-CASE</p><h3>Body</h3><p><strong>Type: application/json</strong></p><p><strong>Example</strong>:</p><pre><code>{ 
  "message" : "user  with this scase_signature (or this scase_token) does not exist in S-Case"
}
</code></pre><h2>HTTP status code <a href="http://httpstatus.es/409" target="_blank">409</a></h2><p>Project cannot be created (The project name already exists)</p><h3>Body</h3><p><strong>Type: application/json</strong></p><p><strong>Example</strong>:</p><pre><code>{ 
  "message" : "project cannot be created (project name already exists)"
}
</code></pre><h2>HTTP status code <a href="http://httpstatus.es/500" target="_blank">500</a></h2><p>Error of the MySQL database</p><h3>Body</h3><p><strong>Type: application/json</strong></p><p><strong>Example</strong>:</p><pre><code>{ 
  "message" : "error description"
}
</code></pre></div></div></div></div></div></div></div></div></div></div><div class="panel panel-default"><div class="panel-heading"><h3 id="deleteUser" class="panel-title">/deleteUser</h3></div><div class="panel-body"><div class="top-resource-description"><p>Delete a user.</p></div><div class="panel-group"><div class="panel panel-white"><div class="panel-heading"><h4 class="panel-title"><a class="collapsed" data-toggle="collapse" href="#panel_deleteUser"><span class="parent"></span>/deleteUser</a> <span class="methods"><a href="#deleteUser_delete"><span class="badge badge_delete">delete</span></a></span></h4></div><div id="panel_deleteUser" class="panel-collapse collapse"><div class="panel-body"><div class="list-group"><div onclick="window.location.href = '#deleteUser_delete'" class="list-group-item"><span class="badge badge_delete">delete</span><div class="method_description"><p>Delete a user totally from S-CASE (the projects in which the user is sole owner are deleted too)</p></div><div class="clearfix"></div></div></div></div></div><div class="modal fade" tabindex="0" id="deleteUser_delete"><div class="modal-dialog"><div class="modal-content"><div class="modal-header"><button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button><h4 class="modal-title" id="myModalLabel"><span class="badge badge_delete">delete</span> <span class="parent"></span>/deleteUser</h4></div><div class="modal-body"><div class="alert alert-info"><p>Delete a user totally from S-CASE (the projects in which the user is sole owner are deleted too)</p></div><ul class="nav nav-tabs"><li class="active"><a href="#deleteUser_delete_request" data-toggle="tab">Request</a></li><li><a href="#deleteUser_delete_response" data-toggle="tab">Response</a></li></ul><div class="tab-content"><div class="tab-pane active" id="deleteUser_delete_request"><h3>Query Parameters</h3><ul><li><strong>scase_token</strong>: <em>required (string)</em><p>The S-CASE token that is taken from the profile of the user in the Control Tower Interface.</p></li><li><strong>scase_signature</strong>: <em>required (string)</em><p>The signature produced using JWT default settings. The S-CASE token is signed using the S-CASE secret taken from the profile of the user in the Control Tower Interface.</p></li></ul></div><div class="tab-pane" id="deleteUser_delete_response"><h2>HTTP status code <a href="http://httpstatus.es/200" target="_blank">200</a></h2><p>Successful deletion of a user</p><h3>Body</h3><p><strong>Type: application/json</strong></p><p><strong>Example</strong>:</p><pre><code>{ 
  "message" : "user deleted"
}
</code></pre><h2>HTTP status code <a href="http://httpstatus.es/400" target="_blank">400</a></h2><p>The request misses some parameters</p><h3>Body</h3><p><strong>Type: application/json</strong></p><p><strong>Example</strong>:</p><pre><code>{ 
  "message" : "you miss some parameters"
}
</code></pre><h2>HTTP status code <a href="http://httpstatus.es/404" target="_blank">404</a></h2><p>The provided scase_signature or scase_token do not correspond to a user of S-CASE</p><h3>Body</h3><p><strong>Type: application/json</strong></p><p><strong>Example</strong>:</p><pre><code>{ 
  "message" : "user  with this scase_signature (or this scase_token) does not exist in S-Case"
}
</code></pre><h2>HTTP status code <a href="http://httpstatus.es/500" target="_blank">500</a></h2><p>Error of the MySQL database</p><h3>Body</h3><p><strong>Type: application/json</strong></p><p><strong>Example</strong>:</p><pre><code>{ 
  "message" : "error description"
}
</code></pre></div></div></div></div></div></div></div></div></div></div><div class="panel panel-default"><div class="panel-heading"><h3 id="deleteProjOwn" class="panel-title">/deleteProjOwn</h3></div><div class="panel-body"><div class="top-resource-description"><p>Delete a project I own.</p></div><div class="panel-group"><div class="panel panel-white"><div class="panel-heading"><h4 class="panel-title"><a class="collapsed" data-toggle="collapse" href="#panel_deleteProjOwn"><span class="parent"></span>/deleteProjOwn</a> <span class="methods"><a href="#deleteProjOwn_delete"><span class="badge badge_delete">delete</span></a></span></h4></div><div id="panel_deleteProjOwn" class="panel-collapse collapse"><div class="panel-body"><div class="list-group"><div onclick="window.location.href = '#deleteProjOwn_delete'" class="list-group-item"><span class="badge badge_delete">delete</span><div class="method_description"><p>Delete a project I own providing its name.</p></div><div class="clearfix"></div></div></div></div></div><div class="modal fade" tabindex="0" id="deleteProjOwn_delete"><div class="modal-dialog"><div class="modal-content"><div class="modal-header"><button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button><h4 class="modal-title" id="myModalLabel"><span class="badge badge_delete">delete</span> <span class="parent"></span>/deleteProjOwn</h4></div><div class="modal-body"><div class="alert alert-info"><p>Delete a project I own providing its name.</p></div><ul class="nav nav-tabs"><li class="active"><a href="#deleteProjOwn_delete_request" data-toggle="tab">Request</a></li><li><a href="#deleteProjOwn_delete_response" data-toggle="tab">Response</a></li></ul><div class="tab-content"><div class="tab-pane active" id="deleteProjOwn_delete_request"><h3>Query Parameters</h3><ul><li><strong>scase_token</strong>: <em>required (string)</em><p>The S-CASE token that is taken from the profile of the user in the Control Tower Interface.</p></li><li><strong>scase_signature</strong>: <em>required (string)</em><p>The signature produced using JWT default settings. The S-CASE token is signed using the S-CASE secret taken from the profile of the user in the Control Tower Interface.</p></li><li><strong>project_name</strong>: <em>required (string)</em><p>The name of the project that we would like to create.</p></li></ul></div><div class="tab-pane" id="deleteProjOwn_delete_response"><h2>HTTP status code <a href="http://httpstatus.es/200" target="_blank">200</a></h2><p>Successful deletion of a project</p><h3>Body</h3><p><strong>Type: application/json</strong></p><p><strong>Example</strong>:</p><pre><code>{ 
  "message" : "project RESTmarks deleted"
}
</code></pre><h2>HTTP status code <a href="http://httpstatus.es/400" target="_blank">400</a></h2><p>The request misses some parameters</p><h3>Body</h3><p><strong>Type: application/json</strong></p><p><strong>Example</strong>:</p><pre><code>{ 
  "message" : "you miss some parameters"
}
</code></pre><h2>HTTP status code <a href="http://httpstatus.es/401" target="_blank">401</a></h2><p>The provided scase_token does not correspond to an owner of the project</p><h3>Body</h3><p><strong>Type: application/json</strong></p><p><strong>Example</strong>:</p><pre><code>{ 
  "message" : "User with this scase_token does not collaborate on this project"
}
</code></pre><h2>HTTP status code <a href="http://httpstatus.es/404" target="_blank">404</a></h2><p>The provided scase_signature or scase_token do not correspond to a user of S-CASE</p><h3>Body</h3><p><strong>Type: application/json</strong></p><p><strong>Example</strong>:</p><pre><code>{ 
  "message" : "user  with this scase_signature (or this scase_token) does not exist in S-Case"
}
</code></pre><h2>HTTP status code <a href="http://httpstatus.es/500" target="_blank">500</a></h2><p>Error of the MySQL database</p><h3>Body</h3><p><strong>Type: application/json</strong></p><p><strong>Example</strong>:</p><pre><code>{ 
  "message" : "error description"
}
</code></pre></div></div></div></div></div></div></div></div></div></div><div class="panel panel-default"><div class="panel-heading"><h3 id="displayProjectsCollab" class="panel-title">/displayProjectsCollab</h3></div><div class="panel-body"><div class="top-resource-description"><p>Display the projects a user collaborates on.</p></div><div class="panel-group"><div class="panel panel-white"><div class="panel-heading"><h4 class="panel-title"><a class="collapsed" data-toggle="collapse" href="#panel_displayProjectsCollab"><span class="parent"></span>/displayProjectsCollab</a> <span class="methods"><a href="#displayProjectsCollab_get"><span class="badge badge_get">get</span></a></span></h4></div><div id="panel_displayProjectsCollab" class="panel-collapse collapse"><div class="panel-body"><div class="list-group"><div onclick="window.location.href = '#displayProjectsCollab_get'" class="list-group-item"><span class="badge badge_get">get</span><div class="method_description"><p>Display the projects a user collaborates on.</p></div><div class="clearfix"></div></div></div></div></div><div class="modal fade" tabindex="0" id="displayProjectsCollab_get"><div class="modal-dialog"><div class="modal-content"><div class="modal-header"><button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button><h4 class="modal-title" id="myModalLabel"><span class="badge badge_get">get</span> <span class="parent"></span>/displayProjectsCollab</h4></div><div class="modal-body"><div class="alert alert-info"><p>Display the projects a user collaborates on.</p></div><ul class="nav nav-tabs"><li class="active"><a href="#displayProjectsCollab_get_request" data-toggle="tab">Request</a></li><li><a href="#displayProjectsCollab_get_response" data-toggle="tab">Response</a></li></ul><div class="tab-content"><div class="tab-pane active" id="displayProjectsCollab_get_request"><h3>Query Parameters</h3><ul><li><strong>scase_token</strong>: <em>required (string)</em><p>The S-CASE token that is taken from the profile of the user in the Control Tower Interface.</p></li><li><strong>scase_signature</strong>: <em>required (string)</em><p>The signature produced using JWT default settings. The S-CASE token is signed using the S-CASE secret taken from the profile of the user in the Control Tower Interface.</p></li></ul></div><div class="tab-pane" id="displayProjectsCollab_get_response"><h2>HTTP status code <a href="http://httpstatus.es/200" target="_blank">200</a></h2><p>Successful return of the projects the user collaborates on</p><h3>Body</h3><p><strong>Type: application/json</strong></p><p><strong>Example</strong>:</p><pre><code>{ 
  "projectnames-Own" : "RESTmarks,RESTbucks,WSAT"
}
</code></pre><h2>HTTP status code <a href="http://httpstatus.es/400" target="_blank">400</a></h2><p>The request misses some parameters</p><h3>Body</h3><p><strong>Type: application/json</strong></p><p><strong>Example</strong>:</p><pre><code>{ 
  "message" : "you miss some parameters"
}
</code></pre><h2>HTTP status code <a href="http://httpstatus.es/404" target="_blank">404</a></h2><p>The provided scase_signature or scase_token do not correspond to a user of S-CASE</p><h3>Body</h3><p><strong>Type: application/json</strong></p><p><strong>Example</strong>:</p><pre><code>{ 
  "message" : "user  with this scase_signature (or this scase_token) does not exist in S-Case"
}
</code></pre><h2>HTTP status code <a href="http://httpstatus.es/500" target="_blank">500</a></h2><p>Error of the MySQL database</p><h3>Body</h3><p><strong>Type: application/json</strong></p><p><strong>Example</strong>:</p><pre><code>{ 
  "message" : "error description"
}
</code></pre></div></div></div></div></div></div></div></div></div></div><div class="panel panel-default"><div class="panel-heading"><h3 id="displayProjectsOwn" class="panel-title">/displayProjectsOwn</h3></div><div class="panel-body"><div class="top-resource-description"><p>Display the projects a user owns.</p></div><div class="panel-group"><div class="panel panel-white"><div class="panel-heading"><h4 class="panel-title"><a class="collapsed" data-toggle="collapse" href="#panel_displayProjectsOwn"><span class="parent"></span>/displayProjectsOwn</a> <span class="methods"><a href="#displayProjectsOwn_get"><span class="badge badge_get">get</span></a></span></h4></div><div id="panel_displayProjectsOwn" class="panel-collapse collapse"><div class="panel-body"><div class="list-group"><div onclick="window.location.href = '#displayProjectsOwn_get'" class="list-group-item"><span class="badge badge_get">get</span><div class="method_description"><p>Display the projects a user owns.</p></div><div class="clearfix"></div></div></div></div></div><div class="modal fade" tabindex="0" id="displayProjectsOwn_get"><div class="modal-dialog"><div class="modal-content"><div class="modal-header"><button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button><h4 class="modal-title" id="myModalLabel"><span class="badge badge_get">get</span> <span class="parent"></span>/displayProjectsOwn</h4></div><div class="modal-body"><div class="alert alert-info"><p>Display the projects a user owns.</p></div><ul class="nav nav-tabs"><li class="active"><a href="#displayProjectsOwn_get_request" data-toggle="tab">Request</a></li><li><a href="#displayProjectsOwn_get_response" data-toggle="tab">Response</a></li></ul><div class="tab-content"><div class="tab-pane active" id="displayProjectsOwn_get_request"><h3>Query Parameters</h3><ul><li><strong>scase_token</strong>: <em>required (string)</em><p>The S-CASE token that is taken from the profile of the user in the Control Tower Interface.</p></li><li><strong>scase_signature</strong>: <em>required (string)</em><p>The signature produced using JWT default settings. The S-CASE token is signed using the S-CASE secret taken from the profile of the user in the Control Tower Interface.</p></li></ul></div><div class="tab-pane" id="displayProjectsOwn_get_response"><h2>HTTP status code <a href="http://httpstatus.es/200" target="_blank">200</a></h2><p>Successful return of the projects the user owns</p><h3>Body</h3><p><strong>Type: application/json</strong></p><p><strong>Example</strong>:</p><pre><code>{ 
  "projectnames-Own" : "RESTmarks,RESTbucks,WSAT"
}
</code></pre><h2>HTTP status code <a href="http://httpstatus.es/400" target="_blank">400</a></h2><p>The request misses some parameters</p><h3>Body</h3><p><strong>Type: application/json</strong></p><p><strong>Example</strong>:</p><pre><code>{ 
  "message" : "you miss some parameters"
}
</code></pre><h2>HTTP status code <a href="http://httpstatus.es/404" target="_blank">404</a></h2><p>The provided scase_signature or scase_token do not correspond to a user of S-CASE</p><h3>Body</h3><p><strong>Type: application/json</strong></p><p><strong>Example</strong>:</p><pre><code>{ 
  "message" : "user  with this scase_signature (or this scase_token) does not exist in S-Case"
}
</code></pre><h2>HTTP status code <a href="http://httpstatus.es/500" target="_blank">500</a></h2><p>Error of the MySQL database</p><h3>Body</h3><p><strong>Type: application/json</strong></p><p><strong>Example</strong>:</p><pre><code>{ 
  "message" : "error description"
}
</code></pre></div></div></div></div></div></div></div></div></div></div><div class="panel panel-default"><div class="panel-heading"><h3 id="displayOwnersCollabs" class="panel-title">/displayOwnersCollabs</h3></div><div class="panel-body"><div class="top-resource-description"><p>Get the owners and collaborators of a project I own.</p></div><div class="panel-group"><div class="panel panel-white"><div class="panel-heading"><h4 class="panel-title"><a class="collapsed" data-toggle="collapse" href="#panel_displayOwnersCollabs"><span class="parent"></span>/displayOwnersCollabs</a> <span class="methods"><a href="#displayOwnersCollabs_get"><span class="badge badge_get">get</span></a></span></h4></div><div id="panel_displayOwnersCollabs" class="panel-collapse collapse"><div class="panel-body"><div class="list-group"><div onclick="window.location.href = '#displayOwnersCollabs_get'" class="list-group-item"><span class="badge badge_get">get</span><div class="method_description"><p>Get the owners and collaborators of a project I own providing the project&#39;s name</p></div><div class="clearfix"></div></div></div></div></div><div class="modal fade" tabindex="0" id="displayOwnersCollabs_get"><div class="modal-dialog"><div class="modal-content"><div class="modal-header"><button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button><h4 class="modal-title" id="myModalLabel"><span class="badge badge_get">get</span> <span class="parent"></span>/displayOwnersCollabs</h4></div><div class="modal-body"><div class="alert alert-info"><p>Get the owners and collaborators of a project I own providing the project&#39;s name</p></div><ul class="nav nav-tabs"><li class="active"><a href="#displayOwnersCollabs_get_request" data-toggle="tab">Request</a></li><li><a href="#displayOwnersCollabs_get_response" data-toggle="tab">Response</a></li></ul><div class="tab-content"><div class="tab-pane active" id="displayOwnersCollabs_get_request"><h3>Query Parameters</h3><ul><li><strong>scase_token</strong>: <em>required (string)</em><p>The S-CASE token that is taken from the profile of the user in the Control Tower Interface.</p></li><li><strong>scase_signature</strong>: <em>required (string)</em><p>The signature produced using JWT default settings. The S-CASE token is signed using the S-CASE secret taken from the profile of the user in the Control Tower Interface.</p></li><li><strong>project_name</strong>: <em>required (string)</em><p>The name of the project that we would like to get the owners and collaborators</p></li></ul></div><div class="tab-pane" id="displayOwnersCollabs_get_response"><h2>HTTP status code <a href="http://httpstatus.es/200" target="_blank">200</a></h2><p>Successful return of the collaborators and owners</p><h3>Body</h3><p><strong>Type: application/json</strong></p><p><strong>Example</strong>:</p><pre><code>[{ 
  "owners" : "johndoe@gmail.com,Johnnie Doe,BestJavaProgrammer"
},
{
  "collaborators" : "johndoe@gmail.com,Johnnie Doe,BestJavaProgrammer"
}]
</code></pre><h2>HTTP status code <a href="http://httpstatus.es/400" target="_blank">400</a></h2><p>The request misses some parameters</p><h3>Body</h3><p><strong>Type: application/json</strong></p><p><strong>Example</strong>:</p><pre><code>{ 
  "message" : "you miss some parameters"
}
</code></pre><h2>HTTP status code <a href="http://httpstatus.es/401" target="_blank">401</a></h2><p>The provided scase_signature or scase_token do not correspond to an owner of this project</p><h3>Body</h3><p><strong>Type: application/json</strong></p><p><strong>Example</strong>:</p><pre><code>{ 
  "message" : "User with the given scase_token or signature does not own this project"
}
</code></pre><h2>HTTP status code <a href="http://httpstatus.es/500" target="_blank">500</a></h2><p>Error of the MySQL database</p><h3>Body</h3><p><strong>Type: application/json</strong></p><p><strong>Example</strong>:</p><pre><code>{ 
  "message" : "error in mysql happened, sorry!"
}
</code></pre></div></div></div></div></div></div></div></div></div></div><div class="panel panel-default"><div class="panel-heading"><h3 id="refreshSCASEsecret" class="panel-title">/refreshSCASEsecret</h3></div><div class="panel-body"><div class="top-resource-description"><p>Refresh the S-CASE secret</p></div><div class="panel-group"><div class="panel panel-white"><div class="panel-heading"><h4 class="panel-title"><a class="collapsed" data-toggle="collapse" href="#panel_refreshSCASEsecret"><span class="parent"></span>/refreshSCASEsecret</a> <span class="methods"><a href="#refreshSCASEsecret_put"><span class="badge badge_put">put</span></a></span></h4></div><div id="panel_refreshSCASEsecret" class="panel-collapse collapse"><div class="panel-body"><div class="list-group"><div onclick="window.location.href = '#refreshSCASEsecret_put'" class="list-group-item"><span class="badge badge_put">put</span><div class="method_description"><p>Refresh the S-CASE secret (be aware scase_signature will change too since it consists of scase_token signed by the secret)</p></div><div class="clearfix"></div></div></div></div></div><div class="modal fade" tabindex="0" id="refreshSCASEsecret_put"><div class="modal-dialog"><div class="modal-content"><div class="modal-header"><button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button><h4 class="modal-title" id="myModalLabel"><span class="badge badge_put">put</span> <span class="parent"></span>/refreshSCASEsecret</h4></div><div class="modal-body"><div class="alert alert-info"><p>Refresh the S-CASE secret (be aware scase_signature will change too since it consists of scase_token signed by the secret)</p></div><ul class="nav nav-tabs"><li class="active"><a href="#refreshSCASEsecret_put_request" data-toggle="tab">Request</a></li><li><a href="#refreshSCASEsecret_put_response" data-toggle="tab">Response</a></li></ul><div class="tab-content"><div class="tab-pane active" id="refreshSCASEsecret_put_request"><h3>Query Parameters</h3><ul><li><strong>scase_token</strong>: <em>required (string)</em><p>The S-CASE token that is taken from the profile of the user in the Control Tower Interface.</p></li><li><strong>scase_signature</strong>: <em>required (string)</em><p>The signature produced using JWT default settings. The S-CASE token is signed using the S-CASE secret taken from the profile of the user in the Control Tower Interface.</p></li></ul></div><div class="tab-pane" id="refreshSCASEsecret_put_response"><h2>HTTP status code <a href="http://httpstatus.es/200" target="_blank">200</a></h2><p>Successful refresh of S-CASE secret</p><h3>Body</h3><p><strong>Type: application/json</strong></p><p><strong>Example</strong>:</p><pre><code>{ 
  "newSCASEsecret" : "nfadjisd0493jiodsa0d3kd-0ask"
}
</code></pre><h2>HTTP status code <a href="http://httpstatus.es/400" target="_blank">400</a></h2><p>The request misses some parameters</p><h3>Body</h3><p><strong>Type: application/json</strong></p><p><strong>Example</strong>:</p><pre><code>{ 
  "message" : "you miss some parameters"
}
</code></pre><h2>HTTP status code <a href="http://httpstatus.es/404" target="_blank">404</a></h2><p>The provided google e-mail or github username or scase_signature or scase_token do not correspond to a user of S-CASE</p><h3>Body</h3><p><strong>Type: application/json</strong></p><p><strong>Example</strong>:</p><pre><code>{ 
  "message" : "user  with johndoe@gmail.com (or johndoeUsername or this scase_signature or this scase_token) does not exist in S-Case"
}
</code></pre><h2>HTTP status code <a href="http://httpstatus.es/500" target="_blank">500</a></h2><p>Error of the MySQL database</p><h3>Body</h3><p><strong>Type: application/json</strong></p><p><strong>Example</strong>:</p><pre><code>{ 
  "message" : "error description"
}
</code></pre></div></div></div></div></div></div></div></div></div></div><div class="panel panel-default"><div class="panel-heading"><h3 id="refreshSCASEtoken" class="panel-title">/refreshSCASEtoken</h3></div><div class="panel-body"><div class="top-resource-description"><p>Refresh the S-CASE token</p></div><div class="panel-group"><div class="panel panel-white"><div class="panel-heading"><h4 class="panel-title"><a class="collapsed" data-toggle="collapse" href="#panel_refreshSCASEtoken"><span class="parent"></span>/refreshSCASEtoken</a> <span class="methods"><a href="#refreshSCASEtoken_put"><span class="badge badge_put">put</span></a></span></h4></div><div id="panel_refreshSCASEtoken" class="panel-collapse collapse"><div class="panel-body"><div class="list-group"><div onclick="window.location.href = '#refreshSCASEtoken_put'" class="list-group-item"><span class="badge badge_put">put</span><div class="method_description"><p>Refresh the S-CASE token(be aware scase_signature will change too since it consists of scase_token signed by the secret)</p></div><div class="clearfix"></div></div></div></div></div><div class="modal fade" tabindex="0" id="refreshSCASEtoken_put"><div class="modal-dialog"><div class="modal-content"><div class="modal-header"><button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button><h4 class="modal-title" id="myModalLabel"><span class="badge badge_put">put</span> <span class="parent"></span>/refreshSCASEtoken</h4></div><div class="modal-body"><div class="alert alert-info"><p>Refresh the S-CASE token(be aware scase_signature will change too since it consists of scase_token signed by the secret)</p></div><ul class="nav nav-tabs"><li class="active"><a href="#refreshSCASEtoken_put_request" data-toggle="tab">Request</a></li><li><a href="#refreshSCASEtoken_put_response" data-toggle="tab">Response</a></li></ul><div class="tab-content"><div class="tab-pane active" id="refreshSCASEtoken_put_request"><h3>Query Parameters</h3><ul><li><strong>scase_token</strong>: <em>required (string)</em><p>The S-CASE token that is taken from the profile of the user in the Control Tower Interface.</p></li><li><strong>scase_signature</strong>: <em>required (string)</em><p>The signature produced using JWT default settings. The S-CASE token is signed using the S-CASE secret taken from the profile of the user in the Control Tower Interface.</p></li></ul></div><div class="tab-pane" id="refreshSCASEtoken_put_response"><h2>HTTP status code <a href="http://httpstatus.es/200" target="_blank">200</a></h2><p>Successful refresh of S-CASE token</p><h3>Body</h3><p><strong>Type: application/json</strong></p><p><strong>Example</strong>:</p><pre><code>{ 
  "newSCASEtoken" : "nfadjisd0493jiodsa0d3kd-0ask"
}
</code></pre><h2>HTTP status code <a href="http://httpstatus.es/400" target="_blank">400</a></h2><p>The request misses some parameters</p><h3>Body</h3><p><strong>Type: application/json</strong></p><p><strong>Example</strong>:</p><pre><code>{ 
  "message" : "you miss some parameters"
}
</code></pre><h2>HTTP status code <a href="http://httpstatus.es/404" target="_blank">404</a></h2><p>The provided google e-mail or github username or scase_signature or scase_token do not correspond to a user of S-CASE</p><h3>Body</h3><p><strong>Type: application/json</strong></p><p><strong>Example</strong>:</p><pre><code>{ 
  "message" : "user  with johndoe@gmail.com (or johndoeUsername or this scase_signature or this scase_token) does not exist in S-Case"
}
</code></pre><h2>HTTP status code <a href="http://httpstatus.es/500" target="_blank">500</a></h2><p>Error of the MySQL database</p><h3>Body</h3><p><strong>Type: application/json</strong></p><p><strong>Example</strong>:</p><pre><code>{ 
  "message" : "error description"
}
</code></pre></div></div></div></div></div></div></div></div></div></div><div class="panel panel-default"><div class="panel-heading"><h3 id="removeCollabProjOwn" class="panel-title">/removeCollabProjOwn</h3></div><div class="panel-body"><div class="top-resource-description"><p>Remove a collaborator from a project I own</p></div><div class="panel-group"><div class="panel panel-white"><div class="panel-heading"><h4 class="panel-title"><a class="collapsed" data-toggle="collapse" href="#panel_removeCollabProjOwn"><span class="parent"></span>/removeCollabProjOwn</a> <span class="methods"><a href="#removeCollabProjOwn_delete"><span class="badge badge_delete">delete</span></a></span></h4></div><div id="panel_removeCollabProjOwn" class="panel-collapse collapse"><div class="panel-body"><div class="list-group"><div onclick="window.location.href = '#removeCollabProjOwn_delete'" class="list-group-item"><span class="badge badge_delete">delete</span><div class="method_description"><p>Remove a collaborator from a project I own using the collaborator&#39;s github username or google_email</p></div><div class="clearfix"></div></div></div></div></div><div class="modal fade" tabindex="0" id="removeCollabProjOwn_delete"><div class="modal-dialog"><div class="modal-content"><div class="modal-header"><button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button><h4 class="modal-title" id="myModalLabel"><span class="badge badge_delete">delete</span> <span class="parent"></span>/removeCollabProjOwn</h4></div><div class="modal-body"><div class="alert alert-info"><p>Remove a collaborator from a project I own using the collaborator&#39;s github username or google_email</p></div><ul class="nav nav-tabs"><li class="active"><a href="#removeCollabProjOwn_delete_request" data-toggle="tab">Request</a></li><li><a href="#removeCollabProjOwn_delete_response" data-toggle="tab">Response</a></li></ul><div class="tab-content"><div class="tab-pane active" id="removeCollabProjOwn_delete_request"><h3>Query Parameters</h3><ul><li><strong>scase_token</strong>: <em>required (string)</em><p>The S-CASE token that is taken from the profile of the user in the Control Tower Interface.</p></li><li><strong>scase_signature</strong>: <em>required (string)</em><p>The signature produced using JWT default settings. The S-CASE token is signed using the S-CASE secret taken from the profile of the user in the Control Tower Interface.</p></li><li><strong>project_name</strong>: <em>required (string)</em><p>The name of the project that we would like to modify.</p></li><li><strong>github_name</strong>: <em>(string)</em><p>The github username of the user that we would like to remove from the collaborators.</p></li><li><strong>google_email</strong>: <em>(string)</em><p>The google e-mail of the user that we would like to remove from the collaborators.</p></li></ul></div><div class="tab-pane" id="removeCollabProjOwn_delete_response"><h2>HTTP status code <a href="http://httpstatus.es/200" target="_blank">200</a></h2><p>Successful removal of Collaborator</p><h3>Body</h3><p><strong>Type: application/json</strong></p><p><strong>Example</strong>:</p><pre><code>{ 
  "message" : "collaborator johndoe@gmail.com deleted"
}
</code></pre><h2>HTTP status code <a href="http://httpstatus.es/400" target="_blank">400</a></h2><p>The request misses some parameters</p><h3>Body</h3><p><strong>Type: application/json</strong></p><p><strong>Example</strong>:</p><pre><code>{ 
  "message" : "you miss some parameters"
}
</code></pre><h2>HTTP status code <a href="http://httpstatus.es/401" target="_blank">401</a></h2><p>The provided scase_token does not correspond to a collaborator of the project</p><h3>Body</h3><p><strong>Type: application/json</strong></p><p><strong>Example</strong>:</p><pre><code>{ 
  "message" : "User with this scase_token does not collaborate on this project"
}
</code></pre><h2>HTTP status code <a href="http://httpstatus.es/403" target="_blank">403</a></h2><p>The provided google e-mail or github username do not correspond to an owner of the project.</p><h3>Body</h3><p><strong>Type: application/json</strong></p><p><strong>Example</strong>:</p><pre><code>{ 
  "message" : "user  with johndoe@gmail.com does not collaborate on this project"
} 
</code></pre><h2>HTTP status code <a href="http://httpstatus.es/404" target="_blank">404</a></h2><p>The provided google e-mail or github username or scase_signature or scase_token do not correspond to a user of S-CASE</p><h3>Body</h3><p><strong>Type: application/json</strong></p><p><strong>Example</strong>:</p><pre><code>{ 
  "message" : "user  with johndoe@gmail.com (or johndoeUsername or this scase_signature or this scase_token) does not exist in S-Case"
}
</code></pre><h2>HTTP status code <a href="http://httpstatus.es/500" target="_blank">500</a></h2><p>Error of the MySQL database</p><h3>Body</h3><p><strong>Type: application/json</strong></p><p><strong>Example</strong>:</p><pre><code>{ 
  "message" : "error description"
}
</code></pre></div></div></div></div></div></div></div></div></div></div><div class="panel panel-default"><div class="panel-heading"><h3 id="removeOwnerProjOwn" class="panel-title">/removeOwnerProjOwn</h3></div><div class="panel-body"><div class="top-resource-description"><p>Remove a collaborator from a project I own.</p></div><div class="panel-group"><div class="panel panel-white"><div class="panel-heading"><h4 class="panel-title"><a class="collapsed" data-toggle="collapse" href="#panel_removeOwnerProjOwn"><span class="parent"></span>/removeOwnerProjOwn</a> <span class="methods"><a href="#removeOwnerProjOwn_delete"><span class="badge badge_delete">delete</span></a></span></h4></div><div id="panel_removeOwnerProjOwn" class="panel-collapse collapse"><div class="panel-body"><div class="list-group"><div onclick="window.location.href = '#removeOwnerProjOwn_delete'" class="list-group-item"><span class="badge badge_delete">delete</span><div class="method_description"><p>Remove a collaborator from a project I own using the collaborator&#39;s github username or google_email.</p></div><div class="clearfix"></div></div></div></div></div><div class="modal fade" tabindex="0" id="removeOwnerProjOwn_delete"><div class="modal-dialog"><div class="modal-content"><div class="modal-header"><button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button><h4 class="modal-title" id="myModalLabel"><span class="badge badge_delete">delete</span> <span class="parent"></span>/removeOwnerProjOwn</h4></div><div class="modal-body"><div class="alert alert-info"><p>Remove a collaborator from a project I own using the collaborator&#39;s github username or google_email.</p></div><ul class="nav nav-tabs"><li class="active"><a href="#removeOwnerProjOwn_delete_request" data-toggle="tab">Request</a></li><li><a href="#removeOwnerProjOwn_delete_response" data-toggle="tab">Response</a></li></ul><div class="tab-content"><div class="tab-pane active" id="removeOwnerProjOwn_delete_request"><h3>Query Parameters</h3><ul><li><strong>scase_token</strong>: <em>required (string)</em><p>The S-CASE token that is taken from the profile of the user in the Control Tower Interface.</p></li><li><strong>scase_signature</strong>: <em>required (string)</em><p>The signature produced using JWT default settings. The S-CASE token is signed using the S-CASE secret taken from the profile of the user in the Control Tower Interface.</p></li><li><strong>project_name</strong>: <em>required (string)</em><p>The name of the project that we would like to modify.</p></li><li><strong>github_name</strong>: <em>(string)</em><p>The github username of the user that we would like to remove from the collaborators.</p></li><li><strong>google_email</strong>: <em>(string)</em><p>The google e-mail of the user that we would like to remove from the collaborators.</p></li></ul></div><div class="tab-pane" id="removeOwnerProjOwn_delete_response"><h2>HTTP status code <a href="http://httpstatus.es/200" target="_blank">200</a></h2><p>Successful removal of Owner</p><h3>Body</h3><p><strong>Type: application/json</strong></p><p><strong>Example</strong>:</p><pre><code>{ 
  "message" : "owner johndoe@gmail.com deleted"
}
</code></pre><h2>HTTP status code <a href="http://httpstatus.es/400" target="_blank">400</a></h2><p>The request misses some parameters</p><h3>Body</h3><p><strong>Type: application/json</strong></p><p><strong>Example</strong>:</p><pre><code>{ 
  "message" : "you miss some parameters"
}
</code></pre><h2>HTTP status code <a href="http://httpstatus.es/401" target="_blank">401</a></h2><p>The provided scase_token does not correspond to an owner of the project</p><h3>Body</h3><p><strong>Type: application/json</strong></p><p><strong>Example</strong>:</p><pre><code>{ 
  "message" : "User with this scase_token does not own project RESTmarks"
}
</code></pre><h2>HTTP status code <a href="http://httpstatus.es/403" target="_blank">403</a></h2><p>The provided google e-mail or github username do not correspond to an owner of the project.</p><h3>Body</h3><p><strong>Type: application/json</strong></p><p><strong>Example</strong>:</p><pre><code>{ 
  "message" : "user  with johndoe@gmail.com does not own this project"
} 
</code></pre><h2>HTTP status code <a href="http://httpstatus.es/404" target="_blank">404</a></h2><p>The provided google e-mail or github username or scase_signature or scase_token do not correspond to a user of S-CASE</p><h3>Body</h3><p><strong>Type: application/json</strong></p><p><strong>Example</strong>:</p><pre><code>{ 
  "message" : "user  with johndoe@gmail.com (or johndoeUsername or this scase_signature or this scase_token) does not exist in S-Case"
}
</code></pre><h2>HTTP status code <a href="http://httpstatus.es/500" target="_blank">500</a></h2><p>Error of the MySQL database</p><h3>Body</h3><p><strong>Type: application/json</strong></p><p><strong>Example</strong>:</p><pre><code>{ 
  "message" : "error description"
}
</code></pre></div></div></div></div></div></div></div></div></div></div></div><div class="col-md-3"><div id="sidebar" class="hidden-print affix" role="complementary"><ul class="nav nav-pills nav-stacked"><li><a href="#addCollabProjOwn">/addCollabProjOwn</a></li><li><a href="#addOwnerProjOwn">/addOwnerProjOwn</a></li><li><a href="#changeDomainSubdomainProjOwn">/changeDomainSubdomainProjOwn</a></li><li><a href="#changePrivacyProjOwn">/changePrivacyProjOwn</a></li><li><a href="#checkUserRole">/checkUserRole</a></li><li><a href="#validateUser">/validateUser</a></li><li><a href="#createProjOwn">/createProjOwn</a></li><li><a href="#deleteUser">/deleteUser</a></li><li><a href="#deleteProjOwn">/deleteProjOwn</a></li><li><a href="#displayProjectsCollab">/displayProjectsCollab</a></li><li><a href="#displayProjectsOwn">/displayProjectsOwn</a></li><li><a href="#displayOwnersCollabs">/displayOwnersCollabs</a></li><li><a href="#refreshSCASEsecret">/refreshSCASEsecret</a></li><li><a href="#refreshSCASEtoken">/refreshSCASEtoken</a></li><li><a href="#removeCollabProjOwn">/removeCollabProjOwn</a></li><li><a href="#removeOwnerProjOwn">/removeOwnerProjOwn</a></li></ul></div></div></div></div></body>
```


###Check if a user is valid
- endpoint [GET]
	- /api/validateUser
- parameters
	- scase_token [to check if a provided token corresponds to a user]

###Check if a user has a Role in a project (Owner or collaborator)
- endpoint [GET]
	- /api/validateUser
- parameters
	- scase_token [to check if a provided token corresponds to a user]
	- project_name [in combination with scase_token to check if a user has a Role(collaborator or owner) in a project]

###Delete a User
- endpoint [GET]
	- /api/deleteUser
- parameters
	- scase_token [to check if a provided token corresponds to a user]

###Refresh the S-Case token
- endpoint [GET]
	- /api/refreshSCASEtoken
- parameters
	- scase_token [to check if a provided token corresponds to a user]

###Display the Projects a User Owns
- endpoint [GET]
	- /api/displayProjectsOwn
- parameters
	- scase_token [to check if a provided token corresponds to a user]

###Display the Projects a User Collaborates on
- endpoint [GET]
	- /api/displayProjectsCollab
- parameters
	- scase_token [to check if a provided token corresponds to a user]

###Display the owners and collaborators of a project
- endpoint [GET]
	- /api/displayOwnersCollabs
- parameters
	- scase_token [to check if a provided token corresponds to a user]
	- project_name [the project name of which the owners and collaborators to display]

###Add a collaborator in a project I own
- endpoint [GET]
	- /api/addCollabProjOwn
- parameters
	- scase_token [to check if a provided token corresponds to a user and the user is an owner of the project]
	- project_name [the project to add a collaborator]
	- github_name [the github name of the user to add as collaborator]

###Add an owner in a project I own
- endpoint [GET]
	- /api/addOwnerProjOwn
- parameters
	- scase_token [to check if a provided token corresponds to a user and the user is an owner of the project]
	- project_name [the project to add an owner]
	- github_name [the github name of the user to add as owner]

###Remove a collaborator a project I own
- endpoint [GET]
	- /api/removeCollabProjOwn
parameters
	- scase_token [to check if a provided token corresponds to a user and the user is an owner of the project]
	- project_name [the project to remove a collaborator]
	- github_name [the github name of the user to remove from collaborator]


###Remove an owner from a project I own
- endpoint [GET]
	- /api/removeOwnerProjOwn
- parameters
	- scase_token [to check if a provided token corresponds to a user and the user is an owner of the project]
	- project_name [the project to remove owner]
	- github_name [the github name of the user to remove from owner]
	

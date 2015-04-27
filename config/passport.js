// load all the things we need
var GithubStrategy   = require('passport-github').Strategy;
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
// load up the user model
var mysql = require('mysql');
var bcrypt = require('bcrypt-nodejs');
var dbconfig = require('./database');
//var connection = mysql.createConnection(dbconfig.connection);


// load the authorization variables
var configAuth = require('./auth'); // use this one for testing
//var configAuth = require('./secretAuth'); // use this one for prod
var connConstant = require('../config/ConnectConstant');
var connection; 
//=============the following are used to create the s-case token===============
var crypto = require('crypto');
var base64url = require('base64url');
var jwt = require('jsonwebtoken');
//var scase_secret= process.env.SCASE_SECRET;
var scase_secret=scasetokenCreate(35);
function scasetokenCreate(size){
    return base64url(crypto.randomBytes(size));
}
//============================================================================
module.exports = function(passport) {
	
    var mysql = require('mysql');
    var dbconfig = require('../config/database');
    var connection;
    connection=connConstant.connection;
    //handleDisconnect();//we create a connection to the DB
    // =========================================================================
    // passport session setup ==================================================
    // =========================================================================
    // required for persistent login sessions
    // passport needs ability to serialize and unserialize users out of session

    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        connection=connConstant.connection;
        done(null, user.id);
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        connection=connConstant.connection;
        connection.query("SELECT * FROM " + dbconfig.users_table + " WHERE `id` = "+ id, function(err, rows){
            if(rows.length>0){
                done(err, rows[0]);
            }
            else{
                done(null, false);
            }
        });
    });

    

	// =========================================================================
    // Github ================================================================
    // =========================================================================
    passport.use(new GithubStrategy({
        clientID        : configAuth.GithubAuth.clientID,
        clientSecret    : configAuth.GithubAuth.clientSecret,
        callbackURL     : configAuth.GithubAuth.callbackURL,
        passReqToCallback : true // allows us to pass in the req from our route (lets us check if a user is logged in or not)
    },
    function(req, token, refreshToken, profile, done) {
        // asynchronous
        process.nextTick(function() {
            // check if the user is already logged in
            if (!req.user) {
                connection=connConstant.connection;
                connection.query('USE ' + dbconfig.database);
                connection.query("SELECT * FROM " + dbconfig.users_table + " WHERE github_id = '" + profile.id + "'", function(err, rows){
                    if (err)
                        return done(err);

                    if (rows.length > 0) {
                        user = rows[0];
                        // if there is a user id already but no token (user was linked at one point and then removed)
                        if (user.github_token === 'undefined') {
                            user.github_token = token;//we save github token
                            var scasetoken = scasetokenCreate(35)//we create a new scase token
                            user.scase_token=scasetoken;//we save the new scase token
                            user.github_name  = profile.username;//we get the github name
                            user.github_email = (profile.emails[0].value || '').toLowerCase();//we get the e-mail if available
                            user.scase_secret = scasetokenCreate(35);
                            //var produced_signature=jwt.sign({ scasetoken : scasetoken},rows[0].scase_secret);
                            //the following query updates the user profile
                            var updateQuery = "UPDATE " + dbconfig.users_table + " SET " +
                                "`github_token` = '" + user.github_token + "', " +
                                "`github_name` = '" + user.github_name + "', " +
                                "`scase_token` = '" + user.scase_token + "', " +
                                "`github_email` = '" + user.github_email + "', " +
                                "`scase_secret` = '" +user.scase_secret + "' " +
                                "WHERE `github_id` = " + user.github_id + " LIMIT 1";
                            connection=connConstant.connection;
                            connection.query('USE ' + dbconfig.database);    
                            connection.query(updateQuery, function(err, rows) {
                                if (err)
                                    return done(err);
                                //console.log(jwt.sign({ scasetoken : user.scase_token},user.scase_secret));
                                return done(null, user);
                            });
                        }
                        return done(null, user); // user found, return that user
                    } else {
                        // if there is no user, create them
                        var newUser            = {};
                        newUser.github_id    = profile.id;
                        newUser.github_token = token;
                        var scasetoken = scasetokenCreate(35)
                        newUser.scase_token=scasetoken;
                        newUser.github_name  = profile.username;
                        newUser.github_email = (profile.emails[0].value || '').toLowerCase();
                        newUser.scase_secret = scasetokenCreate(35);
                        //we insert the user in the DB
                        var insertQuery = "INSERT INTO " + dbconfig.users_table + " " +
                            "( `github_id`, `github_token`, `scase_token`,`scase_secret`, `github_name`, `github_email` ) " +
                            "values ('" +  newUser.github_id + "','" + 
                                newUser.github_token + "', '" + 
                                newUser.scase_token + "', '" + 
                                newUser.scase_secret + "', '" + 
                                newUser.github_name + "', '" + 
                                newUser.github_email + "')";
                        connection=connConstant.connection;
                        connection.query('USE ' + dbconfig.database);
                        connection.query(insertQuery, function(err, rows) {
                            newUser.id = rows.insertId;
                            //console.log('I got'+newUser.github_id);
                            //console.log(jwt.sign({ scasetoken : newUser.scase_token},newUser.scase_secret));
                            return done(null, newUser);
                        });
                    }
                });
            } else {
                // user already exists and is logged in, we have to link accounts (this is if we decide to add and other login options)
                //handleDisconnect();
                connection=connConstant.connection;
                connection.query('USE ' + dbconfig.database);
                var user            = req.user; // pull the user out of the session
                user.github_id    = profile.id;
                user.github_token = token;
                user.github_name = profile.username;
                user.github_email = (profile.emails[0].value || '').toLowerCase();
                var scasetoken = scasetokenCreate(35)
                user.scase_token=scasetoken;
                user.scase_secret = scasetokenCreate(35);
                var updateQuery = "UPDATE " + dbconfig.users_table + " SET " +
                    "`github_id` = " + user.github_id + ", " +
                    "`github_token` = '" + user.github_token + "', " +
                    "`scase_token` = '" + user.scase_token + "', " +
                    "`scase_secret` = '" + user.scase_secret + "', " +
                    "`github_name` = '" + user.github_name + "', " +
                    "`github_email` = '" + user.github_email + "' " +
                    "WHERE `id` = " + user.id + " LIMIT 1";
                connection=connConstant.connection;
                connection.query('USE ' + dbconfig.database);
                connection.query(updateQuery, function(err, rows) {
                    if (err)
                        return done(err);
                    //console.log(jwt.sign({ scasetoken : user.scase_token},user.scase_secret));
                    return done(null, user);
                });
            }
        });
    }));
	// =========================================================================
    // Google ================================================================
    // =========================================================================
    passport.use(new GoogleStrategy({

        clientID        : configAuth.googleAuth.clientID,
        clientSecret    : configAuth.googleAuth.clientSecret,
        callbackURL     : configAuth.googleAuth.callbackURL,
        passReqToCallback : true // allows us to pass in the req from our route (lets us check if a user is logged in or not)

    },
    function(req, token, refreshToken, profile, done) {
        // asynchronous
        process.nextTick(function() {
            // check if the user is already logged in
            //console.log(req.user);
            if (!req.user) {
                connection=connConstant.connection;
                connection.query('USE ' + dbconfig.database);
                connection.query("SELECT * FROM " + dbconfig.users_table + " WHERE google_id = '" + profile.id + "'", function(err, rows){
                    if (err)
                        return done(err);

                    if (rows.length > 0) {
                        user = rows[0];
                        // if there is a user id already but no token (user was linked at one point and then removed)
                        if (user.google_token === 'undefined') {
                        	user.google_token = token;
                            user.google_name  = profile.name;
                            var scasetoken = scasetokenCreate(35)//we create a new scase token
                            user.scase_token=scasetoken;//we save the new scase token
                            user.scase_secret = scasetokenCreate(35);
                            user.google_email = (profile.emails[0].value || '').toLowerCase();//we get the e-mail if available
                            //the following query updates the user profile
                            var updateQuery = "UPDATE " + dbconfig.users_table + " SET " +
                                "`google_token` = '" + user.google_token + "', " +
                                "`google_name` = '" + user.google_name + "', " +
                                "`scase_token` = '" + user.scase_token + "', " +
                                "`scase_secret` = '" + user.scase_secret + "', " +
                                "`google_email` = '" + user.google_email + "' " +
                                "WHERE `google_id` = " + user.google_id + " LIMIT 1";
                            connection=connConstant.connection;
                            connection.query('USE ' + dbconfig.database);    
                            connection.query(updateQuery, function(err, rows) {
                                if (err)
                                    return done(err);
                                //console.log(user.scase_secret);
                                return done(null, user);
                            });
                        }
                        return done(null, user); // user found, return that user
                    } else {
                        // if there is no user, create them
                        var newUser            = {};
                        //console.log(profile)
                        newUser.google_id    = profile.id;
                        newUser.google_token = token;
                        var scasetoken = scasetokenCreate(35)
                        newUser.scase_token=scasetoken;
                        newUser.google_name  = profile.name;
                        newUser.google_email = (profile.emails[0].value || '').toLowerCase();
                        newUser.scase_secret = scasetokenCreate(35);
                        //we insert the user in the DB
                        var insertQuery = "INSERT INTO " + dbconfig.users_table + " " +
                            "( `google_id`, `google_token`, `scase_token`,`scase_secret`, `google_name`, `google_email` ) " +
                            "values ('" +  newUser.google_id + "','" + 
                                newUser.google_token + "', '" + 
                                newUser.scase_token + "', '" + 
                                newUser.scase_secret + "', '" + 
                                newUser.google_name + "', '" + 
                                newUser.google_email + "')";
                        //console.log(insertQuery);
                        connection=connConstant.connection;
                        connection.query('USE ' + dbconfig.database);
                        connection.query(insertQuery, function(err, rows) {
                            newUser.id = rows.insertId;
                            //console.log('I got'+newUser.github_id);
                            //console.log(newUser.scase_secret);
                            return done(null, newUser);
                        });
                    }
                });
            } else {
                // user already exists and is logged in, we have to link accounts (this is if we decide to add and other login options)
                //handleDisconnect();
                connection=connConstant.connection;
                connection.query('USE ' + dbconfig.database);
                var user            = req.user; // pull the user out of the session
                user.google_id    = profile.id;
                user.google_token = token;
                user.google_name = profile.name;
                user.google_email = (profile.emails[0].value || '').toLowerCase();
                var scasetoken = scasetokenCreate(35)
                user.scase_token=scasetoken;
                user.scase_secret = scasetokenCreate(35);
                var updateQuery = "UPDATE " + dbconfig.users_table + " SET " +
                    "`google_id` = " + user.google_id + ", " +
                    "`google_token` = '" + user.google_token + "', " +
                    "`scase_token` = '" + user.scase_token + "', " +
                    "`scase_secret` = '" + user.scase_secret + "', " +
                    "`google_name` = '" + user.google_name + "', " +
                    "`google_email` = '" + user.google_email + "' " +
                    "WHERE `id` = " + user.id + " LIMIT 1";
                connection=connConstant.connection;
                connection.query('USE ' + dbconfig.database);
                connection.query(updateQuery, function(err, rows) {
                    if (err)
                        return done(err);
                   //console.log(user.scase_secret);
                    return done(null, user);
                });
            }
        });
    }));

};

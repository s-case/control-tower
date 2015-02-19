// load all the things we need
var GithubStrategy   = require('passport-github').Strategy;
// load up the user model
var mysql = require('mysql');
var bcrypt = require('bcrypt-nodejs');
var dbconfig = require('./database');
//var connection = mysql.createConnection(dbconfig.connection);


// load the authorization variables
var configAuth = require('./auth'); // use this one for testing
//var configAuth = require('./secretAuth'); // use this one for prod

//=============the following are used to create the s-case token===============
var crypto = require('crypto');
var base64url = require('base64url');

function scasetokenCreate(size){
    return base64url(crypto.randomBytes(size));
}
//============================================================================
var connection;
//===================this function is for handling MySQL timeouts======================
function handleDisconnect() {
      connection = mysql.createConnection(dbconfig.connection); // Recreate the connection, since
                                                      // the old one cannot be reused.

      connection.connect(function(err) {              // The server is either down
        if(err) {                                     // or restarting (takes a while sometimes).
          console.log('error when connecting to db:', err);
          setTimeout(handleDisconnect, 10000); // We introduce a delay before attempting to reconnect,
        }                                     // to avoid a hot loop, and to allow our node script to
      });                                     // process asynchronous requests in the meantime.
                                              // If you're also serving http, display a 503 error.
      connection.on('error', function(err) {
        console.log('db error', err);
        if(err.code === 'PROTOCOL_CONNECTION_LOST') { // Connection to the MySQL server is usually
          handleDisconnect();                         // lost due to either server restart, or a
        } else {                                      // connnection idle timeout (the wait_timeout
          throw err;                                  // server variable configures this)
        }
      });
      //console.log('new mysql connection');
}
//==================================


module.exports = function(passport) {
    handleDisconnect();//we create a connection to the DB
    connection.query('USE ' + dbconfig.database);// we use the DB

    // =========================================================================
    // passport session setup ==================================================
    // =========================================================================
    // required for persistent login sessions
    // passport needs ability to serialize and unserialize users out of session

    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        connection.query("SELECT * FROM " + dbconfig.users_table + " WHERE `id` = "+ id, function(err, rows){
            if(rows[0]){
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
                handleDisconnect();
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
                            //the following query updates the user profile
                            var updateQuery = "UPDATE " + dbconfig.users_table + " SET " +
                                "`github_token` = '" + user.github_token + "', " +
                                "`github_name` = '" + user.github_name + "', " +
                                "`scase_token` = '" + user.scase_token + "', " +
                                "`github_email` = '" + user.github_email + "' " +
                                "WHERE `github_id` = " + user.github_id + " LIMIT 1";
                            handleDisconnect();
                            connection.query('USE ' + dbconfig.database);    
                            connection.query(updateQuery, function(err, rows) {
                                if (err)
                                    return done(err);

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
                        //we insert the user in the DB
                        var insertQuery = "INSERT INTO " + dbconfig.users_table + " " +
                            "( `github_id`, `github_token`, `scase_token`, `github_name`, `github_email` ) " +
                            "values ('" +  newUser.github_id + "','" + 
                                newUser.github_token + "', '" + 
                                newUser.scase_token + "', '" + 
                                newUser.github_name + "', '" + 
                                newUser.github_email + "')";
                        handleDisconnect();
                        connection.query('USE ' + dbconfig.database);
                        connection.query(insertQuery, function(err, rows) {
                            newUser.id = rows.insertId;
                            //console.log('I got'+newUser.github_id);
                            return done(null, newUser);
                        });
                    }
                });
            } else {
                // user already exists and is logged in, we have to link accounts (this is if we decide to add and other login options)
                handleDisconnect();
                connection.query('USE ' + dbconfig.database);
                var user            = req.user; // pull the user out of the session
                user.github_id    = profile.id;
                user.github_token = token;
                user.github_name = profile.username;
                user.github_email = (profile.emails[0].value || '').toLowerCase();
                var scasetoken = scasetokenCreate(35)
                user.scase_token=scasetoken;
                var updateQuery = "UPDATE " + dbconfig.users_table + " SET " +
                    "`github_id` = " + user.github_id + ", " +
                    "`github_token` = '" + user.github_token + "', " +
                    "`scase_token` = '" + user.scase_token + "', " +
                    "`github_name` = '" + user.github_name + "', " +
                    "`github_email` = '" + user.github_email + "' " +
                    "WHERE `id` = " + user.id + " LIMIT 1";
                handleDisconnect();
                connection.query('USE ' + dbconfig.database);
                connection.query(updateQuery, function(err, rows) {
                    if (err)
                        return done(err);

                    return done(null, user);
                });
            }
        });
    }));

};

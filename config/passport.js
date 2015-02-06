// load all the things we need
var GithubStrategy   = require('passport-github').Strategy;
// load up the user model
var mysql = require('mysql');
var bcrypt = require('bcrypt-nodejs');
var dbconfig = require('./database');
var connection = mysql.createConnection(dbconfig.connection);

connection.query('USE ' + dbconfig.database);

// load the auth variables
var configAuth = require('./auth'); // use this one for testing
//var configAuth = require('./secretAuth'); // use this one for prod
var crypto = require('crypto');
var base64url = require('base64url');

function scasetokenCreate(size){
    return base64url(crypto.randomBytes(size));

}
module.exports = function(passport) {

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
            done(err, rows[0]);
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

                connection.query("SELECT * FROM " + dbconfig.users_table + " WHERE github_id = '" + profile.id + "'", function(err, rows){
                    if (err)
                        return done(err);

                    if (rows.length > 0) {
                        user = rows[0];

                        // if there is a user id already but no token (user was linked at one point and then removed)
                        if (user.github_token === 'undefined') {
                            user.github_token = token;
                            var scasetoken = scasetokenCreate(35)
                            user.scase_token=scasetoken;
                            user.github_name  = profile.displayName;
                            user.github_email = (profile.emails[0].value || '').toLowerCase();

                            var updateQuery = "UPDATE " + dbconfig.users_table + " SET " +
                                "`github_token` = '" + user.github_token + "', " +
                                "`github_name` = '" + user.github_name + "', " +
                                "`scase_token` = '" + user.scase_token + "', " +
                                "`github_email` = '" + user.github_email + "' " +
                                "WHERE `github_id` = " + user.github_id + " LIMIT 1";

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
                        newUser.github_name  = profile.displayName;
                        newUser.github_email = (profile.emails[0].value || '').toLowerCase();
                        var insertQuery = "INSERT INTO " + dbconfig.users_table + " " +
                            "( `github_id`, `github_token`, `scase_token`, `github_name`, `github_email` ) " +
                            "values ('" +  newUser.github_id + "','" + 
                                newUser.github_token + "', '" + 
                                newUser.scase_token + "', '" + 
                                newUser.github_name + "', '" + 
                                newUser.github_email + "')";

                        connection.query(insertQuery, function(err, rows) {
                            newUser.id = rows.insertId;
                            //console.log('I got'+newUser.github_id);
                            return done(null, newUser);
                        });
                    }
                });
            } else {
                // user already exists and is logged in, we have to link accounts
                var user            = req.user; // pull the user out of the session
                user.github_id    = profile.id;
                user.github_token = token;
                user.github_name = profile.displayName;
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

                connection.query(updateQuery, function(err, rows) {
                    if (err)
                        return done(err);

                    return done(null, user);
                });
            }
        });
    }));

};

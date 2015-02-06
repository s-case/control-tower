/**
 * Created by barrett on 8/28/14.
 */

var mysql = require('mysql');
var dbconfig = require('../config/database');

var connection = mysql.createConnection(dbconfig.connection);

connection.query('CREATE DATABASE ' + dbconfig.database);

connection.query('\
CREATE TABLE `' + dbconfig.database + '`.`' + dbconfig.users_table + '` ( \
    `id`                  INT UNSIGNED NOT NULL  AUTO_INCREMENT, \
    `github_id`         INT UNSIGNED NULL, \
    `github_token`      CHAR(223)    NULL, \
    `github_name`       VARCHAR(100) NULL, \
    `github_email`      VARCHAR(100) NULL, \
    `google_id`           VARCHAR(50)  NULL, \
    `google_token`        CHAR(67)     NULL, \
    `google_name`         VARCHAR(100) NULL, \
    `google_email`        VARCHAR(100) NULL, \
    PRIMARY KEY (`id`), \
    UNIQUE INDEX `id_UNIQUE` (`id` ASC), \
    UNIQUE INDEX `github_id_UNIQUE` (`github_id` ASC), \
    UNIQUE INDEX `github_token_UNIQUE` (`github_token` ASC), \
    UNIQUE INDEX `google_id_UNIQUE` (`google_id` ASC), \
    UNIQUE INDEX `google_token_UNIQUE` (`google_token` ASC) \
)');

console.log('Success: Database Created!')

connection.end();

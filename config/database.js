// config/database.js
module.exports = {
    'connection': {
        'host': 'localhost',
        'user': process.env.SCASECT_ADMIN,
        'password': process.env.SCASECT_PWD
    },
    'database': 'CTDB',
    'users_table': 'users',
    'projects_table' : 'projects',
    'owners_table' : 'owners',
    'collaborators_table' : 'collaborators'
};
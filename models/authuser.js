// authuser.js

var base = require('./_base.js');

exports = module.exports = function(warp) {
    return base.defineModel(warp, 'AuthUser', [
        base.column_id('user_id'),
        base.column_varchar_50('auth_provider'),
        base.column_varchar_100('auth_id', { unique: true }),
        base.column_varchar_100('auth_token'),
        base.column_bigint('expires_time')
    ], {
        table: 'auth_users'
    });
};
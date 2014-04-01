// page.js

var base = require('./_base.js');

exports = module.exports = function(warp) {
    return base.defineModel(warp, 'Page', [
        base.column_varchar_100('alias', { unique: true, validate: { isLowercase: true }}),
        base.column_id('content_id'),
        base.column_boolean('draft'),
        base.column_varchar_100('name'),
        base.column_varchar_1000('tags')
    ], {
        table: 'pages'
    });
};
'use strict';

/**
 * management pages.
 * 
 * author: Michael Liao
 */

const
    _ = require('lodash'),
    fs = require('fs'),
    moment = require('moment'),
    db = require('../db'),
    api = require('../api'),
    cache = require('../cache'),
    helper = require('../helper'),
    logger = require('../logger'),
    constants = require('../constants'),
    adApi = require('./adApi'),
    userApi = require('./userApi'),
    wikiApi = require('./wikiApi'),
    discussApi = require('./discussApi'),
    articleApi = require('./articleApi'),
    webpageApi = require('./webpageApi'),
    settingApi = require('./settingApi'),
    categoryApi = require('./categoryApi'),
    attachmentApi = require('./attachmentApi'),
    navigationApi = require('./navigationApi'),
    User = db.User,
    Article = db.Article,
    Category = db.Category,
    apisList = [categoryApi, articleApi, webpageApi, wikiApi, discussApi, attachmentApi, navigationApi, userApi, settingApi];

// do management console

const KEY_WEBSITE = constants.cache.WEBSITE;

function _getId(ctx) {
    let id = ctx.request.query.id;
    if (id) {
        return id;
    }
    throw api.notFound('id');
}

async function _getModel(model) {
    model = model || {};
    model.__website__ = await settingApi.getWebsiteSettings();
    return model;
}

module.exports = {

    // authenticate page:
    'GET /manage/signin': async (ctx, next) => {
        ctx.render('manage/signin.html', await _getModel());
    },

    // redirect:
    'GET /manage/': async (ctx, next) => {
        ctx.response.redirect('/manage/discuss/topic_list');
    },

    // overview ///////////////////////////////////////////////////////////////

    'GET /manage/overview/(index)?': async (ctx, next) => {
        let page = helper.getPage(ctx.request);
        ctx.body = 'TODO';
    },

    // article ////////////////////////////////////////////////////////////////

    'GET /manage/article/(article_list)?': async (ctx, next) => {
        ctx.render('manage/article/article_list.html', await _getModel({
            pageIndex: helper.getPageIndex(ctx.request)
        }));
    },

    'GET /manage/article/category_list': async (ctx, next) => {
        ctx.render('manage/article/category_list.html', await _getModel({
            pageIndex: helper.getPageIndex(ctx.request)
        }));
    },

    'GET /manage/article/create_article': async (ctx, next) => {
        ctx.render('manage/article/article_form.html', await _getModel({
            form: {
                name: 'Create article',
                action: '/api/articles',
                redirect: 'article_list'
            }
        }));
    },

    'GET /manage/article/edit_article': async (ctx, next) => {
        let id = _getId(ctx);
        ctx.render('manage/article/article_form.html', await _getModel({
            id: id,
            form: {
                name: 'Edit article',
                action: '/api/articles/' + id,
                redirect: 'article_list'
            }
        }));
    },

    'GET /manage/article/create_category': async (ctx, next) => {
        ctx.render('manage/article/category_form.html', await _getModel({
            form: {
                name: 'Create category',
                action: '/api/categories',
                redirect: 'category_list'
            }
        }));
    },

    'GET /manage/article/edit_category': async (ctx, next) => {
        let id = _getId(ctx);
        ctx.render('manage/article/category_form.html', await _getModel({
            id: id,
            form: {
                name: 'Edit category',
                action: '/api/categories/' + id,
                redirect: 'category_list'
            }
        }));
    },

    // webpage ////////////////////////////////////////////////////////////////

    'GET /manage/webpage/(webpage_list)?': async (ctx, next) => {
        ctx.render('manage/webpage/webpage_list.html', await _getModel({}));
    },

    'GET /manage/webpage/create_webpage': async (ctx, next) => {
        ctx.render('manage/webpage/webpage_form.html', await _getModel({
            form: {
                name: 'Create web page',
                action: '/api/webpages',
                redirect: 'webpage_list'
            },
        }));
    },

    'GET /manage/webpage/edit_webpage': async (ctx, next) => {
        let id = _getId(ctx);
        ctx.render('manage/webpage/webpage_form.html', await _getModel({
            id: id,
            form: {
                name: 'Edit Web Page',
                action: '/api/webpages/' + id,
                redirect: 'webpage_list'
            },
        }));
    },

    // wiki ///////////////////////////////////////////////////////////////////

    'GET /manage/wiki/(wiki_list)?': async (ctx, next) => {
        ctx.render('manage/wiki/wiki_list.html', await _getModel({}));
    },

    'GET /manage/wiki/create_wiki': async (ctx, next) => {
        ctx.render('manage/wiki/wiki_form.html', await _getModel({
            form: {
                name: 'Create Wiki',
                action: '/api/wikis',
                redirect: 'wiki_list'
            }
        }));
    },

    'GET /manage/wiki/edit_wiki': async (ctx, next) => {
        let id = _getId(ctx);
        ctx.render('manage/wiki/wiki_form.html', await _getModel({
            id: id,
            form: {
                name: 'Edit Wiki',
                action: '/api/wikis/' + id,
                redirect: 'wiki_tree?id=' + id
            }
        }));
    },

    'GET /manage/wiki/wiki_tree': async (ctx, next) => {
        let id = _getId(ctx);
        ctx.render('manage/wiki/wiki_tree.html', await _getModel({
            id: id
        }));
    },

    'GET /manage/wiki/edit_wikipage': async (ctx, next) => {
        let
            id = _getId(ctx),
            wp = await wikiApi.getWikiPage(id);
        ctx.render('manage/wiki/wikipage_form.html', await _getModel({
            id: id,
            form: {
                name: 'Edit Wiki Page',
                action: '/api/wikis/wikipages/' + id,
                redirect: 'wiki_tree?id=' + wp.wiki_id
            }
        }));
    },

    // board //////////////////////////////////////////////////////////////////

    'GET /manage/discuss/(board_list)?': async (ctx, next) => {
        ctx.render('manage/discuss/board_list.html', await _getModel({}));
    },

    'GET /manage/discuss/create_board': async (ctx, next) => {
        ctx.render('manage/discuss/board_form.html', await _getModel({
            form: {
                name: 'Create Board',
                action: '/api/boards',
                redirect: 'board_list'
            }
        }));
    },

    'GET /manage/discuss/edit_board': async (ctx, next) => {
        let id = _getId(ctx);
        ctx.render('manage/discuss/board_form.html', await _getModel({
            id: id,
            form: {
                name: 'Edit Board',
                action: '/api/boards/' + id,
                redirect: 'board_list'
            }
        }));
    },

    'GET /manage/discuss/reply_list': async (ctx, next) => {
        ctx.render('manage/discuss/reply_list.html', await _getModel({
            pageIndex: helper.getPageIndex(ctx.request)
        }));
    },

    'GET /manage/discuss/topic_list': async (ctx, next) => {
        ctx.render('manage/discuss/topic_list.html', await _getModel({
            pageIndex: helper.getPageIndex(ctx.request)
        }));
    },

    // attachment /////////////////////////////////////////////////////////////

    'GET /manage/attachment/(attachment_list)?': async (ctx, next) => {
        ctx.render('manage/attachment/attachment_list.html', await _getModel({
            pageIndex: helper.getPageIndex(ctx.request)
        }));
    },

    // user ///////////////////////////////////////////////////////////////////

    'GET /manage/user/(user_list)?': async (ctx, next) => {
        ctx.render('manage/user/user_list.html', await _getModel({
            q: ctx.request.query.q || '',
            currentTime: Date.now(),
            pageIndex: helper.getPageIndex(ctx.request)
        }));
    },

    // navigation /////////////////////////////////////////////////////////////

    'GET /manage/navigation/(navigation_list)?': async (ctx, next) => {
        ctx.render('manage/navigation/navigation_list.html', await _getModel({}));
    },

    'GET /manage/navigation/create_navigation': async (ctx, next) => {
        ctx.render('manage/navigation/navigation_form.html', await _getModel({
            form: {
                name: 'Create Navigation',
                action: '/api/navigations',
                redirect: 'navigation_list'
            }
        }));
    },

    // ad /////////////////////////////////////////////////////////////////////

    'GET /manage/ad/(adslot_list)?': async (ctx, next) => {
        ctx.render('manage/ad/adslot_list.html', await _getModel({}));
    },

    'GET /manage/ad/create_adslot': async (ctx, next) => {
        ctx.render('manage/ad/adslot_form.html', await _getModel({
            form: {
                name: 'Create ad slot',
                action: '/api/adslots',
                redirect: 'adslot_list'
            },
        }));
    },

    'GET /manage/ad/edit_adslot': async (ctx, next) => {
        let id = _getId(ctx);
        ctx.render('manage/ad/adslot_form.html', await _getModel({
            id: id,
            form: {
                name: 'Edit ad slot',
                action: '/api/adslots/' + id,
                redirect: 'adslot_list'
            },
        }));
    },

    'GET /manage/ad/adperiod_list': async (ctx, next) => {
        let today = moment().format('YYYY-MM-DD');
        ctx.render('manage/ad/adperiod_list.html', await _getModel({
            today: today
        }));
    },

    'GET /manage/ad/create_adperiod': async (ctx, next) => {
        let sponsors = await User.findAll({
            where: {
                role: constants.role.SPONSOR
            },
            order: 'name'
        });
        ctx.render('manage/ad/adperiod_form.html', await _getModel({
            sponsors: sponsors,
            form: {
                name: 'Create Ad Period',
                action: '/api/adperiods',
                redirect: 'adperiod_list'
            },
        }));
    },

    'GET /manage/ad/admaterial_list': async (ctx, next) => {
        ctx.render('manage/ad/admaterial_list.html', await _getModel({}));
    },

    // setting ////////////////////////////////////////////////////////////////

    'GET /manage/setting/': async (ctx, next) => {
        ctx.response.redirect('/manage/setting/website');
    },

    'GET /manage/setting/:g': async (ctx, next) => {
        let g = ctx.params.g;
        ctx.render('manage/setting/setting_form.html', await _getModel({
            tabs: [
                {
                    key: 'website',
                    name: 'Website'
                },
                {
                    key: 'snippets',
                    name: 'Snippets'
                }
            ],
            group: g,
            form: {
                name: 'Edit settings',
                action: '/api/settings/' + g,
                redirect: g
            }
        }));
    }
};

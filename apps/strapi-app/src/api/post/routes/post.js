'use strict';

/**
 * post router.
 */

const { createCoreRouter } = require('@strapi/strapi').factories;
const { customRouter } = require('../../../utils')

const defaultRouter  =  createCoreRouter('api::post.post')

module.exports = customRouter(defaultRouter, [
{
    method: "GET",
    path: "/custom/posts",
    handler: "api::post.post.customPost",
}]);

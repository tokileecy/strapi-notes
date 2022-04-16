'use strict';

/**
 *  post controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::post.post', ({strapi}) => ({
  async customPost(ctx) {
    const tagIds = ctx.query?.filters?.tags?.$has_some

    const datas = await strapi.service('api::post.post').customPost(tagIds);

    ctx.body = datas
  },
}));
 
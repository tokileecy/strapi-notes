'use strict';

/**
 * post service.
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::post.post', ({ strapi }) => ({
  async customPost(tagIds = []) {
    const knex = strapi.db.connection

    const groupPostId = knex.select([
      'posts_tags_links.post_id',
      knex.raw(`
        json_agg(
          posts_tags_links.tag_id
        ) as tag_ids
      `),
    ]).from('posts_tags_links')
      .leftJoin('posts', 'posts_tags_links.post_id', 'posts.id')
      .whereIn('tag_id', tagIds)
      .groupBy('posts_tags_links.post_id')
      .as('group_post_tags')

    const data = await knex.select([
      'id',
      'content',
      'name',
      'created_at',
      'updated_at',
      'published_at',
      'created_by_id',
      'updated_by_id',
      'tag_ids',
    ]).from('posts')
      .rightJoin(
        groupPostId,
        'group_post_tags.post_id', 
        'posts.id',
      )
      
    return data
  },
}));

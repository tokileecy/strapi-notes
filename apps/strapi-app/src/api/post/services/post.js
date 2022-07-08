'use strict';

/**
 * post service.
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::post.post', ({ strapi }) => ({
  async customPost(tagIds = []) {
    const knex = strapi.db.connection

    let groupPostId = knex.select([
      'posts_tags_links.post_id',
      knex.raw(`
        json_agg(
          posts_tags_links.tag_id
        ) as tag_ids
      `),
    ]).from('posts_tags_links')
      .leftJoin('posts', 'posts_tags_links.post_id', 'posts.id')

    if(tagIds.length !== 0) {
      groupPostId = groupPostId.whereIn('tag_id', tagIds)
    }
    
    groupPostId = groupPostId.groupBy('posts_tags_links.post_id')
      .as('group_post_tags')

    let data = knex.select([
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
      .whereNot('published_at', null)

      if(tagIds.length !== 0) {
        data = data.rightJoin(
          groupPostId,
          'group_post_tags.post_id', 
          'posts.id',
        ).orderBy('created_at', 'desc')
      } else {
        data = data.leftJoin(
          groupPostId,
          'group_post_tags.post_id', 
          'posts.id',
        ).orderBy('created_at', 'desc')
      }

    return await data
  },
}));

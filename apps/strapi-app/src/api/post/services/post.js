'use strict';

/**
 * post service.
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::post.post', ({ strapi }) => ({
  async customPost(tagIds = []) {
    const knex = strapi.db.connection

    let groupPostId = knex.select([
      'post_id',
      knex.raw(`
        json_agg(
          (SELECT CAST (tag_id AS Varchar))
        ) as tag_ids
      `),
    ]).from('posts_tags_links')
      .leftJoin('posts', 'post_id', 'posts.id')

    if(tagIds.length !== 0) {
      groupPostId = groupPostId.whereIn('tag_id', tagIds)
    }
    
    groupPostId = groupPostId.groupBy('posts_tags_links.post_id')
      .as('group_post_tags')

    let data = knex.select([
      knex.raw(`CAST(id AS Varchar)`),
      'content',
      'name',
      'created_at',
      'updated_at',
      'published_at',
      knex.raw(`CAST(created_by_id AS Varchar)`),
      knex.raw(`CAST(updated_by_id AS Varchar)`),
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

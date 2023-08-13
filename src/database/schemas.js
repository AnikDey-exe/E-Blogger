export const BlogSchema = {
  name: 'Blog',
  properties: {
    _id: 'string',
    author: 'string',
    blogId: 'string',
    content: 'string',
    date: 'string',
    hashtagCategory: 'string',
    likedBy: 'string[]',
    status: 'string',
    thumbnail: 'string?',
    title: 'string',
  },
  primaryKey: '_id',
};

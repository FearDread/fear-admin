const { getObjectId, getObjectIds } = require('../utils/utils.js');

const posts = [
  {
    id: getObjectId('post1'),
    title: '',
    description: '',
    tags: ['sample', 'tags'],
    category: "Posts",
    numViews: 45,
    likes: [{

    }],
    author: "Garrett Haptonstall",
    comments: [],
    creationDate: new Date(),
  },
];

module.exports = posts;
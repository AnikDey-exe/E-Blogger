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


export const CommentsSchema = {
  name: 'Comments',
  properties: {
    _id: 'string',
    author: 'string',
    commentId: 'string',
    date: 'string',
    image: 'string?',
    likedBy: 'string[]',
    message: 'string',
    utcDate: 'double',
  },
  primaryKey: '_id',
};

export const ConversationSchema = {
  name: 'Conversation',
  properties: {
    _id: 'string',
    lastMessage: 'string',
    lastMessageDate: 'string',
    lastMessageUtcDate: 'double',
    participantOne: 'string',
    participantTwo: 'string',
  },
  primaryKey: '_id',
};

export const NotificationSchema = {
  name: 'Notification',
  properties: {
    _id: 'string',
    date: 'string',
    message: 'string',
    targetedUser: 'string',
    utcDate: 'double',
  },
  primaryKey: '_id',
};

export const UsersSchema = {
  name: 'Users',
  properties: {
    _id: 'string',
    accountVisibility: 'string',
    bio: 'string',
    dateOption: 'string',
    email: 'string',
    followers: 'string[]',
    handle: 'string',
    profilePicture: 'string',
  },
  primaryKey: '_id',
};

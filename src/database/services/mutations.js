import Realm from "realm";
import { BlogSchema, CommentsSchema, ConversationSchema, NotificationSchema, UsersSchema } from "../schemas";
import { DB_APP_ID } from '@env';

export const createBlog = async (title, hashtag, content, author, status, thumbnail, date, likedBy, id) => {
    const app = new Realm.App({
        id: DB_APP_ID,
        timeout: 2000
    });

    const credentials = Realm.Credentials.anonymous();
    let user;
    let realm;

    try {
        user = await app.logIn(credentials);

        realm = await Realm.open({
            schema: [BlogSchema],
            sync: {
                user: user,
                flexible: true
            },
        });

        await realm.subscriptions.update((subs) => {
            const blogs = realm
                .objects("Blog")
            subs.add(blogs);
        });
        console.log("subscribeds")
    } catch (err) {
        console.error("Failed to log in", err);
    }

    let item;
    realm.write(() => {
        item = realm.create('Blog', {
            _id: id,
            author: author,
            blogId: id,
            content: content,
            date: date,
            hashtagCategory: hashtag,
            likedBy: likedBy,
            status: status,
            thumbnail: thumbnail,
            title: title
        })
        console.log('Created.')
    })

    setTimeout(() => {
        user.logOut()
    }, 2000)
}

export const updateBlog = async (id, content, date, hashtag, status, thumbnail, title) => {
    console.log('c', content)
    const app = new Realm.App({
        id: DB_APP_ID,
        timeout: 2000
    });

    const credentials = Realm.Credentials.anonymous();
    let user;
    let realm;

    try {
        user = await app.logIn(credentials);

        realm = await Realm.open({
            schema: [BlogSchema],
            sync: {
                user: user,
                flexible: true
            },
        });

        await realm.subscriptions.update((subs) => {
            const blogs = realm
                .objects("Blog")
            subs.add(blogs);
        });
        console.log("subscribeds")
    } catch (err) {
        console.error("Failed to log in", err);
    }

    realm.write(() => {
        const blog = realm.objects("Blog").filtered(`blogId='${id}'`)[0]
        blog.content = content
        blog.date = date
        blog.hashtagCategory = hashtag
        blog.status = status
        blog.thumbnail = thumbnail
        blog.title = title
    })

    setTimeout(() => {
        user.logOut()
    }, 2000)
}

export const publishBlog = async (id, date) => {
    const app = new Realm.App({
        id: DB_APP_ID,
        timeout: 2000
    });

    const credentials = Realm.Credentials.anonymous();
    let user;
    let realm;

    try {
        user = await app.logIn(credentials);

        realm = await Realm.open({
            schema: [BlogSchema],
            sync: {
                user: user,
                flexible: true
            },
        });

        await realm.subscriptions.update((subs) => {
            const blogs = realm
                .objects("Blog")
            subs.add(blogs);
        });
        console.log("subscribeds")
    } catch (err) {
        console.error("Failed to log in", err);
    }

    realm.write(() => {
        const blog = realm.objects("Blog").filtered(`blogId='${id}'`)[0]
        blog.status = "published"
        blog.date = date
    })

    setTimeout(() => {
        user.logOut()
    }, 2000)
}

export const likeBlog = async (id, email) => {
    const app = new Realm.App({
        id: DB_APP_ID,
        timeout: 2000
    });

    const credentials = Realm.Credentials.anonymous();
    let user;
    let realm;

    try {
        user = await app.logIn(credentials);

        realm = await Realm.open({
            schema: [BlogSchema],
            sync: {
                user: user,
                flexible: true
            },
        });

        await realm.subscriptions.update((subs) => {
            const blogs = realm
                .objects("Blog")
            subs.add(blogs);
        });
        console.log("subscribeds")
    } catch (err) {
        console.error("Failed to log in", err);
    }

    realm.write(() => {
        const blog = realm.objects("Blog").filtered(`blogId='${id}'`)[0]
        blog.likedBy = [...blog.likedBy, email]
    })

    setTimeout(() => {
        user.logOut()
    }, 2000)
}

export const unlikeBlog = async (id, email) => {
    const app = new Realm.App({
        id: DB_APP_ID,
        timeout: 2000
    });

    const credentials = Realm.Credentials.anonymous();
    let user;
    let realm;

    try {
        user = await app.logIn(credentials);

        realm = await Realm.open({
            schema: [BlogSchema],
            sync: {
                user: user,
                flexible: true
            },
        });

        await realm.subscriptions.update((subs) => {
            const blogs = realm
                .objects("Blog")
            subs.add(blogs);
        });
        console.log("subscribeds")
    } catch (err) {
        console.error("Failed to log in", err);
    }

    realm.write(() => {
        const blog = realm.objects("Blog").filtered(`blogId='${id}'`)[0]
        blog.likedBy = [...blog.likedBy.filter(item => item !== email)]
    })

    setTimeout(() => {
        user.logOut()
    }, 2000)
}

export const addComment = async (id, commentId, author, date, image, likedBy, message, utcDate, notificationId, blogAuthor, authorHandle) => {
    const app = new Realm.App({
        id: DB_APP_ID,
        timeout: 2000
    });

    const credentials = Realm.Credentials.anonymous();
    let user;
    let realm;

    try {
        user = await app.logIn(credentials);

        realm = await Realm.open({
            schema: [CommentsSchema, NotificationSchema],
            sync: {
                user: user,
                flexible: true
            },
        });

        await realm.subscriptions.update((subs) => {
            const comments = realm
                .objects("Comments")
            const notification = realm
                .objects("Notification")
            subs.add(comments);
            subs.add(notification);
        });
        console.log("subscribeds")
    } catch (err) {
        console.error("Failed to log in", err);
    }

    let item;
    let item2;
    realm.write(() => {
        item = realm.create('Comments', {
            _id: id,
            author: author,
            commentId: commentId,
            date: date,
            image: image,
            likedBy: likedBy,
            message: message,
            utcDate: utcDate
        })
        if (author !== blogAuthor) {
            item2 = realm.create('Notification', {
                _id: notificationId,
                message: `${authorHandle} has commented on your post: ${message.substring(0, 50)} ${message.length > 50 ? '...' : ''}`,
                date: date,
                utcDate: utcDate,
                targetedUser: blogAuthor
            })
        }
        console.log('Created.')
    })

    setTimeout(() => {
        user.logOut()
    }, 2000)
}

export const likeComment = async (id, email) => {
    const app = new Realm.App({
        id: DB_APP_ID,
        timeout: 2000
    });

    const credentials = Realm.Credentials.anonymous();
    let user;
    let realm;

    try {
        user = await app.logIn(credentials);

        realm = await Realm.open({
            schema: [CommentsSchema],
            sync: {
                user: user,
                flexible: true
            },
        });

        await realm.subscriptions.update((subs) => {
            const comments = realm
                .objects("Comments")
            subs.add(comments);
        });
        console.log("subscribeds")
    } catch (err) {
        console.error("Failed to log in", err);
    }

    realm.write(() => {
        const comment = realm.objects("Comments").filtered(`_id='${id}'`)[0]
        comment.likedBy = [...comment.likedBy, email]
    })

    setTimeout(() => {
        user.logOut()
    }, 2000)
}

export const unlikeComment = async (id, email) => {
    const app = new Realm.App({
        id: DB_APP_ID,
        timeout: 2000
    });

    const credentials = Realm.Credentials.anonymous();
    let user;
    let realm;

    try {
        user = await app.logIn(credentials);

        realm = await Realm.open({
            schema: [CommentsSchema],
            sync: {
                user: user,
                flexible: true
            },
        });

        await realm.subscriptions.update((subs) => {
            const comments = realm
                .objects("Comments")
            subs.add(comments);
        });
        console.log("subscribeds")
    } catch (err) {
        console.error("Failed to log in", err);
    }

    realm.write(() => {
        const comment = realm.objects("Comments").filtered(`_id='${id}'`)[0]
        comment.likedBy = [...comment.likedBy.filter(item => item !== email)]
    })

    setTimeout(() => {
        user.logOut()
    }, 2000)
}

export const registerUser = async (id, accountVisibility, bio, dateOption, email, followers, handle, profilePicture) => {
    const app = new Realm.App({
        id: DB_APP_ID,
        timeout: 2000
    });

    const credentials = Realm.Credentials.anonymous();
    let user;
    let realm;

    try {
        user = await app.logIn(credentials);

        realm = await Realm.open({
            schema: [UsersSchema],
            sync: {
                user: user,
                flexible: true
            },
        });

        await realm.subscriptions.update((subs) => {
            const users = realm
                .objects("Users")
            subs.add(users);
        });
        console.log("subscribeds")
    } catch (err) {
        console.error("Failed to log in", err);
    }

    let item;
    realm.write(() => {
        item = realm.create('Users', {
            _id: id,
            accountVisibility: accountVisibility,
            bio: bio,
            dateOption: dateOption,
            email: email,
            followers: followers,
            handle: handle,
            profilePicture: profilePicture
        })
    })
    console.log('created')

    setTimeout(() => {
        user.logOut()
    }, 2000)
}

export const followUser = async (id, email, notificationId, date, utcDate, profileHandle, targetedUser) => {
    const app = new Realm.App({
        id: DB_APP_ID,
        timeout: 2000
    });

    const credentials = Realm.Credentials.anonymous();
    let user;
    let realm;

    try {
        user = await app.logIn(credentials);

        realm = await Realm.open({
            schema: [UsersSchema, NotificationSchema],
            sync: {
                user: user,
                flexible: true
            },
        });

        await realm.subscriptions.update((subs) => {
            const users = realm
                .objects("Users")
            const notification = realm
                .objects("Notification")
            subs.add(users);
            subs.add(notification);
        });
        console.log("subscribeds")
    } catch (err) {
        console.error("Failed to log in", err);
    }

    let item;
    realm.write(() => {
        const tUser = realm.objects("Users").filtered(`_id='${id}'`)[0];
        tUser.followers = [...tUser.followers, email];
        item = realm.create('Notification', {
            _id: notificationId,
            message: `${profileHandle} has started following you`,
            date: date,
            utcDate: utcDate,
            targetedUser: targetedUser
        })
    })

    setTimeout(() => {
        user.logOut()
    }, 2000)
}

export const unfollowUser = async (id, email) => {
    const app = new Realm.App({
        id: DB_APP_ID,
        timeout: 2000
    });

    const credentials = Realm.Credentials.anonymous();
    let user;
    let realm;

    try {
        user = await app.logIn(credentials);

        realm = await Realm.open({
            schema: [UsersSchema],
            sync: {
                user: user,
                flexible: true
            },
        });

        await realm.subscriptions.update((subs) => {
            const users = realm
                .objects("Users")
            subs.add(users);
        });
        console.log("subscribeds")
    } catch (err) {
        console.error("Failed to log in", err);
    }

    realm.write(() => {
        const tUser = realm.objects("Users").filtered(`_id='${id}'`)[0];
        tUser.followers = [...tUser.followers.filter(item => item !== email)];
    })

    setTimeout(() => {
        user.logOut()
    }, 2000)
}

export const updateProfilePicture = async (email, image) => {
    const app = new Realm.App({
        id: DB_APP_ID,
        timeout: 2000
    });

    const credentials = Realm.Credentials.anonymous();
    let user;
    let realm;

    try {
        user = await app.logIn(credentials);

        realm = await Realm.open({
            schema: [UsersSchema],
            sync: {
                user: user,
                flexible: true
            },
        });

        await realm.subscriptions.update((subs) => {
            const users = realm
                .objects("Users")
            subs.add(users);
        });
        console.log("subscribeds")
    } catch (err) {
        console.error("Failed to log in", err);
    }

    realm.write(() => {
        const tUser = realm.objects("Users").filtered(`email='${email}'`)[0];
        tUser.profilePicture = image;
    })

    setTimeout(() => {
        user.logOut()
    }, 2000)
}

export const updateProfile = async (email, handle, bio) => {
    const app = new Realm.App({
        id: DB_APP_ID,
        timeout: 2000
    });

    const credentials = Realm.Credentials.anonymous();
    let user;
    let realm;

    try {
        user = await app.logIn(credentials);

        realm = await Realm.open({
            schema: [UsersSchema],
            sync: {
                user: user,
                flexible: true
            },
        });

        await realm.subscriptions.update((subs) => {
            const users = realm
                .objects("Users")
            subs.add(users);
        });
        console.log("subscribeds")
    } catch (err) {
        console.error("Failed to log in", err);
    }

    realm.write(() => {
        const tUser = realm.objects("Users").filtered(`email='${email}'`)[0];
        tUser.handle = handle;
        tUser.bio = bio;
    })

    setTimeout(() => {
        user.logOut()
    }, 2000)
}

export const updateDateOption = async (email, dateOption) => {
    const app = new Realm.App({
        id: DB_APP_ID,
        timeout: 2000
    });

    const credentials = Realm.Credentials.anonymous();
    let user;
    let realm;

    try {
        user = await app.logIn(credentials);

        realm = await Realm.open({
            schema: [UsersSchema],
            sync: {
                user: user,
                flexible: true
            },
        });

        await realm.subscriptions.update((subs) => {
            const users = realm
                .objects("Users")
            subs.add(users);
        });
        console.log("subscribeds")
    } catch (err) {
        console.error("Failed to log in", err);
    }

    realm.write(() => {
        const tUser = realm.objects("Users").filtered(`email='${email}'`)[0];
        tUser.dateOption = dateOption;
    })

    setTimeout(() => {
        user.logOut()
    }, 2000)
}

export const updateAccountVisibility = async (email, accountVisibility) => {
    const app = new Realm.App({
        id: DB_APP_ID,
        timeout: 2000
    });

    const credentials = Realm.Credentials.anonymous();
    let user;
    let realm;

    try {
        user = await app.logIn(credentials);

        realm = await Realm.open({
            schema: [UsersSchema],
            sync: {
                user: user,
                flexible: true
            },
        });

        await realm.subscriptions.update((subs) => {
            const users = realm
                .objects("Users")
            subs.add(users);
        });
        console.log("subscribeds")
    } catch (err) {
        console.error("Failed to log in", err);
    }

    realm.write(() => {
        const tUser = realm.objects("Users").filtered(`email='${email}'`)[0];
        tUser.accountVisibility = accountVisibility;
    })

    setTimeout(() => {
        user.logOut()
    }, 2000)
}

export const createConversation = async (id, email1, email2, lastMessage, lastMessageDate, lastMessageUtcDate, notificationId, profileHandle, targetedUser) => {
    const app = new Realm.App({
        id: DB_APP_ID,
        timeout: 2000
    });

    const credentials = Realm.Credentials.anonymous();
    let user;
    let realm;

    try {
        user = await app.logIn(credentials);

        realm = await Realm.open({
            schema: [ConversationSchema, NotificationSchema],
            sync: {
                user: user,
                flexible: true
            },
        });

        await realm.subscriptions.update((subs) => {
            const conversations = realm
                .objects("Conversation")
            const notification = realm
                .objects("Notification")
            subs.add(conversations);
            subs.add(notification);
        });
        console.log("subscribeds")
    } catch (err) {
        console.error("Failed to log in", err);
    }

    const conversation = realm.objects("Conversation").filtered(`participantOne='${email1}' AND participantTwo='${email2}'`);
    if (conversation.length === 0) {
        let item;
        let item2;
        let item3;
        realm.write(() => {
            item = realm.create('Conversation', {
                _id: id + 'conversation',
                lastMessage: lastMessage,
                lastMessageDate: lastMessageDate,
                lastMessageUtcDate: lastMessageUtcDate,
                participantOne: email1,
                participantTwo: email2
            })

            item2 = realm.create('Conversation', {
                _id: id + 'conversation2',
                lastMessage: lastMessage,
                lastMessageDate: lastMessageDate,
                lastMessageUtcDate: lastMessageUtcDate,
                participantOne: email2,
                participantTwo: email1
            })

            item3 = realm.create('Notification', {
                _id: notificationId,
                message: `${profileHandle} has started a conversation with you`,
                date: lastMessageDate,
                utcDate: lastMessageUtcDate,
                targetedUser: targetedUser
            })
        })
    }

    setTimeout(() => {
        user.logOut()
    }, 2000)
}

export const createNotification = async (id, message, date, utcDate, targetedUser) => {
    const app = new Realm.App({
        id: DB_APP_ID,
        timeout: 2000
    });

    const credentials = Realm.Credentials.anonymous();
    let user;
    let realm;

    try {
        user = await app.logIn(credentials);

        realm = await Realm.open({
            schema: [NotificationSchema],
            sync: {
                user: user,
                flexible: true
            },
        });

        await realm.subscriptions.update((subs) => {
            const notification = realm
                .objects("Notification")
            subs.add(notification);
        });
        console.log("subscribeds")
    } catch (err) {
        console.error("Failed to log in", err);
    }

    let item;
    realm.write(() => {
        item = realm.create('Notification', {
            _id: id,
            message: message,
            date: date,
            utcDate: utcDate,
            targetedUser: targetedUser
        })
    })

    setTimeout(() => {
        user.logOut()
    }, 2000)
}

export const deleteNotification = async (id) => {
    const app = new Realm.App({
        id: DB_APP_ID,
        timeout: 2000
    });

    const credentials = Realm.Credentials.anonymous();
    let user;
    let realm;

    try {
        user = await app.logIn(credentials);

        realm = await Realm.open({
            schema: [NotificationSchema],
            sync: {
                user: user,
                flexible: true
            },
        });

        await realm.subscriptions.update((subs) => {
            const notification = realm
                .objects("Notification")
            subs.add(notification);
        });
        console.log("subscribeds")
    } catch (err) {
        console.error("Failed to log in", err);
    }

    var notificationToDelete = realm.objects("Notification").filtered(`_id='${id}'`)

    realm.write(()=>{
        realm.delete(notificationToDelete)

        notificationToDelete = null;
    })

    setTimeout(() => {
        user.logOut()
    }, 2000)
}
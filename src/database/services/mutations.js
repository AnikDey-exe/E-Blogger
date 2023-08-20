import Realm from "realm";
import { BlogSchema, CommentsSchema } from "../schemas";
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

export const unlikeBlog = async(id, email) => {
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

export const addComment = async (id, commentId, author, date, image, likedBy, message, utcDate) => {
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

    let item;
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
        console.log('Created.')
    })

    setTimeout(() => {
        user.logOut()
    }, 2000)
}
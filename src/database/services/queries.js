import Realm from "realm";
import { BlogSchema, CommentsSchema, ConversationSchema, UsersSchema } from "../schemas";
import { DB_APP_ID } from '@env';
import { useDispatch } from 'react-redux';
import { setUsers } from "../../features/user/userSlice";

export const getComments = async (blogId) => {
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

    const blogComments = realm.objects("Comments").filtered(`commentId='${blogId}'`);
    console.log(blogComments)

    setTimeout(() => {
        user.logOut()
    }, 2000)

    return blogComments;
}

export const getUserComments = async (author) => {
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

    const blogComments = realm.objects("Comments").filtered(`author='${author}'`);

    setTimeout(() => {
        user.logOut()
    }, 2000)

    return blogComments;
}

export const isRegistered = async (email) => {
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

    const allUsers = realm.objects("Users");
    const isNotRegistered = allUsers.filtered(`email='${email}'`);

    setTimeout(() => {
        user.logOut()
    }, 2000)

    if(isNotRegistered.length === 0) {
        return [true, allUsers];
    } else {
        return [false, allUsers];
    }
}

export const getConversations = async(email) => {
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
            schema: [ConversationSchema],
            sync: {
                user: user,
                flexible: true
            },
        });

        await realm.subscriptions.update((subs) => {
            const conversations = realm
                .objects("Conversation")
            subs.add(conversations);
        });
        console.log("subscribeds")
    } catch (err) {
        console.error("Failed to log in", err);
    }

    const conversations = realm.objects("Conversation").filtered(`participantOne='${email}'`);

    setTimeout(() => {
        user.logOut()
    }, 2000);

    return conversations;
}
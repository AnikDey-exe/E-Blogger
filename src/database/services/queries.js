import Realm from "realm";
import { BlogSchema, CommentsSchema } from "../schemas";
import { DB_APP_ID } from '@env';

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
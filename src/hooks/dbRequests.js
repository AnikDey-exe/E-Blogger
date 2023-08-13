import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import Realm from 'realm';
import { setBlogs, setStatus, setError } from '../features/blog/blogSlice';
import { setUsers } from '../features/user/userSlice';
import { DB_APP_ID } from '@env';
import { BlogSchema } from '../database/schemas';

export const useFetchBlogs = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    async function fetchBlogs() {
      dispatch(setStatus('loading'))
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

      let data = realm.objects("Blog");
      console.log(data)
      dispatch(setBlogs([...data]))

      setTimeout(() => {
        user.logOut()
        dispatch(setStatus('idle'))
      }, 2000)
    }
    fetchBlogs()
  }, [])
}
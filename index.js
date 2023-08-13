/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './src/App';
import {name as appName} from './app.json';
import { Amplify } from 'aws-amplify';
import awsExports from './src/aws-exports';
import store from './src/app/store';
import { Provider } from 'react-redux';
Amplify.configure(awsExports);

const ReduxProvider = () => {
    return(
        <Provider store={store}>
            <App />
        </Provider>
    )
}

AppRegistry.registerComponent(appName, () => ReduxProvider);

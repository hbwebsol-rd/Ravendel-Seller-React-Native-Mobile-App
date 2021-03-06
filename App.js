import 'react-native-gesture-handler';
import React, {useEffect, useState, useContext} from 'react';
import Navigation from './src/navigation';
import {ThemeProvider} from 'react-native-elements';
import Colors from './src/utils/color';
import {ApolloClient} from 'apollo-client';
import {InMemoryCache} from 'apollo-cache-inmemory';
import {createUploadLink} from 'apollo-upload-client';
import {ApolloLink} from 'apollo-link';
import {ApolloProvider} from 'react-apollo';
import {ApolloProvider as ApolloHooksProvider} from '@apollo/react-hooks';
import SyncStorage from 'sync-storage';
import SplashScreen from './src/screens/components/splash-screen';
import {Context as AuthContext} from './src/context/AuthContext';

const App = () => {
  const AuthState = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(SyncStorage.get('token') || null);

  const StorageInit = async () => {
    var StorageStatus = await SyncStorage.init();
    var Token = SyncStorage.get('token') || null;
    setToken(Token);
    setLoading(false);
    // console.log('SyncStorage is ready!', StorageStatus);
    // console.log('Token', Token);
  };

  useEffect(() => {
    StorageInit();
  }, []);

  useEffect(() => {
    if (AuthState && AuthState.state && AuthState.state.token) {
      setToken(AuthState.state.token);
    }
  }, [AuthState]);

  if (loading) {
    return <SplashScreen />;
  }

  const httpLink = new createUploadLink({
    uri: 'https://ravendel-backend.hbwebsol.com/graphql',
  });

  const authLink = new ApolloLink((operation, forward) => {
    operation.setContext({
      headers: {
        authorization: token,
      },
    });
    return forward(operation);
  });

  const APclient = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache(),
  });

  /* Theme */
  const theme = {
    colors: {
      primary: Colors.primaryColor,
    },
  };

  /* For Networ API response */
  if (__DEV__) {
    import('./src/utils/reactotron').then(() =>
      console.log('Reactotron Configured'),
    );
  }

  return (
    <>
      <ApolloProvider client={APclient}>
        <ApolloHooksProvider client={APclient}>
          <ThemeProvider theme={theme}>
            <Navigation />
          </ThemeProvider>
        </ApolloHooksProvider>
      </ApolloProvider>
    </>
  );
};

export default App;

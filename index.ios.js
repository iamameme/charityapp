/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, {Component} from 'react';

import {
  Alert,
  AsyncStorage,
  AppRegistry,
  StyleSheet,
  Button,
  Platform,
  Text,
  View
} from 'react-native';
import {COLORS} from './demo/constants'
import Root from './demo/Root'
import HomePage from './pages/HomePage'

import Auth0 from 'react-native-auth0';
import { StackNavigator, TabNavigator } from 'react-navigation';

var credentials = {
  clientId: '1NmQxqvo9KIhVk7nxJCRwV5QnhnqagJX',
  domain: 'iamameme.auth0.com'
};
const auth0 = new Auth0(credentials);

class rnwatch extends Component {

  constructor (props) {
    super(props)
    this.state = {
      routes: {
        root: {
          component: Root
        }
      }
    }
  }

  renderScene (route, navigator) {
    const Component = route.component

    return (
      <Component
        navigator={navigator}
        routes={this.state.routes}
      />
    )
  }

  configureScene (route) {
    return route.config
  }

  render () {
    return (
      <Navigator
        renderScene={::this.renderScene}
        configureScene={::this.configureScene}
        initialRoute={this.state.routes.root}
        style={{backgroundColor: COLORS.purple}}
      />
    )
  }

}

class Auth0Sample extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      accessToken: null,
      userId: null
     };

    this.getAccessToken('accessToken');
    this.getAccessToken('user_id');

    this.saveAccessToken = this.saveAccessToken.bind(this);
  }

  async saveAccessToken(key,value) {
    try {
      await AsyncStorage.setItem(key, value);
    } catch (error) {
      console.log("Error saving data" + error);
    }
  }

  async getAccessToken(key) {
    try {
      const value = await AsyncStorage.getItem(key);
      var obj = {}; obj[key] = value;
      this.setState(obj);
    } catch (error) {
      console.log("Error retrieving data" + error);
    }
  }

  async resetAccessToken(key) {
    try {
      await AsyncStorage.removeItem(key);
      const value = await AsyncStorage.getItem(key);
      var obj = {}; obj[key] = value;
      this.setState(obj);
    } catch (error) {
      console.log("Error resetting data" + error);
    }
  }

  _onLogin = () => {
    auth0.webAuth
      .authorize({
        scope: 'openid profile',
        audience: 'https://' + credentials.domain + '/userinfo'
      })
      .then(credentials => {
        auth0
          .auth
          .userInfo({token: credentials.accessToken})
          .then(success => {
            this.saveAccessToken('accessToken', credentials.accessToken)
            this.saveAccessToken('user_id', success.sub)
            this.setState({ 
              userId: success.sub,
              accessToken: credentials.accessToken 
            })
          })
          .catch(error => console.error(error));
      })
      .catch(error => console.log(error));
  };

  _onLogout = () => {
    if (Platform.OS === 'android') {
      this.setState({ accessToken: null });
    } else {
      auth0.webAuth
        .clearSession({})
        .then(success => {
          this.setState({ accessToken: null });
          this.resetAccessToken('accessToken').bind(this);
          this.resetAccessToken('user_id:key').bind(this);
        })
        .catch(error => console.log(error));
    }
  };

  render() {
    const { navigate } = this.props.navigation;
    let loggedIn = this.state.accessToken === null ? false : true; 
    if (loggedIn) {
      navigate('LoggedIn');
    }
    return (
      <View style={styles.container}>
        <Text style={styles.header}>Auth0Sample - Login</Text>
        <Text>
          You are {loggedIn ? '' : 'not '}logged in. 
        </Text>
        <Button
          onPress={loggedIn ? this._onLogout : this._onLogin}
          title={loggedIn ? 'Log Out' : 'Log In'}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF'
  },
  header: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10
  }
});

const Stack = TabNavigator({
    Home: {
      screen: Auth0Sample,
    }, 
    LoggedIn: {
      screen: HomePage
    }
  },{
    initialRouteName: 'Home',
  }
);

AppRegistry.registerComponent('rnwatch', () => Stack);

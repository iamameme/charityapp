import React, {Component} from 'react';
import {
  Alert,
  AsyncStorage,
  AppRegistry,
  StyleSheet,
  Button,
  Platform,
  Text,
  View,
  Modal,
  TouchableHighlight,
  FlatList,
  SafeAreaView,
  Image
} from 'react-native';
const domain = 'http://localhost:3000';
console.disableYellowBox = true;

const styles = StyleSheet.create({
  piggybank: {
    resizeMode: 'contain',
    width: 200,
    position: 'absolute',
    top: -130,
    left: 90
  },
  shadow: {
    resizeMode: 'contain',
    width: 200,
    position: 'absolute',
    top: 205,
    left: 95
  }
});

export default class Piggybank extends Component {
    constructor (props) {
      super(props)

      this.state = {
        isLoading: true
      };    
    
    }

    render() {
        return(
            <View>
                <Image style={styles.shadow} source={require('../assets/shadow.png')} />                  
                <Image style={styles.piggybank} source={require('../assets/piggybank.png')}/> 
            </View>    
        );
    }
}
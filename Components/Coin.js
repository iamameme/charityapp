import React, {Component} from 'react';
import {
  Alert,
  AsyncStorage,
  Animated,
  Easing,
  StyleSheet,
  Button,
  Platform,
  Text,
  View,
  Modal,
  TouchableHighlight,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  Image
} from 'react-native';
const domain = 'http://localhost:3000';
import * as Progress from 'react-native-progress';
import * as Animatable from 'react-native-animatable';

export default class Coin extends Component {
    constructor (props) {
      super(props)

      this.state = {
        progress: 0,
        animationLock: false
      };    
    
      this.pressCoin = this.pressCoin.bind(this);
      this.outCoin = this.outCoin.bind(this);
      this.increaseProgress = this.increaseProgress.bind(this);
      this.interval = null;
    }

    pressCoin() {
        this.interval = setInterval(this.increaseProgress, 20);
    }

    increaseProgress() {
        this.setState({
            progress: this.state.progress + 0.01
        });
    }

    outCoin() {
        clearInterval(this.interval);
        this.setState({
            progress: 0
        });
        if (this.state.progress >= 1) {
            this.setState({
                animationLock: true
            });
        }
    }

    render() {
        var coinfront = {
            resizeMode: 'contain',
            width: 130,
            position: 'absolute',
            top: 280,
            left: 130,
            opacity: 0.25
          };
        var progressCircle = {
            marginTop: 453,
            left: 132
          };
        if (this.state.progress !== 0) {
            coinfront.opacity = this.state.progress;
        }
        if (this.state.progress > 1) {
            this.outCoin();                        
        }
        if (this.state.animationLock) {
        }
        var back = false;
        return(
            <View>
                <Animatable.Image iterationCount={'infinite'} easing="easing-out" animation={{
      from: { rotateY: back ? '0deg' : '180deg', rotate: !back ? '180deg' : '0deg' },
      to: { rotateY: back ? '360deg' : '-180deg', rotate: !back ? '180deg' : '0deg' },
    }} style={coinfront} source={require('../assets/coinfront.png')} />                                    
                <TouchableOpacity onPressIn={this.pressCoin} onPressOut={this.outCoin}>
                    <View>
                        <Progress.Circle style={progressCircle} size={120} progress={this.state.progress} />                      
                    </View>                             
                </TouchableOpacity>
            </View>    
        );
    }
}
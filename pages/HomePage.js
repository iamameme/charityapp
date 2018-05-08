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
import Piggybank from '../Components/Piggybank';
import Coin from '../Components/Coin';
const domain = 'http://localhost:3000';

const styles = StyleSheet.create({
  piggybank: {
    width: '20%'
  }
});

export default class HomePage extends Component {
    constructor (props) {
      super(props)

      this.state = {
        isLoading: true,
        dataSource: null,
        increment: 1.00,
        modalVisible: false,
        user_id: null,
        accessToken: null
      };    
      
      this.onClickDonate = this.onClickDonate.bind(this);
      this.setModalVisible = this.setModalVisible.bind(this);
    }

    async componentDidMount(){
      await this.getLocalKey('user_id');
      await this.getLocalKey('accessToken');
      
      return fetch(domain + '/api/starships/' + this.state.user_id + "?accessToken=" + this.state.accessToken)
      .then((response) => response.json())
      .then((responseJson) => {
        this.setState({
          isLoading: false,
          dataSource: responseJson.data,
        }, function(){
        });
      })
      .catch((error) =>{
        console.error(error);
      });
    }

    async getLocalKey(key) {
      try {
        const value = await AsyncStorage.getItem(key);
        var obj = {}; obj[key] = value;
        this.setState(obj, function() {
          return;
        });
      } catch (error) {
        console.log("Error retrieving data" + error);
      }
    }

    onClickDonate() {
      this.setModalVisible(false);
      
      return fetch(domain + "/api/starships?accessToken=" + this.state.accessToken, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: this.state.user_id,
          amount: this.state.increment
        })
      })
      .then((response) => response.json())
      .then((responseJson) => {
        this.afterDonation();
      })
      .catch((error) =>{
        console.error(error);
      });
    }

    setModalVisible(visible) {
      this.setState({modalVisible: visible});
    }

    afterDonation() {
      alert('Successfully donated!');
    }
  
    render () {
      return (
        <SafeAreaView>
            <Modal
              animationType="slide"
              transparent={false}
              visible={this.state.modalVisible}
              onRequestClose={() => {
                
              }}>
              <View style={{marginTop: 22}}>
                <View>
                  <Text>Hello World!</Text>

                  <TouchableHighlight
                    onPress={() => {
                      this.setModalVisible(!this.state.modalVisible);
                      alert('Modal has been closed.');
                    }}>
                    <Text>Cancel</Text>
                  </TouchableHighlight>
                  <TouchableHighlight
                    onPress={() => {
                      this.onClickDonate();
                    }}>
                    <Text>Donate Money</Text>
                  </TouchableHighlight>
                </View>
              </View>
            </Modal>
            <TouchableHighlight
              onPress={() => {
                this.setModalVisible(true);
              }}>
              <Text>Donate $1</Text>
            </TouchableHighlight>
            <FlatList
              data={this.state.dataSource}
              renderItem={({item}) => <Text>Amount: {item.amount} Time added: {item.timeadded}</Text>}
              keyExtractor={(item, index) => index}
            />
            <Piggybank />
            <Coin />
        </SafeAreaView>
      )
    }
  
  }

import React, { Component } from 'react';
import { Container, Icon, Content, List, ListItem, Thumbnail, Text, Left, Body, Right, Button, Spinner, View, Header } from 'native-base';
import { StyleSheet, Modal, TouchableHighlight, NativeModules } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import BackService from '../services/api';
import CryptoJS from "react-native-crypto-js";
import * as SecureStore from 'expo-secure-store';

export default class OrderComponent extends Component {

  constructor() {
    super();
    this.state = {
        orders: [],
        loading: true,
        modalVisible: false,
        data_code: ''
      }
  };

  setModalVisible(visible, ticket) {

    if (ticket != undefined){
      var iv = CryptoJS.lib.WordArray.random(16);
      var encrypted = CryptoJS.AES.encrypt(ticket.value, ticket.key, { iv: iv });
      var cipher = iv.concat(encrypted.ciphertext).toString(CryptoJS.enc.Base64);
  
      this.setState({data_code: cipher});
    }
    this.setState({modalVisible: visible});
  }

  updateKeys(){

    this.interval = setInterval(()=>{

      if (this.state.orders.length > 0){
        this.state.orders.map(order => {

          var key = CryptoJS.lib.WordArray.random(8);

          SecureStore.getItemAsync('token')
            .then((token) => {
              if(token !== null){
                data = {
                  'token':token,
                  'key': key.toString(),
                  'order_id': order.id
                }
                BackService.post(`ticket/`,data);
              }
          });
          
        });
      }
    },600000);

  }
  
  componentDidMount() {
    SecureStore.getItemAsync('token')
      .then((token) => {
          if(token !== null){
            BackService.get(`order/?token=${token}`)
                .then(json => {return json})
                .then((json) => {
                    this.setState({ orders: json.results },
                    this.updateKeys())
                })
                .then(() => this.setState({ loading: false }));
          }else{
            this.setState({ loading: false })
            this.props.navigation.navigate('Login');
          }
      })
  }

  render() {
    if(this.state.loading === true){
      return (
              <View>
                <Spinner style={styles.spinner} color='#ff4081' />
              </View>);
    }else{
      const { navigate } = this.props.navigation;
      return (
        <Container>
        <Content>
          <List>
          {this.state.orders.map(order =>
            <ListItem key={order.id} thumbnail onPress={() => navigate('EventDetail',{ eventDetail: order.event })}>
              <Left>
                <Thumbnail square source={{ uri: 'http://192.168.1.37:8000/uploaded/' + order.event.image_file }} />
              </Left>
              <Body>
            <Text>{order.event.title}</Text>
              <Text note numberOfLines={1}>{order.event.short_description}</Text>
              </Body>
              <Right>
                <Button transparent onPress={() => { this.setModalVisible(true, order.ticket );} }>
                  <Text note>{order.event.date}</Text>
                  <Icon ios="md-code-working" android="md-code-working" />
                </Button>
              </Right>
            </ListItem>
          )}
          <Modal
            key={this.state.data_code}
            animationType={this.state.data_code}
            transparent={false}
            visible={this.state.modalVisible}
            onRequestClose={() => {
              Alert.alert('Modal has been closed.');
            }}>
            <View style={{marginTop: 22}}>
              <View>
                <TouchableHighlight
                  onPress={() => {
                    this.setModalVisible(!this.state.modalVisible);
                  }}>
                  <QRCode
                    value={this.state.data_code}
                    logoSize={30}
                    size={250}
                    color="#3f51b5"
                  />
                </TouchableHighlight>
              </View>
            </View>
          </Modal>
          </List>
        </Content>
      </Container>
      );
    }
}}

const styles = StyleSheet.create({
  spinner: {
    marginTop:'50%',
    justifyContent: 'center',
    alignItems: 'center'
  },
  qr_code:{
    marginTop:'50%',
    justifyContent: 'center',
    alignItems: 'center'
  }
});
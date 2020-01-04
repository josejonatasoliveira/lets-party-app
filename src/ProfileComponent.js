import React, { Component } from 'react';
import { Container, Header, Content, Form, Item, Input, Button, Text } from 'native-base';
import * as SecureStore from 'expo-secure-store';
import { Updates } from 'expo';
import { Alert } from 'react-native';
import BackService from '../services/api';

export default class FormExample extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      username: '',
      password: '',
      token: '',
      get_token: true
    };
  }
  
  logout() {
    this.setState({ token: null });
    // SecureStore.deleteItemAsync('token')
    //   .then((data) => {
    //     this.setState({ token: null })
    //   });
  }

  render() {
    const { navigate } = this.props.navigation;

    SecureStore.getItemAsync('token')
      .then((token) => {
        console.log(token);
        if (token !== null && this.state.get_token === true){
          this.setState({ token: token });
          this.setState({ get_token: false });
        }
      });

    if (this.state.token !== null){
      button = (<Button
                  onPress={this.logout(this)}>
                    <Text>Logado</Text>
                </Button>);
    }else{
      button = (<Button
                  onPress={() => navigate('Login')}>
                    <Text>Logar</Text>
                </Button>);
    }
    return (
      <Container>
        <Content>
          <Form>
            <Item>
              <Input placeholder="Username"
                     value={ this.state.username }
                     onChangeText={(username) => this.setState({ username })}
              />
            </Item>
            <Item last>
              <Input placeholder="Password"
                    value={this.state.password}
                    onChangeText={(password) => this.setState({ password })}
                    placeholder={'Password'}
                    secureTextEntry={true}
              />
            </Item>
          </Form>
          { button }
        </Content>
      </Container>
    );
  }
}
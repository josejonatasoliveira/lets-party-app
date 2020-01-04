import React, { Component } from 'react';
import { StyleSheet, View, AppRegistry} from 'react-native';
import QRCode from 'react-native-qrcode-svg';
 
class QRCodeGenerator extends Component {
  constructor() {
    super();
    this.state = {
      inputValue: '',
      valueForQRCode: 'letsparty',
    };
  }

  render() {
    return (
      <View style={styles.MainContainer}>
        <QRCode
          value={this.state.valueForQRCode}
          // logo={require('../images/logo.png')}
          logoSize={30}
          size={250}
          color="#3f51b5"
        />
      </View>
    );
  };
}
 
const styles = StyleSheet.create({
  MainContainer: {
    flex: 1,
    margin: 10,
    alignItems: 'center',
    paddingTop: 40,
  }
});
 
AppRegistry.registerComponent('QRCodeGenerator', () => QRCodeGenerator);
module.exports = QRCodeGenerator;
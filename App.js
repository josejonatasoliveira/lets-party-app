
import React, { Component } from 'react';
import Home from './src/HomeComponent';
import {
    createSwitchNavigator,
    createAppContainer,
} from 'react-navigation';
import { createDrawerNavigator } from 'react-navigation-drawer';
import { createStackNavigator } from 'react-navigation-stack';
import { Alert } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import ProfileComponent from './src/ProfileComponent';
import { View, StyleSheet } from 'react-native';
import IconWithBadge from './utils/IconBadgeUtils';
import Ionicons from 'react-native-vector-icons/Ionicons';
import SideBar from './src/commons/HeaderComponent';
// import NFCComponent from './src/nfc/NFCReaderWriterComponent';
import BarcodeScannerComponent from './src/qrCode/QRCodeComponent';
import EventSearchResultComponent from './src/EventResultSearchComponent'
import OrderComponent from './src/OrderComponent';
import EventDetailComponent from './src/screens/EventDetailComponent';
import OrderCheckoutComponent from './src/OrderCheckoutComponent';
import LoginComponent from './src/screens/LoginComponent';
import SignInComponent from './src/screens/SignInComponent';

const HomeIconWithBadge = props => {
    return <IconWithBadge {...props} badgeCount={3} />;
};

const getTabBarIcon = (navigation, focused, tintColor) => {
    const { routeName } = navigation.state;
    let IconComponent = Ionicons;
    let iconName;
    if (routeName === 'Inicio') {
        iconName = `ios-home`;
        IconComponent = HomeIconWithBadge;
    } else if (routeName === 'Meus Cupons') {
        iconName = 'md-card';
    } else if (routeName === 'Profile'){
        iconName = 'md-camera';
    }

    return <IconComponent name={iconName} size={25} color={tintColor} />;
};


const DrawerNavigator = createStackNavigator({
    Profile:{
        screen: ProfileComponent,
        navigationOptions:{
            header:null
        }
    }
})

const AuthNavigator = createStackNavigator({
    Login : { 
        screen: LoginComponent,
        navigationOptions:{
            headerTitle: "Login",
            header: null
        }
    },
    SignIn : { 
        screen: SignInComponent,
        navigationOptions:{
            headerTitle: "Cadastrar",
            header: null
        }
    }
})

const OrderNavigator = createStackNavigator({
    Order: {
        screen: OrderComponent,
        navigationOptions:{
            headerTitle: 'Meus Cupons',
        }
    }
})

const HomeNavigator = createStackNavigator({
    Home:{ 
        screen: Home,
        navigationOptions:{
            headerTitle: 'Tela Inicial',
            header: null
        }
     },
    EventDetail:{ 
        screen: EventDetailComponent,
        navigationOptions:{
            headerTitle: "Detalhes do Evento",
            header: null
        }
    },
    OrderCheckout: { 
        screen: OrderCheckoutComponent,
        navigationOptions:{
            headerTitle: "Ordens",
            header: null
        }
    },
    EventResult: { 
        screen: EventSearchResultComponent,
        navigationOptions: {
            headerTitle: "Pesquisar por eventos",
            header: null
        }
    }
});


const MainNavigator = createBottomTabNavigator({
    'Inicio': { 
        screen: HomeNavigator,
        navigationOptions: {
            tabBarLabel: 'Inicio',
        },
    },
    'Meus Cupons': { 
        screen: OrderNavigator,
        navigationOptions: {
            tabBarLabel: 'Meus Cupons'
        }
    },
    },
    {
        defaultNavigationOptions: ({ navigation }) => ({
            tabBarIcon: ({ focused, tintColor }) => getTabBarIcon(navigation, focused, tintColor),
            
        }),
        tabBarOptions: {
            activeTintColor: '#ff4081',
            inactiveTintColor: 'gray',
        },
});

const drawerNavigator = createDrawerNavigator({
    "Tela Inicial": MainNavigator,
    "Meu Perfil": DrawerNavigator,
    "Logar": { screen: LoginComponent },
    },
    {
        contentComponent: SideBar
})

const AppModalStack = createStackNavigator(
    {
      App: drawerNavigator,
    },
    {
      mode: 'modal',
      headerMode: 'none',
    }
);

const AppNavigator = createSwitchNavigator({
    Menus: {
      screen: MainNavigator,
    },
    App: {
      screen: AppModalStack,
    },
    Auth: {
        screen: AuthNavigator,
    }
  });


const AppContainer = createAppContainer(AppNavigator)

export default class App extends Component {

    render() {
        return (
            
            <View style={styles.bottomBar}>
                <AppContainer />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    bottomBar: {
        flex: 1
    },
    icon: {
        color: '#ff4081',
        fontWeight: 'bold',
        fontSize: 24,
    }
})
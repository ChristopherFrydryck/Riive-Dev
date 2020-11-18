import React from 'react'
import { createStackNavigator } from 'react-navigation-stack'


import Home from '../screens/HomeScreen'
import ExternalProfile from '../screens/ExternalProfile'


const HomeNavigator = createStackNavigator({
    Home: {
        screen: Home, 
        navigationOptions: {
            header: null,
        },
    },
    ExternalProfile: {
        screen: ExternalProfile, 
    },
},
{
    initialRouteName: "Home",
    
});

export default HomeNavigator;
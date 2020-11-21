import React from 'react'
import { createStackNavigator } from 'react-navigation-stack'


import Home from '../screens/HomeScreen'
import ExternalProfile from '../screens/ExternalProfile'
import ExternalSpace from '../screens/ExternalSpace'


const HomeNavigator = createStackNavigator({
    Home: {
        screen: Home, 
       
    },
    ExternalProfile: {
        screen: ExternalProfile, 
    },
    ExternalSpace: {
        screen: ExternalSpace, 
    }
},
{
    initialRouteName: "Home",
    
});

export default HomeNavigator;
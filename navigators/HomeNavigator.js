import React from 'react'
import { createStackNavigator } from 'react-navigation-stack'


import Home from '../screens/HomeScreen'
import ExternalProfile from '../screens/ExternalProfile'
import ExternalSpace from '../screens/ExternalSpace'
import ReserveSpace from '../screens/ReserveSpace'

import AddVehicle from '../screens/AddVehicle'
import AddPayment from '../screens/AddPayment'


const HomeNavigator = createStackNavigator({
    Home: {
        screen: Home, 
       
    },
    ExternalProfile: {
        screen: ExternalProfile, 
    },
    ExternalSpace: {
        screen: ExternalSpace, 
    },
    ReserveSpace: {
        screen: ReserveSpace, 
    },
    AddVehicle: {
        screen: AddVehicle, 
    },
    AddPayment: {
        screen: AddPayment, 
    },
},
{
    initialRouteName: "Home",
    
});

export default HomeNavigator;